import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InspirationItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  image_url: string;
  item_url: string;
  platform: string;
  tags: string[];
  trending?: boolean;
}

async function scrapeEtsySearch(query: string): Promise<InspirationItem[]> {
  const items: InspirationItem[] = [];
  
  try {
    const searchUrl = `https://www.etsy.com/search?q=${encodeURIComponent(query)}&ref=search_bar`;
    console.log(`Scraping Etsy for: ${query}`);
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      console.error(`Etsy search failed: ${response.status}`);
      return items;
    }

    const html = await response.text();
    
    // Extract listing data from Etsy's HTML
    const listingPattern = /data-listing-id="(\d+)"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[^>]*alt="([^"]+)"[\s\S]*?currency_value">[\s\S]*?([\d,.]+)/gi;
    
    let match;
    let count = 0;
    while ((match = listingPattern.exec(html)) !== null && count < 10) {
      const [, listingId, imageUrl, title, price] = match;
      
      if (listingId && imageUrl && title) {
        items.push({
          id: `etsy-${listingId}`,
          title: title.substring(0, 100),
          price: parseFloat(price?.replace(/,/g, '') || '0'),
          currency: 'USD',
          image_url: imageUrl.replace(/il_\d+x\d+/, 'il_680x540'),
          item_url: `https://www.etsy.com/listing/${listingId}`,
          platform: 'etsy',
          tags: query.split(' ').filter(t => t.length > 2),
          trending: count < 3,
        });
        count++;
      }
    }

    // Alternative pattern for different Etsy HTML structure
    if (items.length === 0) {
      const altPattern = /"listing_id":(\d+),"title":"([^"]+)"[\s\S]*?"price":{"amount":(\d+)[\s\S]*?"url":"([^"]+)"[\s\S]*?"image_url":"([^"]+)"/gi;
      
      while ((match = altPattern.exec(html)) !== null && count < 10) {
        const [, listingId, title, priceAmount, url, imageUrl] = match;
        
        if (listingId && title) {
          items.push({
            id: `etsy-${listingId}`,
            title: title.substring(0, 100),
            price: parseInt(priceAmount) / 100,
            currency: 'USD',
            image_url: imageUrl || `https://i.etsystatic.com/placeholder.jpg`,
            item_url: url.startsWith('http') ? url : `https://www.etsy.com${url}`,
            platform: 'etsy',
            tags: query.split(' ').filter(t => t.length > 2),
            trending: count < 3,
          });
          count++;
        }
      }
    }

    console.log(`Found ${items.length} items for query: ${query}`);
  } catch (error) {
    console.error(`Error scraping Etsy for "${query}":`, error);
  }

  return items;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchTerms, styleTags, dreamBrands, materials } = await req.json();

    console.log('Fetching inspiration feed with terms:', searchTerms);

    // Combine all search terms
    const allTerms = [
      ...new Set([
        ...(searchTerms || []),
        ...(styleTags || []).map((t: string) => `${t} clothing`),
        ...(dreamBrands || []).map((b: string) => `${b} vintage`),
        ...(materials || []).map((m: string) => `${m} fashion`),
      ])
    ].slice(0, 8);

    // Scrape Etsy for each term in parallel
    const scrapePromises = allTerms.map(term => scrapeEtsySearch(term));
    const results = await Promise.all(scrapePromises);
    
    // Flatten and dedupe results
    const allItems = results.flat();
    const uniqueItems = allItems.filter((item, index, self) => 
      index === self.findIndex(i => i.id === item.id)
    );

    // Shuffle for variety
    const shuffledItems = uniqueItems.sort(() => Math.random() - 0.5);

    console.log(`Returning ${shuffledItems.length} total inspiration items`);

    return new Response(
      JSON.stringify({ items: shuffledItems }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in inspiration-feed:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', items: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
