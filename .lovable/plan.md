
# Source Adapter Architecture for Multi-Platform Search

## Overview

This plan introduces a modular source adapter architecture to enable consistent UX across multiple resale marketplace APIs while displaying real-world listings. The initial implementation focuses on Tradera's SOAP API integration, with the architecture designed to easily accommodate eBay and other sources later.

## Architecture Design

```text
+------------------+     +-------------------+     +------------------+
|   Visual Search  | --> |  Source Adapter   | --> |   Normalized     |
|   Edge Function  |     |     Manager       |     |   Listing Schema |
+------------------+     +-------------------+     +------------------+
                                  |
            +---------------------+---------------------+
            |                     |                     |
    +-------v-------+     +-------v-------+     +-------v-------+
    |    Tradera    |     |    eBay       |     |    Local      |
    |    Adapter    |     |    Adapter    |     |    Catalog    |
    +---------------+     +---------------+     +---------------+
```

## What Will Be Built

### 1. Normalized Listing Schema

A consistent data structure for all search results regardless of source:

```text
interface NormalizedListing {
  source: string;           // tradera, ebay, local
  source_item_id: string;   // Original platform ID
  title: string;
  description: string;
  price: number;
  currency: string;         // SEK, EUR, USD
  shipping: string | null;  // Shipping info or cost
  condition: string | null; // New, Used, etc.
  brand: string | null;
  category: string | null;
  size: string | null;
  color: string | null;
  city: string | null;
  country: string | null;
  zip: string | null;
  images: string[];         // Array of image URLs
  listing_url: string;      // Direct link to listing
  seller_name: string | null;
  seller_rating: number | null;
  end_date: string | null;  // For auctions
  is_auction: boolean;
}
```

### 2. Source Adapter Interface

Each adapter implements:
- **translateQuery**: Convert AI-generated search terms to API-specific format
- **search**: Execute API call with pagination support
- **mapToNormalizedListing**: Convert source response to normalized schema
- **getSourceFilters**: Return which filters can be applied server-side
- Built-in rate limiting and caching (15-minute TTL)

### 3. Tradera SOAP Adapter

Integration with Tradera's SearchAdvanced SOAP API:
- SOAP 1.2 envelope construction
- XML response parsing
- Field mapping from Tradera response to normalized schema
- Server-side filtering: price range, category, item condition
- Pagination via PageNumber parameter

### 4. Secrets Management

Two new Supabase secrets will be added:
- `TRADERA_APP_ID` = 5636
- `TRADERA_APP_KEY` = 1da3f721-eb75-4da3-a239-377de44a0f42

### 5. Two-Stage Filtering

**Stage 1 - Source-side (where supported):**
- Price min/max
- Category (fashion/clothing categories for Tradera)
- Item condition
- Only items with thumbnails

**Stage 2 - Site-side post-processing:**
- Size matching against detected sizes
- Color validation
- Image quality checks
- Deduplication across sources

### 6. Smart AI Analysis Threshold

Visual AI analysis (for re-ranking) triggers only when:
- More than 50 results returned from sources
- Results are filtered down to max 50 using text/metadata first
- Cached analysis results are reused when available

### 7. Analysis Cache Table

New database table to store reusable analysis results:

```text
listing_analysis
├── id (uuid)
├── source (text)
├── source_item_id (text)
├── image_url (text)
├── detected_color (text)
├── garment_type (text)
├── pattern (text)
├── style (text)
├── image_embedding (vector, optional)
├── analyzed_at (timestamp)
├── expires_at (timestamp)
```

### 8. Response Cache

In-memory caching within the edge function:
- Cache key: hash of normalized query + filters
- TTL: 15 minutes
- Stored per source adapter

## Implementation Steps

### Step 1: Add Tradera API Secrets
Add `TRADERA_APP_ID` and `TRADERA_APP_KEY` to Supabase secrets

### Step 2: Create Database Table
Create `listing_analysis` table for caching analysis results

### Step 3: Refactor Edge Function
Update `supabase/functions/visual-search/index.ts`:
- Add normalized listing interface
- Create Tradera SOAP adapter with rate limiting
- Create local catalog adapter (refactor existing)
- Implement source adapter manager
- Add two-stage filtering logic
- Implement 15-minute response cache
- Add smart AI analysis threshold (>50 results)

### Step 4: Update Response Mapping
Ensure search results stored in database use normalized schema fields

## Technical Details

### Tradera SOAP Request Structure

The edge function will construct SOAP envelopes:

```text
POST /v3/SearchService.asmx
Host: api.tradera.com
Content-Type: application/soap+xml; charset=utf-8

SOAP envelope with:
- AuthenticationHeader: AppId + AppKey
- ConfigurationHeader: Sandbox=0, MaxResultAge=60
- SearchAdvanced request with:
  - SearchWords (from AI-generated queries)
  - PriceMinimum/Maximum (from budget)
  - OnlyItemsWithThumbnail=true
  - ItemsPerPage=50
  - CategoryId (fashion categories when relevant)
```

### Response Parsing

Parse XML response extracting:
- Id -> source_item_id
- ShortDescription/LongDescription -> title/description
- BuyItNowPrice or MaxBid -> price
- ThumbnailLink + ImageLinks -> images
- ItemUrl -> listing_url
- SellerAlias -> seller_name
- EndDate -> end_date
- ItemType -> is_auction detection

### Rate Limiting Strategy

- Max 2 requests per second to Tradera API
- Queue mechanism for concurrent searches
- Exponential backoff on 429/503 responses

### Files to Modify

1. **supabase/functions/visual-search/index.ts** - Major refactor
2. **src/integrations/supabase/types.ts** - Auto-updated after migration
3. **supabase/config.toml** - No changes needed

### Files Unchanged

- UI components remain the same
- `VisualSearchResults.tsx` - No changes
- `VisualSearchResultCard.tsx` - No changes (already handles normalized data)
- Navigation and styling - Preserved

## Expected Behavior

1. User uploads image and/or enters a search query -> AI extracts attributes and generates search queries
2. Source adapter manager queries Tradera + local catalog in parallel
3. Results normalized to common schema
4. Stage 1: Source-side filters applied (price, thumbnails)
5. Stage 2: Site-side filters (size, color matching)
6. If >50 results: AI vision analysis runs to filter to top 50
7. Results ranked by match score and displayed
8. Cache populated for 15-minute reuse

## Rollback Safety

- Local catalog adapter preserved as fallback
- If Tradera API fails, system gracefully falls back to local results
- Existing search functionality remains functional during implementation
