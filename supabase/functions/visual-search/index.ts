import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================================
// NORMALIZED LISTING SCHEMA
// Consistent data structure across all source adapters
// ============================================================
interface NormalizedListing {
  source: string; // tradera, ebay, local, depop
  source_item_id: string; // Original platform ID
  title: string;
  description: string;
  price: number;
  currency: string; // SEK, EUR, USD
  shipping: string | null;
  condition: string | null;
  brand: string | null;
  category: string | null;
  size: string | null;
  color: string | null;
  city: string | null;
  country: string | null;
  zip: string | null;
  images: string[];
  listing_url: string;
  seller_name: string | null;
  seller_rating: number | null;
  end_date: string | null;
  is_auction: boolean;
}

// ============================================================
// SOURCE ADAPTER INTERFACE
// Each adapter implements these methods
// ============================================================
interface SourceAdapter {
  name: string;
  search(query: SearchQuery): Promise<NormalizedListing[]>;
  getSourceFilters(): string[];
}

interface SearchQuery {
  searchWords: string[];
  priceMin?: number;
  priceMax?: number;
  category?: string;
  condition?: string;
  size?: string;
  color?: string;
  itemsPerPage?: number;
  pageNumber?: number;
}

// ============================================================
// IN-MEMORY CACHE (15-minute TTL)
// ============================================================
const responseCache = new Map<string, { data: NormalizedListing[]; timestamp: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function getCacheKey(source: string, query: SearchQuery): string {
  return `${source}:${JSON.stringify(query)}`;
}

function getCachedResults(source: string, query: SearchQuery): NormalizedListing[] | null {
  const key = getCacheKey(source, query);
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    console.log(`Cache hit for ${source}`);
    return cached.data;
  }
  return null;
}

function setCachedResults(source: string, query: SearchQuery, data: NormalizedListing[]): void {
  const key = getCacheKey(source, query);
  responseCache.set(key, { data, timestamp: Date.now() });
  // Clean old entries
  for (const [k, v] of responseCache.entries()) {
    if (Date.now() - v.timestamp > CACHE_TTL_MS) {
      responseCache.delete(k);
    }
  }
}

// ============================================================
// TRADERA SOAP ADAPTER
// Integrates with Tradera's SearchAdvanced SOAP 1.2 API
// ============================================================
class TraderaAdapter implements SourceAdapter {
  name = "tradera";
  private appId: int = 5636;
  private appKey: string = "1da3f721-eb75-4da3-a239-377de44a0f42";
  private lastRequestTime = 0;
  private minRequestInterval = 500; // Max 2 requests/sec

  constructor() {
    this.appId = Deno.env.get("TRADERA_APP_ID") || "";
    this.appKey = Deno.env.get("TRADERA_APP_KEY") || "";
  }

