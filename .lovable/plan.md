

# Tradera SOAP API Response Parsing & Text Search Support

## Summary

This plan addresses three key areas: (1) fixing security issues with hardcoded API credentials, (2) correcting the XML response parser to match Tradera's actual SOAP 1.2 response format, and (3) adding text-based search capability alongside the existing image-based search.

## Issues Identified

### 1. Security: Hardcoded API Credentials
The `TraderaAdapter` class has credentials hardcoded as default values on lines 97-98:
```
private appId: number = 5636;
private appKey: string = "1da3f721-eb75-4da3-a239-377de44a0f42";
```
These should never appear in source code. The credentials are already configured as Supabase secrets (`TRADERA_APP_ID`, `TRADERA_APP_KEY`).

### 2. XML Response Parsing Mismatch
The current parser looks for `<Item>` tags, but the actual Tradera response uses `<Items>` (plural). Additionally:
- `ImageLinks` contains nested `<ImageLink><Url>string</Url></ImageLink>` structure
- `AttributeValues` contains `TermAttributeValues` and `NumberAttributeValues` that could extract size, brand, condition
- `SellerDsrAverage` is available for seller rating (not `SellerRating`)

### 3. Text-Based Search Not Supported
The current flow requires an image upload. Users should also be able to search by typing text queries directly.

### 4. .env File Cleanup
The `.env` file contains Tradera credentials which is unnecessary since they are stored in Supabase secrets and only used by edge functions.

## Implementation Plan

### Step 1: Remove Hardcoded Credentials from Edge Function

Update `supabase/functions/visual-search/index.ts`:

**Before:**
```typescript
class TraderaAdapter implements SourceAdapter {
  name = "tradera";
  private appId: number = 5636;
  private appKey: string = "1da3f721-eb75-4da3-a239-377de44a0f42";

  constructor() {
    this.appId = Deno.env.get("TRADERA_APP_ID") || "";
    this.appKey = Deno.env.get("TRADERA_APP_KEY") || "";
  }
```

**After:**
```typescript
class TraderaAdapter implements SourceAdapter {
  name = "tradera";
  private appId: string;
  private appKey: string;

  constructor() {
    this.appId = Deno.env.get("TRADERA_APP_ID") || "";
    this.appKey = Deno.env.get("TRADERA_APP_KEY") || "";
    if (!this.appId || !this.appKey) {
      console.warn("[Tradera] API credentials not configured");
    }
  }
```

### Step 2: Fix XML Response Parsing

Update the `parseResponse` method to handle the correct Tradera SOAP response structure:

```typescript
private parseResponse(xmlText: string): NormalizedListing[] {
  const listings: NormalizedListing[] = [];

  // Extract items from SearchAdvancedResult - note: tag is <Items> not <Item>
  const itemMatches = xmlText.match(/<Items>([\s\S]*?)<\/Items>/g) || [];

  for (const itemXml of itemMatches) {
    try {
      const listing = this.parseItem(itemXml);
      if (listing) listings.push(listing);
    } catch (e) {
      console.error("[Tradera] Parse item error:", e);
    }
  }

  // Check for errors in response
  const errorMatch = xmlText.match(/<Errors>[\s\S]*?<Code>([^<]*)<\/Code>[\s\S]*?<Message>([^<]*)<\/Message>/);
  if (errorMatch) {
    console.error(`[Tradera] API Error: ${errorMatch[1]} - ${errorMatch[2]}`);
  }

  return listings;
}
```

Update `parseItem` to correctly extract nested ImageLinks:

```typescript
private parseItem(itemXml: string): NormalizedListing | null {
  const getValue = (tag: string): string => {
    const match = itemXml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
    return match ? match[1] : "";
  };

  const id = getValue("Id");
  if (!id) return null;

  // ThumbnailLink is a direct URL
  const thumbnailLink = getValue("ThumbnailLink");
  
  // ImageLinks contains nested <ImageLink><Url>...</Url></ImageLink>
  const imageUrlMatches = itemXml.match(/<ImageLink>[\s\S]*?<Url>([^<]*)<\/Url>/g) || [];
  const imageLinks = imageUrlMatches
    .map(m => {
      const urlMatch = m.match(/<Url>([^<]*)<\/Url>/);
      return urlMatch ? urlMatch[1] : null;
    })
    .filter((url): url is string => url !== null);

  const images = [thumbnailLink, ...imageLinks].filter(Boolean);

  // Parse AttributeValues for size, brand, condition
  const attributeValues = this.parseAttributeValues(itemXml);

  const buyNowPrice = parseFloat(getValue("BuyItNowPrice")) || 0;
  const maxBid = parseFloat(getValue("MaxBid")) || 0;
  const price = buyNowPrice || maxBid || parseFloat(getValue("NextBid")) || 0;

  const itemType = getValue("ItemType");
  const isAuction = itemType?.toLowerCase().includes("auction") || 
                    (getValue("HasBids") === "true" && !buyNowPrice);

  return {
    source: "tradera",
    source_item_id: id,
    title: getValue("ShortDescription") || getValue("LongDescription") || "Untitled",
    description: getValue("LongDescription") || getValue("ShortDescription") || "",
    price,
    currency: "SEK",
    shipping: null,
    condition: attributeValues.condition || null,
    brand: attributeValues.brand || null,
    category: getValue("CategoryId") || null,
    size: attributeValues.size || null,
    color: attributeValues.color || null,
    city: null,
    country: "SE",
    zip: null,
    images,
    listing_url: getValue("ItemUrl") || `https://www.tradera.com/item/${id}`,
    seller_name: getValue("SellerAlias") || null,
    seller_rating: parseFloat(getValue("SellerDsrAverage")) || null,
    end_date: getValue("EndDate") || null,
    is_auction: isAuction,
  };
}

