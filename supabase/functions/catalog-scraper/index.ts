import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapedItem {
  itemUrl: string;
  imageUrl?: string;
  title?: string;
  price?: string;
}

// Platform-specific search URLs
const PLATFORM_SEARCH_URLS: Record<string, (query: string) => string> = {
  vinted: (query) => `https://www.vinted.com/catalog?search_text=${encodeURIComponent(query)}`,
  depop: (query) => `https://www.depop.com/search/?q=${encodeURIComponent(query)}`,
  poshmark: (query) => `https://poshmark.com/search?query=${encodeURIComponent(query)}`,
  etsy: (query) => `https://www.etsy.com/search?q=${encodeURIComponent(query)}&explicit=1&category=vintage-clothing`,
  grailed: (query) => `https://www.grailed.com/shop?q=${encodeURIComponent(query)}`,
};

async function fetchPageContent(url: string): Promise<string> {
  console.log('Fetching page:', url);
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch page: ${response.status}`);
  }
  
  return await response.text();
}

async function extractItemsWithAI(html: string, platform: string): Promise<ScrapedItem[]> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

  // Truncate HTML to avoid token limits (keep first 50k chars)
  const truncatedHtml = html.substring(0, 50000);

  console.log('Extracting items with AI for platform:', platform);

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [{
        role: 'user',
        content: `Extract fashion item listings from this ${platform} search results page. Find up to 20 items.\n
        HTML content:\n${truncatedHtml}\n
Return item URLs, image URLs, titles, and prices if available.`
      }],
      tools: [{
        type: 'function',
        function: {
          name: 'extract_items',
          description: 'Extract item listings from search results',
          parameters: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    itemUrl: { type: 'string' },
                    imageUrl: { type: 'string' },
                    title: { type: 'string' },
                    price: { type: 'string' }
                  },
                  required: ['itemUrl']
                }
              }
            },
            required: ['items']
          }
        }
      }],
      tool_choice: { type: 'function', function: { name: 'extract_items' } }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI extraction failed: ${error}`);
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) throw new Error('No items extracted');

  const result = JSON.parse(toolCall.function.arguments);
  console.log(`Extracted ${result.items.length} items`);
  return result.items;
}

async function processItemWithCatalogIngest(
  supabase: any,
  item: ScrapedItem,
  platform: string
): Promise<boolean> {
  try {
    console.log('Processing item:', item.itemUrl);

    const { data, error } = await supabase.functions.invoke('catalog-ingest', {
      body: {
        action: 'add_manual',
        itemUrl: item.itemUrl,
        imageUrl: item.imageUrl,
        platform
      }
    });

    if (error) {
      console.error('Error processing item:', error);
      return false;
    }

    console.log('Item added to catalog:', data?.item?.id);
    return true;
  } catch (err) {
    console.error('Error processing item:', err);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, searchQuery, maxItems = 10 } = await req.json();

    if (!platform || !searchQuery) {
      return new Response(JSON.stringify({ 
        error: 'Platform and searchQuery are required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!PLATFORM_SEARCH_URLS[platform]) {
      return new Response(JSON.stringify({ 
        error: `Unsupported platform: ${platform}. Supported: ${Object.keys(PLATFORM_SEARCH_URLS).join(', ')}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Starting scrape: platform=${platform}, query=${searchQuery}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch search results page
    const searchUrl = PLATFORM_SEARCH_URLS[platform](searchQuery);
    const html = await fetchPageContent(searchUrl);

    // Extract items with AI
    const scrapedItems = await extractItemsWithAI(html, platform);
    const itemsToProcess = scrapedItems.slice(0, maxItems);

    console.log(`Processing ${itemsToProcess.length} items`);

    // Process items in parallel (max 5 at a time)
    const results = { added: 0, failed: 0 };
    const batchSize = 5;
    
    for (let i = 0; i < itemsToProcess.length; i += batchSize) {
      const batch = itemsToProcess.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(item => processItemWithCatalogIngest(supabase, item, platform))
      );

      batchResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          results.added++;
        } else {
          results.failed++;
        }
      });

      console.log(`Batch ${Math.floor(i / batchSize) + 1} completed`);
    }

    console.log('Scraping completed:', results);

    return new Response(JSON.stringify({
      success: true,
      platform,
      searchQuery,
      itemsFound: scrapedItems.length,
      itemsProcessed: itemsToProcess.length,
      ...results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Catalog scraper error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