  getSourceFilters(): string[] {
    return ["priceMin", "priceMax", "category", "condition", "thumbnails"];
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.minRequestInterval) {
      await new Promise((resolve) => setTimeout(resolve, this.minRequestInterval - elapsed));
    }
    this.lastRequestTime = Date.now();
  }

  async search(query: SearchQuery): Promise<NormalizedListing[]> {
    if (!this.appId || !this.appKey) {
      console.log("Tradera credentials not configured, skipping");
      return [];
    }

    // Check cache first
    const cached = getCachedResults(this.name, query);
    if (cached) return cached;

    await this.rateLimit();

    const searchWords = query.searchWords.join(" ");
    console.log(`[Tradera] Searching: "${searchWords}"`);

    const soapEnvelope = this.buildSoapEnvelope(query);

    try {
      const response = await fetch("https://api.tradera.com/v3/SearchService.asmx", {
        method: "POST",
        headers: {
          "Content-Type": "application/soap+xml; charset=utf-8",
          Host: "api.tradera.com",
        },
        body: soapEnvelope,
      });

      if (!response.ok) {
        console.error(`[Tradera] API error: ${response.status}`);
        return [];
      }

      const xmlText = await response.text();
      const listings = this.parseResponse(xmlText);

      console.log(`[Tradera] Found ${listings.length} items`);
      setCachedResults(this.name, query, listings);
      return listings;
    } catch (error) {
      console.error("[Tradera] Search error:", error);
      return [];
    }
  }

  private buildSoapEnvelope(query: SearchQuery): string {
    const searchWords = query.searchWords.join(" ");

    // Fashion category IDs for Tradera (344 = Kläder & Accessoarer)
    const categoryId = query.category ? this.mapCategory(query.category) : "";

    return `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
                 xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Header>
    <AuthenticationHeader xmlns="http://api.tradera.com">
      <AppId>${this.appId}</AppId>
      <AppKey>${this.appKey}</AppKey>
    </AuthenticationHeader>
    <ConfigurationHeader xmlns="http://api.tradera.com">
      <Sandbox>0</Sandbox>
      <MaxResultAge>60</MaxResultAge>
    </ConfigurationHeader>
  </soap12:Header>
  <soap12:Body>
    <SearchAdvanced xmlns="http://api.tradera.com">
      <request>
        <SearchWords>${this.escapeXml(searchWords)}</SearchWords>
        ${categoryId ? `<CategoryId>${categoryId}</CategoryId>` : ""}
        <SearchInDescription>true</SearchInDescription>
        ${query.priceMin ? `<PriceMinimum>${Math.round(query.priceMin)}</PriceMinimum>` : ""}
        ${query.priceMax ? `<PriceMaximum>${Math.round(query.priceMax)}</PriceMaximum>` : ""}
        <OnlyItemsWithThumbnail>true</OnlyItemsWithThumbnail>
        <ItemsPerPage>${query.itemsPerPage || 50}</ItemsPerPage>
        <PageNumber>${query.pageNumber || 1}</PageNumber>
        ${query.condition ? `<ItemCondition>${this.mapCondition(query.condition)}</ItemCondition>` : ""}
        <OrderBy>Relevance</OrderBy>
      </request>
    </SearchAdvanced>
  </soap12:Body>
</soap12:Envelope>`;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  private mapCategory(category: string): string {
    const categoryLower = category.toLowerCase();
    // Tradera fashion category mappings
    const categoryMap: Record<string, string> = {
      dress: "344001", // Klänningar
      top: "344002", // Toppar
      pants: "344003", // Byxor
      jacket: "344004", // Jackor
      coat: "344004",
      shirt: "344002",
      blouse: "344002",
      skirt: "344005", // Kjolar
      shoes: "344006", // Skor
      bag: "344007", // Väskor
      accessories: "344008",
    };

    for (const [key, value] of Object.entries(categoryMap)) {
      if (categoryLower.includes(key)) return value;
    }
    return "344"; // Main fashion category
  }

  private mapCondition(condition: string): string {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("new")) return "New";
    if (conditionLower.includes("like new")) return "NearlyNew";
    return "Used";
  }

  private parseResponse(xmlText: string): NormalizedListing[] {
    const listings: NormalizedListing[] = [];

    // Simple XML parsing for Tradera response
    const itemMatches = xmlText.match(/<Item>([\s\S]*?)<\/Item>/g) || [];

    for (const itemXml of itemMatches) {
      try {
        const listing = this.parseItem(itemXml);
        if (listing) listings.push(listing);
      } catch (e) {
        console.error("[Tradera] Parse item error:", e);
      }
    }

    return listings;
  }

  private parseItem(itemXml: string): NormalizedListing | null {
    const getValue = (tag: string): string => {
      const match = itemXml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
      return match ? match[1] : "";
    };

    const id = getValue("Id");
    if (!id) return null;

    const thumbnailLink = getValue("ThumbnailLink");
    const imageLinks =
      itemXml.match(/<ImageLink>([^<]*)<\/ImageLink>/g)?.map((m) => m.replace(/<\/?ImageLink>/g, "")) || [];

    const images = [thumbnailLink, ...imageLinks].filter(Boolean);

    // Price parsing - prefer BuyItNowPrice, fallback to MaxBid
    const buyNowPrice = parseFloat(getValue("BuyItNowPrice")) || 0;
    const maxBid = parseFloat(getValue("MaxBid")) || 0;
    const price = buyNowPrice || maxBid || parseFloat(getValue("NextBid")) || 0;

    const itemType = getValue("ItemType");

    return {
      source: "tradera",
      source_item_id: id,
      title: getValue("ShortDescription") || getValue("LongDescription") || "Untitled",
      description: getValue("LongDescription") || getValue("ShortDescription") || "",
      price,
      currency: "SEK",
      shipping: getValue("ShippingCondition") || null,
      condition: getValue("ItemCondition") || null,
      brand: null, // Not directly available in response
      category: getValue("CategoryName") || null,
      size: null, // Would need to parse from description
      color: null, // Would need to parse from description
      city: getValue("SellerCity") || null,
      country: "SE",
      zip: getValue("ZipCode") || null,
      images,
      listing_url: getValue("ItemUrl") || `https://www.tradera.com/item/${id}`,
      seller_name: getValue("SellerAlias") || null,
      seller_rating: parseFloat(getValue("SellerRating")) || null,
      end_date: getValue("EndDate") || null,
      is_auction: itemType?.toLowerCase() === "auction" || !buyNowPrice,
    };
  }
}