private parseAttributeValues(itemXml: string): { size?: string; brand?: string; condition?: string; color?: string } {
  const result: { size?: string; brand?: string; condition?: string; color?: string } = {};
  
  // Extract TermAttributeValue entries
  const termMatches = itemXml.match(/<TermAttributeValue>[\s\S]*?<Name>([^<]*)<\/Name>/g) || [];
  
  for (const term of termMatches) {
    const nameMatch = term.match(/<Name>([^<]*)<\/Name>/);
    if (nameMatch) {
      const name = nameMatch[1].toLowerCase();
      // Common Swedish attribute names
      if (name.includes("storlek") || name.includes("size")) {
        const valueMatch = itemXml.match(new RegExp(`${term}[\\s\\S]*?<Value>([^<]*)</Value>`));
        if (valueMatch) result.size = valueMatch[1];
      }
      if (name.includes("märke") || name.includes("brand")) {
        const valueMatch = itemXml.match(new RegExp(`${term}[\\s\\S]*?<Value>([^<]*)</Value>`));
        if (valueMatch) result.brand = valueMatch[1];
      }
      if (name.includes("färg") || name.includes("color")) {
        const valueMatch = itemXml.match(new RegExp(`${term}[\\s\\S]*?<Value>([^<]*)</Value>`));
        if (valueMatch) result.color = valueMatch[1];
      }
      if (name.includes("skick") || name.includes("condition")) {
        const valueMatch = itemXml.match(new RegExp(`${term}[\\s\\S]*?<Value>([^<]*)</Value>`));
        if (valueMatch) result.condition = valueMatch[1];
      }
    }
  }
  
  return result;
}
```

### Step 3: Add Text-Based Search Support

**3a. Update Edge Function Handler**

Modify the main handler in `supabase/functions/visual-search/index.ts` to accept an optional `textQuery` parameter:

```typescript
serve(async (req) => {
  // ... CORS handling ...

  const { imageUrl, searchId, cropData, budget, textQuery } = await req.json();

  // Allow either imageUrl OR textQuery
  if (!searchId || (!imageUrl && !textQuery)) {
    return new Response(JSON.stringify({ error: "Missing required fields: searchId and either imageUrl or textQuery" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // For text-only search, skip image analysis
  let attributes: ExtractedAttributes;
  if (imageUrl) {
    attributes = await extractDetailedAttributes(imageUrl, cropData, LOVABLE_API_KEY);
  } else {
    // Create synthetic attributes from text query
    attributes = createAttributesFromText(textQuery);
  }
  // ... rest of search logic
});

function createAttributesFromText(query: string): ExtractedAttributes {
  const words = query.toLowerCase().split(/\s+/);
  return {
    category: query,
    colors: { primary: "", colorFamily: "neutral" },
    material: { fabric: "" },
    pattern: { type: "" },
    construction: { silhouette: "" },
    style: { aesthetic: "" },
    distinctiveFeatures: [],
    searchQueries: {
      primary: query,
      fallback: words.slice(0, 2).join(" "),
      alternative: words[0] || "",
      keywords: words.filter(w => w.length > 2),
    },
    textDescription: query,
    visualSignature: {
      dominantColors: [],
      patternDescription: "",
      shapeDescription: "",
    },
  };
}
```

**3b. Add Text Search UI Component**

Create a new search input in the Gallery page that allows text-based queries:

```typescript
// In src/pages/Gallery.tsx or src/components/GalleryUpload.tsx
const [textQuery, setTextQuery] = useState('');

const handleTextSearch = async () => {
  if (!textQuery.trim()) return;
  navigate('/visual-search-results', { 
    state: { textQuery: textQuery.trim() } 
  });
};
```

**3c. Update VisualSearchResults Page**

Modify `src/pages/VisualSearchResults.tsx` to handle text queries:

```typescript
const { imageUrl, imageId, textQuery } = location.state || {};

// Skip crop overlay for text searches
useEffect(() => {
  if (imageUrl && !searchInitiated) {
    setShowCropOverlay(true);
  } else if (textQuery && !searchInitiated) {
    // Direct search for text queries
    setSearchInitiated(true);
    startTextSearch(textQuery);
  }
}, [imageUrl, textQuery, searchInitiated]);
```

**3d. Update useVisualSearch Hook**

Add text search method to `src/hooks/useVisualSearch.ts`:

```typescript
const startTextSearch = async (query: string, budget?: { min: number; max: number }) => {
  setLoading(true);
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data: search, error: searchError } = await supabase
      .from('visual_searches')
      .insert({
        user_id: user.user.id,
        image_url: '', // No image for text search
        status: 'pending',
        analysis_data: { textQuery: query, budget },
      })
      .select()
      .single();

    if (searchError) throw searchError;

    setCurrentSearch(search);

    const { data, error } = await supabase.functions.invoke('visual-search', {
      body: { textQuery: query, searchId: search.id, budget },
    });

    if (error) throw error;
    await fetchSearchResults(search.id);
    return search.id;
  } catch (error) {
    // ... error handling
  } finally {
    setLoading(false);
  }
};
```

### Step 4: Clean Up .env File

Remove the Tradera credentials from `.env` since they are stored in Supabase secrets:

```
VITE_SUPABASE_PROJECT_ID="gerwikyaggikykftcyxm"
VITE_SUPABASE_PUBLISHABLE_KEY="..."
VITE_SUPABASE_URL="https://gerwikyaggikykftcyxm.supabase.co"
```

## Files to Modify

1. `supabase/functions/visual-search/index.ts` - Fix credentials, XML parsing, add text search support
2. `src/hooks/useVisualSearch.ts` - Add `startTextSearch` method
3. `src/pages/VisualSearchResults.tsx` - Handle text query in state
4. `src/components/GalleryUpload.tsx` - Add text search input field
5. `.env` - Remove TRADERA_APP_ID and TRADERA_APP_KEY

## Technical Notes

### Tradera SOAP Response Structure (from documentation)
```text
<SearchAdvancedResult>
  <TotalNumberOfItems>int</TotalNumberOfItems>
  <TotalNumberOfPages>int</TotalNumberOfPages>
  <Items>
    <Id>int</Id>
    <ShortDescription>string</ShortDescription>
    <BuyItNowPrice>int</BuyItNowPrice>
    <SellerDsrAverage>double</SellerDsrAverage>
    <ImageLinks>
      <ImageLink>
        <Url>string</Url>
        <Format>string</Format>
      </ImageLink>
    </ImageLinks>
    <AttributeValues>...</AttributeValues>
  </Items>
  <Errors>...</Errors>
</SearchAdvancedResult>
```

### Security Considerations
- API credentials only exist in Supabase secrets, never in source code
- Edge functions read from `Deno.env.get()` which accesses Supabase secrets
- Frontend code never has access to these secrets

