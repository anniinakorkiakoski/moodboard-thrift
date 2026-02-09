import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ============================================================
// EBAY OAUTH TOKEN CACHING
// ============================================================
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getEbayAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < tokenExpiry - 60_000) {
    console.log("[eBay] Using cached access token");
    return cachedToken;
  }

  const clientId = Deno.env.get("EBAY_CLIENT_ID");
  const clientSecret = Deno.env.get("EBAY_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("EBAY_CLIENT_ID or EBAY_CLIENT_SECRET not configured");
  }

  const credentials = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[eBay] OAuth error [${response.status}]:`, errorText);
    throw new Error(`eBay OAuth failed: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;
  console.log(`[eBay] New access token obtained, expires in ${data.expires_in}s`);

  return cachedToken!;
}

// ============================================================
// NORMALIZED LISTING SCHEMA (matches visual-search)
// ============================================================
interface NormalizedListing {
  source: string;
  source_item_id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
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
// MAIN HANDLER
// ============================================================
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { q, priceMin, priceMax, condition, limit, marketplaceId } = await req.json();

    if (!q) {
      return new Response(JSON.stringify({ error: "Missing required field: q (search query)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = await getEbayAccessToken();
    const marketplace = marketplaceId || Deno.env.get("EBAY_MARKETPLACE_ID") || "EBAY_FI";
    const itemLimit = Math.min(limit || 50, 200);

    // Build filter string
    const filters: string[] = [];
    if (priceMin !== undefined || priceMax !== undefined) {
      const min = priceMin ?? 0;
      const max = priceMax ?? "";
      filters.push(`price:[${min}..${max}]`);
      filters.push("priceCurrency:EUR");
    }
    if (condition) {
      // eBay condition IDs: 1000=New, 3000=Used
      const conditionMap: Record<string, string> = {
        new: "1000",
        used: "3000",
        "like new": "1500",
        "very good": "2000",
        good: "2500",
      };
      const condId = conditionMap[condition.toLowerCase()];
      if (condId) filters.push(`conditionIds:{${condId}}`);
    }

    const params = new URLSearchParams({
      q,
      limit: String(itemLimit),
    });
    if (filters.length > 0) {
      params.set("filter", filters.join(","));
    }

    const apiUrl = `https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`;
    console.log(`[eBay] Searching: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-EBAY-C-MARKETPLACE-ID": marketplace,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[eBay] Browse API error [${response.status}]:`, errorText);
      return new Response(
        JSON.stringify({ error: `eBay API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const items = data.itemSummaries || [];

    const listings: NormalizedListing[] = items.map((item: any) => {
      const images: string[] = [];
      if (item.image?.imageUrl) images.push(item.image.imageUrl);
      if (item.additionalImages) {
        for (const img of item.additionalImages) {
          if (img.imageUrl) images.push(img.imageUrl);
        }
      }

      return {
        source: "ebay",
        source_item_id: item.itemId || item.legacyItemId || "",
        title: item.title || "",
        description: item.shortDescription || item.title || "",
        price: parseFloat(item.price?.value || "0"),
        currency: item.price?.currency || "EUR",
        shipping: item.shippingOptions?.[0]?.shippingCost?.value
          ? `${item.shippingOptions[0].shippingCost.currency} ${item.shippingOptions[0].shippingCost.value}`
          : null,
        condition: item.condition || null,
        brand: null,
        category: item.categories?.[0]?.categoryName || null,
        size: null,
        color: null,
        city: item.itemLocation?.city || null,
        country: item.itemLocation?.country || null,
        zip: item.itemLocation?.postalCode || null,
        images,
        listing_url: item.itemWebUrl || "",
        seller_name: item.seller?.username || null,
        seller_rating: item.seller?.feedbackPercentage
          ? parseFloat(item.seller.feedbackPercentage)
          : null,
        end_date: item.itemEndDate || null,
        is_auction: (item.buyingOptions || []).includes("AUCTION"),
      };
    });

    console.log(`[eBay] Returning ${listings.length} normalized listings`);

    return new Response(
      JSON.stringify({ listings, total: data.total || listings.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("[eBay] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