// ============================================================
// LOCAL CATALOG ADAPTER
// Searches the catalog_items table
// ============================================================
class LocalCatalogAdapter implements SourceAdapter {
  name = "local";
  private supabase: any;

  constructor(supabase: any) {
    this.supabase = supabase;
  }

  getSourceFilters(): string[] {
    return ["priceMin", "priceMax"];
  }

  async search(query: SearchQuery): Promise<NormalizedListing[]> {
    // Check cache first
    const cached = getCachedResults(this.name, query);
    if (cached) return cached;

    const searchWords = query.searchWords.join(" ").toLowerCase();
    console.log(`[LocalCatalog] Searching: "${searchWords}"`);

    try {
      let dbQuery = this.supabase.from("catalog_items").select("*").eq("is_active", true);

      if (query.priceMin) {
        dbQuery = dbQuery.gte("price", query.priceMin);
      }
      if (query.priceMax) {
        dbQuery = dbQuery.lte("price", query.priceMax);
      }

      const { data: items, error } = await dbQuery.limit(50);

      if (error) {
        console.error("[LocalCatalog] Query error:", error);
        return [];
      }

      if (!items?.length) {
        console.log("[LocalCatalog] No items found");
        return [];
      }

      // Score by keyword match
      const keywords = new Set(searchWords.split(/\s+/).filter((w) => w.length > 2));

      const scoredItems = items.map((item: any) => {
        const text = `${item.title || ""} ${item.description || ""}`.toLowerCase();
        let matchCount = 0;
        keywords.forEach((kw) => {
          if (text.includes(kw)) matchCount++;
        });
        return { item, score: matchCount / Math.max(keywords.size, 1) };
      });

      // Filter and sort
      const results = scoredItems
        .filter((s: any) => s.score > 0 || items.length <= 10)
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 25)
        .map((s: any) => this.mapToNormalized(s.item));

      console.log(`[LocalCatalog] Found ${results.length} items`);
      setCachedResults(this.name, query, results);
      return results;
    } catch (error) {
      console.error("[LocalCatalog] Search error:", error);
      return [];
    }
  }

  private mapToNormalized(item: any): NormalizedListing {
    const attributes = item.attributes || {};
    return {
      source: "local",
      source_item_id: item.external_id || item.id,
      title: item.title || "",
      description: item.description || "",
      price: item.price || 0,
      currency: item.currency || "EUR",
      shipping: item.shipping_info || null,
      condition: item.condition || null,
      brand: attributes.brand || null,
      category: attributes.category || null,
      size: item.size || attributes.size || null,
      color: attributes.color || null,
      city: null,
      country: null,
      zip: null,
      images: item.image_url ? [item.image_url] : [],
      listing_url: item.item_url,
      seller_name: item.platform || null,
      seller_rating: null,
      end_date: null,
      is_auction: false,
    };
  }
}

// ============================================================
// DEPOP ADAPTER (Existing functionality preserved)
// ============================================================
class DepopAdapter implements SourceAdapter {
  name = "depop";

  getSourceFilters(): string[] {
    return ["priceMin", "priceMax"];
  }

  async search(query: SearchQuery): Promise<NormalizedListing[]> {
    // Check cache first
    const cached = getCachedResults(this.name, query);
    if (cached) return cached;

    const searchWords = query.searchWords.join(" ");
    console.log(`[Depop] Searching: "${searchWords}"`);

    try {
      const encodedQuery = encodeURIComponent(searchWords);
      let depopUrl = `https://webapi.depop.com/api/v2/search/products/?what=${encodedQuery}&itemsPerPage=24`;
      if (query.priceMin) depopUrl += `&priceMin=${query.priceMin}`;
      if (query.priceMax) depopUrl += `&priceMax=${query.priceMax}`;

      const response = await fetch(depopUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          Origin: "https://www.depop.com",
          Referer: "https://www.depop.com/",
        },
      });

      if (!response.ok) {
        console.error(`[Depop] API error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      const products = data?.products || data?.items || [];

      const results = products
        .filter((item: any) => item.description || item.title)
        .map((item: any) => this.mapToNormalized(item));

      console.log(`[Depop] Found ${results.length} items`);
      setCachedResults(this.name, query, results);
      return results;
    } catch (error) {
      console.error("[Depop] Search error:", error);
      return [];
    }
  }

  private mapToNormalized(item: any): NormalizedListing {
    return {
      source: "depop",
      source_item_id: item.id || item.slug || "",
      title: item.description || item.title || "",
      description: item.description || "",
      price: parseFloat(item.price?.priceAmount || item.price || "0"),
      currency: item.price?.currencyName || "USD",
      shipping: null,
      condition: null,
      brand: item.brand || null,
      category: null,
      size: item.sizes?.[0] || null,
      color: null,
      city: null,
      country: null,
      zip: null,
      images: [item.preview?.url || item.pictures?.[0]?.url || item.image || ""].filter(Boolean),
      listing_url: `https://www.depop.com/products/${item.slug || item.id}/`,
      seller_name: item.seller?.username || null,
      seller_rating: null,
      end_date: null,
      is_auction: false,
    };
  }
}

// ============================================================
// SOURCE ADAPTER MANAGER
// Orchestrates parallel searches across all adapters
// ============================================================
class SourceAdapterManager {
  private adapters: SourceAdapter[];

  constructor(adapters: SourceAdapter[]) {
    this.adapters = adapters;
  }

  async searchAll(query: SearchQuery): Promise<NormalizedListing[]> {
    console.log(`[AdapterManager] Searching ${this.adapters.length} sources in parallel...`);

    const results = await Promise.allSettled(this.adapters.map((adapter) => adapter.search(query)));

    const allListings: NormalizedListing[] = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        allListings.push(...result.value);
      } else {
        console.error(`[AdapterManager] ${this.adapters[index].name} failed:`, result.reason);
      }
    });

    // Deduplicate by listing_url
    const uniqueListings = Array.from(new Map(allListings.map((l) => [l.listing_url, l])).values());

    console.log(`[AdapterManager] Total unique listings: ${uniqueListings.length}`);
    return uniqueListings;
  }
}

// ============================================================
// MATCHING & SCORING (preserved from original)
// ============================================================
const WEIGHTS = {
  visualSimilarity: 0.4,
  textSimilarity: 0.25,
  attributeMatch: 0.25,
  qualityScore: 0.1,
};

const ATTRIBUTE_WEIGHTS = {
  category: 0.2,
  silhouette: 0.15,
  color: 0.15,
  pattern: 0.12,
  material: 0.12,
  style: 0.1,
  distinctiveFeatures: 0.16,
};

interface ExtractedAttributes {
  category: string;
  subcategory?: string;
  colors: { primary: string; secondary?: string; colorFamily: string };
  material: { fabric: string; texture?: string; weight?: string };
  pattern: { type: string; scale?: string };
  construction: { silhouette: string; length?: string; sleeves?: string; neckline?: string; closure?: string };
  style: { era?: string; aesthetic: string; culturalOrigin?: string };
  distinctiveFeatures: string[];
  searchQueries: { primary: string; fallback: string; alternative: string; keywords: string[] };
  textDescription: string;
  visualSignature: { dominantColors: string[]; patternDescription: string; shapeDescription: string };
}

interface MatchScores {
  visualSimilarity: number;
  textSimilarity: number;
  attributeMatch: number;
  qualityScore: number;
  breakdown: {
    categoryMatch: number;
    colorMatch: number;
    patternMatch: number;
    materialMatch: number;
    silhouetteMatch: number;
    styleMatch: number;
    featureMatch: number;
  };
}

interface ScoredListing extends NormalizedListing {
  similarity_score: number;
  match_explanation: string;
  _scores: MatchScores;
}

// ============================================================
// MAIN HANDLER
// ============================================================
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, searchId, cropData, budget } = await req.json();

    if (!imageUrl || !searchId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("=== SOURCE ADAPTER VISUAL SEARCH ===");
    console.log("Search ID:", searchId);
    console.log("Budget:", budget || "No budget set");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update status to analyzing
    await supabase.from("visual_searches").update({ status: "analyzing", crop_data: cropData }).eq("id", searchId);

    // ============================================================
    // STEP 1: EXTRACT ATTRIBUTES
    // ============================================================
    console.log("\n[STEP 1] Extracting visual attributes...");
    const attributes = await extractDetailedAttributes(imageUrl, cropData, LOVABLE_API_KEY);
    console.log("Category:", attributes.category);
    console.log("Color:", attributes.colors.primary);
    console.log("Search queries:", attributes.searchQueries);

    await supabase
      .from("visual_searches")
      .update({
        status: "searching",
        analysis_data: { attributes },
        attributes,
      })
      .eq("id", searchId);

    // ============================================================
    // STEP 2: SEARCH VIA SOURCE ADAPTERS
    // ============================================================
    console.log("\n[STEP 2] Searching via source adapters...");

    // Initialize adapters
    const adapters: SourceAdapter[] = [new TraderaAdapter(), new DepopAdapter(), new LocalCatalogAdapter(supabase)];

    const adapterManager = new SourceAdapterManager(adapters);

    // Build search query from attributes
    const searchQuery: SearchQuery = {
      searchWords: [
        attributes.searchQueries.primary,
        attributes.searchQueries.fallback,
        ...attributes.searchQueries.keywords.slice(0, 2),
      ].filter(Boolean),
      priceMin: budget?.min,
      priceMax: budget?.max,
      category: attributes.category,
      itemsPerPage: 50,
    };

    const allListings = await adapterManager.searchAll(searchQuery);

    if (allListings.length === 0) {
      await supabase
        .from("visual_searches")
        .update({
          status: "no_matches",
          analysis_data: {
            attributes,
            reason: "No matching items found.",
            suggestions: [
              "Try a different search query",
              "Upload a clearer photo",
              "Consider hiring a professional thrifter",
            ],
          },
        })
        .eq("id", searchId);

      return new Response(
        JSON.stringify({
          status: "no_matches",
          attributes,
          message: "No matches found.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // ============================================================
    // STEP 3: TWO-STAGE FILTERING & SCORING
    // ============================================================
    console.log("\n[STEP 3] Filtering and scoring results...");

    // Stage 1: Already done by source-side filters (price, thumbnails)
    // Stage 2: Site-side filtering and scoring
    const scoredListings: ScoredListing[] = allListings.map((listing) => {
      const scores = calculateMatchScores(attributes, listing);
      const finalScore =
        scores.visualSimilarity * WEIGHTS.visualSimilarity +
        scores.textSimilarity * WEIGHTS.textSimilarity +
        scores.attributeMatch * WEIGHTS.attributeMatch +
        scores.qualityScore * WEIGHTS.qualityScore;

      return {
        ...listing,
        similarity_score: Math.min(finalScore, 1.0),
        _scores: scores,
        match_explanation: generateMatchExplanation(attributes, listing, scores),
      };
    });

    // Sort and filter
    scoredListings.sort((a, b) => b.similarity_score - a.similarity_score);

    // Smart AI threshold: Only run visual AI if >50 results
    let finalListings = scoredListings;
    if (scoredListings.length > 50) {
      console.log(`[STEP 3b] ${scoredListings.length} results - filtering to top 50 by metadata first`);
      finalListings = scoredListings.slice(0, 50);
      // TODO: Add visual AI re-ranking here in future
    }

    const topMatches = finalListings.slice(0, 15);

    const highQuality = topMatches.filter((i) => i.similarity_score >= 0.7);
    const mediumQuality = topMatches.filter((i) => i.similarity_score >= 0.5 && i.similarity_score < 0.7);

    console.log(`High quality (≥70%): ${highQuality.length}`);
    console.log(`Medium quality (50-69%): ${mediumQuality.length}`);

    // ============================================================
    // STEP 4: STORE RESULTS
    // ============================================================
    console.log("\n[STEP 4] Storing results...");

    // Map source to platform_type enum
    const mapSourceToPlatform = (source: string): string => {
      const platformMap: Record<string, string> = {
        tradera: "tradera",
        depop: "depop",
        local: "other_vintage",
        ebay: "other_vintage",
      };
      return platformMap[source] || "other_vintage";
    };

    try {
      const insertPromises = topMatches.slice(0, 12).map((listing) => {
        return supabase.from("search_results").insert({
          search_id: searchId,
          platform: mapSourceToPlatform(listing.source) as any,
          item_url: listing.listing_url,
          title: listing.title,
          price: listing.price,
          currency: listing.currency,
          image_url: listing.images[0] || null,
          similarity_score: listing.similarity_score,
          description: listing.description || listing.title,
          matched_attributes: {
            source: listing.source,
            source_item_id: listing.source_item_id,
            breakdown: listing._scores.breakdown,
            brand: listing.brand,
            size: listing.size,
            condition: listing.condition,
          },
          match_explanation: listing.match_explanation,
        });
      });

      await Promise.all(insertPromises);
      console.log(`Stored ${Math.min(topMatches.length, 12)} results`);
    } catch (dbError) {
      console.error("Database insert error:", dbError);
    }

    // Update final status
    const finalStatus = highQuality.length > 0 || mediumQuality.length > 0 ? "completed" : "no_matches";

    await supabase
      .from("visual_searches")
      .update({
        status: finalStatus,
        analysis_data: {
          attributes,
          searchQuery,
          matchStats: {
            total: allListings.length,
            highQuality: highQuality.length,
            mediumQuality: mediumQuality.length,
            topScore: topMatches[0]?.similarity_score || 0,
          },
        },
      })
      .eq("id", searchId);

    console.log("\n=== SEARCH COMPLETE ===");

    return new Response(
      JSON.stringify({
        status: finalStatus,
        resultsCount: topMatches.length,
        highQualityCount: highQuality.length,
        attributes,
        matchStats: {
          total: allListings.length,
          highQuality: highQuality.length,
          mediumQuality: mediumQuality.length,
          topScore: topMatches[0]?.similarity_score || 0,
          sources: [...new Set(topMatches.map((l) => l.source))],
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in visual-search:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// ============================================================
// ATTRIBUTE EXTRACTION (preserved from original)
// ============================================================
async function extractDetailedAttributes(
  imageUrl: string,
  cropData: any,
  apiKey: string,
): Promise<ExtractedAttributes> {
  const cropInstruction = cropData
    ? `Focus ONLY on the cropped/highlighted area of this image.`
    : `Identify the SINGLE MOST PROMINENT fashion item in this image.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `You are an expert fashion AI that extracts detailed visual attributes for product matching.

${cropInstruction}

Analyze the garment and return a JSON object with these exact fields:

{
  "category": "specific item type (e.g., 'wrap top', 'midi dress', 'cargo pants')",
  "subcategory": "more specific type (e.g., 'hanfu wrap top', 'A-line midi dress')",
  "colors": {
    "primary": "main color (e.g., 'sage green', 'burgundy', 'cream')",
    "secondary": "accent color if visible",
    "colorFamily": "warm/cool/neutral/earth"
  },
  "material": {
    "fabric": "material type (e.g., 'organza', 'cotton', 'leather', 'silk')",
    "texture": "texture description (e.g., 'sheer', 'matte', 'textured')",
    "weight": "light/medium/heavy"
  },
  "pattern": {
    "type": "pattern (e.g., 'floral', 'solid', 'stripes', 'jacquard')",
    "scale": "small/medium/large if patterned"
  },
  "construction": {
    "silhouette": "shape (e.g., 'loose', 'fitted', 'A-line', 'oversized', 'flowy')",
    "length": "garment length (e.g., 'cropped', 'midi', 'full-length')",
    "sleeves": "sleeve type (e.g., 'bell', 'cap', 'long', 'sleeveless')",
    "neckline": "neckline (e.g., 'V-neck', 'mandarin', 'scoop')",
    "closure": "closure type (e.g., 'frog buttons', 'wrap tie', 'zipper')"
  },
  "style": {
    "era": "vintage era if applicable (e.g., 'Y2K', '90s', '70s', null)",
    "aesthetic": "style (e.g., 'bohemian', 'minimalist', 'romantic', 'streetwear')",
    "culturalOrigin": "if traditional (e.g., 'Hanfu', 'Kimono', null)"
  },
  "distinctiveFeatures": ["list", "of", "unique", "details"],
  "searchQueries": {
    "primary": "best 3-5 word search query for this exact item",
    "fallback": "simpler 2-3 word search",
    "alternative": "related style search",
    "keywords": ["key", "search", "terms"]
  },
  "textDescription": "One detailed sentence describing the item",
  "visualSignature": {
    "dominantColors": ["color1", "color2"],
    "patternDescription": "detailed pattern description",
    "shapeDescription": "overall shape and structure"
  }
}

Be very specific and detailed. For vintage or cultural items, include relevant terms.
Return ONLY valid JSON.`,
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this fashion item in detail." },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Attribute extraction error:", errorText);
    throw new Error("Failed to extract attributes");
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || content.match(/(\{[\s\S]*\})/);
    return JSON.parse(jsonMatch ? jsonMatch[1] : content);
  } catch (e) {
    console.error("Failed to parse attributes, using defaults");
    return {
      category: "clothing",
      colors: { primary: "unknown", colorFamily: "neutral" },
      material: { fabric: "unknown" },
      pattern: { type: "unknown" },
      construction: { silhouette: "regular" },
      style: { aesthetic: "casual" },
      distinctiveFeatures: [],
      searchQueries: {
        primary: "vintage clothing",
        fallback: "clothing",
        alternative: "fashion",
        keywords: ["clothing"],
      },
      textDescription: "A clothing item",
      visualSignature: {
        dominantColors: [],
        patternDescription: "",
        shapeDescription: "",
      },
    };
  }
}

// ============================================================
// MATCH SCORING (adapted for normalized listings)
// ============================================================
function calculateMatchScores(attributes: ExtractedAttributes, listing: NormalizedListing): MatchScores {
  const titleLower = (listing.title || "").toLowerCase();
  const descLower = (listing.description || "").toLowerCase();
  const searchText = `${titleLower} ${descLower}`;

  const breakdown = {
    categoryMatch: 0,
    colorMatch: 0,
    patternMatch: 0,
    materialMatch: 0,
    silhouetteMatch: 0,
    styleMatch: 0,
    featureMatch: 0,
  };

  // Category match
  if (attributes.category) {
    const categoryTerms = attributes.category.toLowerCase().split(/\s+/);
    const matches = categoryTerms.filter((t) => searchText.includes(t));
    breakdown.categoryMatch = matches.length / categoryTerms.length;
    if (attributes.subcategory) {
      const subTerms = attributes.subcategory.toLowerCase().split(/\s+/);
      if (subTerms.some((t) => searchText.includes(t))) {
        breakdown.categoryMatch = Math.min(1, breakdown.categoryMatch + 0.3);
      }
    }
  }

  // Color match - check listing color field and text
  if (attributes.colors?.primary) {
    const colorTerms = attributes.colors.primary.toLowerCase().split(/\s+/);
    const hasColorInField = listing.color && colorTerms.some((c) => listing.color!.toLowerCase().includes(c));
    const hasColorInText = colorTerms.some((c) => searchText.includes(c));
    if (hasColorInField || hasColorInText) {
      breakdown.colorMatch = 0.8;
    }
    if (attributes.colors.secondary && searchText.includes(attributes.colors.secondary.toLowerCase())) {
      breakdown.colorMatch = Math.min(1, breakdown.colorMatch + 0.2);
    }
  }

  // Pattern match
  if (attributes.pattern?.type) {
    const patternTerms = attributes.pattern.type.toLowerCase().split(/\s+/);
    if (patternTerms.some((p) => searchText.includes(p))) {
      breakdown.patternMatch = 1.0;
    } else if (
      attributes.pattern.type.toLowerCase() === "solid" &&
      !searchText.match(/floral|stripe|plaid|print|pattern/)
    ) {
      breakdown.patternMatch = 0.6;
    }
  }

  // Material match
  if (attributes.material?.fabric) {
    const materialTerms = attributes.material.fabric.toLowerCase().split(/\s+/);
    if (materialTerms.some((m) => searchText.includes(m))) {
      breakdown.materialMatch = 1.0;
    }
  }

  // Silhouette match
  if (attributes.construction?.silhouette) {
    const silTerms = attributes.construction.silhouette.toLowerCase().split(/\s+/);
    if (silTerms.some((s) => searchText.includes(s))) {
      breakdown.silhouetteMatch = 0.8;
    }
  }

  // Style match
  if (attributes.style) {
    if (attributes.style.aesthetic && searchText.includes(attributes.style.aesthetic.toLowerCase())) {
      breakdown.styleMatch = 0.7;
    }
    if (attributes.style.era && searchText.includes(attributes.style.era.toLowerCase())) {
      breakdown.styleMatch = Math.min(1, breakdown.styleMatch + 0.3);
    }
  }

  // Feature match
  if (attributes.distinctiveFeatures?.length > 0) {
    const featureMatches = attributes.distinctiveFeatures.filter((f) => searchText.includes(f.toLowerCase()));
    breakdown.featureMatch = Math.min(1, featureMatches.length / Math.max(2, attributes.distinctiveFeatures.length));
  }

  // Calculate weighted attribute score
  const attributeMatch =
    breakdown.categoryMatch * ATTRIBUTE_WEIGHTS.category +
    breakdown.colorMatch * ATTRIBUTE_WEIGHTS.color +
    breakdown.patternMatch * ATTRIBUTE_WEIGHTS.pattern +
    breakdown.materialMatch * ATTRIBUTE_WEIGHTS.material +
    breakdown.silhouetteMatch * ATTRIBUTE_WEIGHTS.silhouette +
    breakdown.styleMatch * ATTRIBUTE_WEIGHTS.style +
    breakdown.featureMatch * ATTRIBUTE_WEIGHTS.distinctiveFeatures;

  // Visual similarity estimate
  let visualSimilarity = 0.4;
  if (attributes.visualSignature) {
    const colorMatches =
      attributes.visualSignature.dominantColors?.filter((c) => searchText.includes(c.toLowerCase())).length || 0;
    visualSimilarity += colorMatches * 0.15;
  }
  visualSimilarity = Math.min(1, visualSimilarity);

  // Text similarity
  let textSimilarity = 0;
  if (attributes.textDescription) {
    const descWords = attributes.textDescription
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3);
    const wordMatches = descWords.filter((w) => searchText.includes(w));
    textSimilarity = Math.min(1, wordMatches.length / Math.max(5, descWords.length));
  }
  if (attributes.searchQueries?.keywords) {
    const keywordMatches = attributes.searchQueries.keywords.filter((k) => searchText.includes(k.toLowerCase())).length;
    textSimilarity = Math.min(1, textSimilarity + keywordMatches * 0.1);
  }

  // Quality score
  let qualityScore = 0.5;
  if (listing.seller_rating && listing.seller_rating > 4) qualityScore += 0.2;
  if (listing.images.length > 1) qualityScore += 0.1;
  if (listing.brand) qualityScore += 0.1;
  if (listing.condition) qualityScore += 0.1;
  qualityScore = Math.min(1, qualityScore);

  return {
    visualSimilarity,
    textSimilarity,
    attributeMatch,
    qualityScore,
    breakdown,
  };
}

// ============================================================
// MATCH EXPLANATION
// ============================================================
function generateMatchExplanation(
  attributes: ExtractedAttributes,
  listing: NormalizedListing,
  scores: MatchScores,
): string {
  const matches: string[] = [];
  const searchText = `${listing.title} ${listing.description}`.toLowerCase();

  if (scores.breakdown.categoryMatch > 0.5) matches.push(attributes.category);
  if (scores.breakdown.colorMatch > 0.5 && attributes.colors?.primary) matches.push(attributes.colors.primary);
  if (scores.breakdown.materialMatch > 0.5 && attributes.material?.fabric) matches.push(attributes.material.fabric);
  if (scores.breakdown.patternMatch > 0.5 && attributes.pattern?.type !== "solid")
    matches.push(attributes.pattern.type);
  if (scores.breakdown.silhouetteMatch > 0.5 && attributes.construction?.silhouette)
    matches.push(attributes.construction.silhouette + " fit");
  if (scores.breakdown.styleMatch > 0.5) {
    if (attributes.style?.aesthetic) matches.push(attributes.style.aesthetic);
    if (attributes.style?.era) matches.push(attributes.style.era);
  }

  if (attributes.distinctiveFeatures) {
    attributes.distinctiveFeatures.forEach((f) => {
      if (searchText.includes(f.toLowerCase())) matches.push(f);
    });
  }

  // Add source info
  const source = listing.source.charAt(0).toUpperCase() + listing.source.slice(1);

  if (matches.length === 0) {
    return `${source}: Similar style`;
  }

  const uniqueMatches = [...new Set(matches)].slice(0, 4);
  return `${source}: ${uniqueMatches.join(", ")}`;
}
