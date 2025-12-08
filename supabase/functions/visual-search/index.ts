import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Thresholds for match quality
const HIGH_THRESHOLD = 0.80;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, searchId, cropData, budget } = await req.json();
    
    if (!imageUrl || !searchId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Search request:', { searchId, hasBudget: !!budget });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting visual search for:', searchId);

    // Update status to analyzing
    await supabase
      .from('visual_searches')
      .update({ status: 'analyzing', crop_data: cropData })
      .eq('id', searchId);

    // Step 1: Detailed attribute extraction with Gemini Vision
    console.log('Starting detailed image analysis for:', searchId);
    
    const cropInstruction = cropData 
      ? `The user has cropped/highlighted a specific area of this image. Focus your analysis ONLY on the main fashion item in the highlighted region. Ignore other items in the background.` 
      : `Identify the SINGLE MOST PROMINENT fashion item in this image (the item that draws the most attention or takes up the most space). Ignore background items, other people's clothing, or secondary accessories unless they are clearly the main focus.`;
    
    const attributeResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a fashion expert AI analyzing clothing items for precise visual search on Etsy. 

CRITICAL: ${cropInstruction}

Extract structured attributes in JSON format with these exact fields:
{
  "itemType": "main garment type (e.g., shoes, jacket, dress, top, pants, bag, boots, sneakers)",
  "category": "specific category (e.g., studded boots, blazer, midi dress, button-up shirt, ankle boots)",
  "visibleText": ["any visible text, logos, brand names, tags you can read in the image"],
  "fabricType": "material type (e.g., leather, satin, cotton, denim, wool, linen, suede)",
  "fabricTexture": "texture qualities (e.g., sheen, matte, textured, smooth, distressed)",
  "primaryColors": ["dominant color 1", "color 2"],
  "pattern": "pattern type (e.g., solid, floral, stripes, geometric, animal print)",
  "silhouette": "overall shape (e.g., fitted, oversized, A-line, boxy, cropped, chunky, sleek)",
  "sleeveType": "sleeve style if applicable (e.g., long, short, kimono, puff, sleeveless, N/A)",
  "necklineCollar": "neckline/collar if applicable (e.g., v-neck, crew, collared, off-shoulder, N/A)",
  "length": "garment length (e.g., cropped, hip-length, midi, maxi, ankle, knee-high)",
  "closureType": "fastening (e.g., button-front, zip, wrap, pullover, lace-up, buckle)",
  "notableDetails": ["detail 1", "detail 2", "e.g., studs, embroidery, distressing, platform sole"],
  "era": "style era (e.g., 90s, vintage, modern, Y2K, punk)",
  "aesthetic": "overall vibe (e.g., romantic, minimalist, bohemian, grunge, edgy, punk)",
  "etsySearchQuery": "best search query for Etsy (2-5 words, focus on item type and key features)"
}

CRITICAL: Generate an optimal Etsy search query that will find similar items. Focus on the item type and most distinctive features.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `${cropInstruction}\n\nAnalyze the MAIN fashion item in extreme detail and return ONLY valid JSON with all the fields specified. Be as specific as possible about every attribute, especially unique details. Generate a concise but effective Etsy search query.`
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
      }),
    });

    if (!attributeResponse.ok) {
      const errorText = await attributeResponse.text();
      console.error('Attribute extraction error:', errorText);
      throw new Error('Failed to extract attributes');
    }

    const attributeData = await attributeResponse.json();
    let attributes;
    try {
      const content = attributeData.choices[0].message.content;
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || content.match(/(\{[\s\S]*\})/);
      attributes = JSON.parse(jsonMatch ? jsonMatch[1] : content);
      console.log('Extracted attributes:', attributes);
    } catch (e) {
      console.error('Failed to parse attributes:', e);
      attributes = { description: attributeData.choices[0].message.content };
    }

    // Store detailed analysis data
    await supabase
      .from('visual_searches')
      .update({ 
        status: 'searching',
        analysis_data: { attributes },
        attributes: attributes
      })
      .eq('id', searchId);

    // Step 2: Generate Etsy search query
    const etsyQuery = attributes.etsySearchQuery || 
      `${attributes.itemType || ''} ${attributes.category || ''} ${attributes.primaryColors?.[0] || ''} ${attributes.fabricType || ''}`.trim();
    
    console.log('Etsy search query:', etsyQuery);

    // Step 3: Scrape Etsy search results
    console.log('Scraping Etsy for:', etsyQuery);
    
    const etsyItems = await scrapeEtsy(etsyQuery, LOVABLE_API_KEY, budget);
    console.log(`Found ${etsyItems.length} items from Etsy`);

    if (etsyItems.length === 0) {
      // Try a simpler search query
      const simpleQuery = `vintage ${attributes.itemType || 'clothing'}`;
      console.log('No results, trying simpler query:', simpleQuery);
      const fallbackItems = await scrapeEtsy(simpleQuery, LOVABLE_API_KEY, budget);
      
      if (fallbackItems.length === 0) {
        await supabase
          .from('visual_searches')
          .update({ 
            status: 'no_matches',
            analysis_data: { 
              attributes,
              reason: 'No matching items found on Etsy.',
              suggestions: [
                'Try uploading a different angle of the item',
                'Search manually on Etsy for: ' + etsyQuery
              ]
            }
          })
          .eq('id', searchId);

        return new Response(JSON.stringify({ 
          status: 'no_matches',
          attributes,
          message: 'No matches found on Etsy.',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      etsyItems.push(...fallbackItems);
    }

    // Step 4: Score items based on attribute matching
    const scoredItems = etsyItems.map(item => {
      const score = calculateItemScore(attributes, item);
      return {
        ...item,
        similarity_score: score,
        match_explanation: generateMatchExplanation(attributes, item)
      };
    })
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 8);

    console.log(`Scored ${scoredItems.length} matches, top score: ${scoredItems[0]?.similarity_score || 0}`);

    // Store results
    const topMatches = scoredItems.map(item => ({
      platform: 'etsy' as const,
      item_url: item.item_url,
      title: item.title,
      price: item.price,
      currency: item.currency || 'USD',
      image_url: item.image_url,
      description: item.title,
      similarity_score: item.similarity_score,
      match_explanation: item.match_explanation
    }));

    try {
      const insertPromises = topMatches.map(result => {        
        return supabase
          .from('search_results')
          .insert({
            search_id: searchId,
            platform: result.platform,
            item_url: result.item_url,
            title: result.title,
            price: result.price,
            currency: result.currency,
            image_url: result.image_url,
            similarity_score: result.similarity_score,
            description: result.description,
            matched_attributes: { matched: [] },
            match_explanation: result.match_explanation || 'Similar item from Etsy'
          });
      });

      await Promise.all(insertPromises);
    } catch (dbError) {
      console.error('Database insert error:', dbError);
    }

    // Update status
    await supabase
      .from('visual_searches')
      .update({ status: 'completed' })
      .eq('id', searchId);

    return new Response(JSON.stringify({ 
      status: 'completed',
      resultsCount: topMatches.length,
      highQualityCount: topMatches.filter(m => m.similarity_score >= HIGH_THRESHOLD).length,
      attributes
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in visual-search:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Scrape Etsy search results using AI to extract listings
async function scrapeEtsy(query: string, apiKey: string, budget?: { min?: number; max?: number }): Promise<any[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    
    // Build Etsy URL with price filters if budget provided
    let etsyUrl = `https://www.etsy.com/search?q=${encodedQuery}&ref=search_bar`;
    if (budget?.min) {
      etsyUrl += `&min=${budget.min}`;
    }
    if (budget?.max) {
      etsyUrl += `&max=${budget.max}`;
    }
    
    console.log('Fetching Etsy URL:', etsyUrl);

    // Fetch the Etsy search page
    const response = await fetch(etsyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    if (!response.ok) {
      console.error('Etsy fetch failed:', response.status);
      return [];
    }

    const html = await response.text();
    console.log('Fetched HTML length:', html.length);

    // Use AI to extract product listings from the HTML
    const extractResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting product listings from Etsy HTML. Extract up to 10 product listings.

Return a JSON array with objects containing:
{
  "title": "product title",
  "price": 29.99,
  "currency": "USD",
  "item_url": "https://www.etsy.com/listing/...",
  "image_url": "https://i.etsystatic.com/..."
}

CRITICAL RULES:
1. Only extract REAL Etsy listings with valid URLs starting with https://www.etsy.com/listing/
2. Image URLs should be from i.etsystatic.com
3. Parse prices as numbers (remove currency symbols)
4. Return ONLY the JSON array, no other text
5. If you can't find valid listings, return an empty array []`
          },
          {
            role: 'user',
            content: `Extract product listings from this Etsy search results page HTML. Return a JSON array only.\n\nHTML (truncated to 50000 chars):\n${html.substring(0, 50000)}`
          }
        ],
      }),
    });

    if (!extractResponse.ok) {
      console.error('AI extraction failed:', await extractResponse.text());
      return [];
    }

    const extractData = await extractResponse.json();
    const content = extractData.choices?.[0]?.message?.content || '[]';
    
    // Parse the JSON array
    let items = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      items = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (e) {
      console.error('Failed to parse extracted items:', e);
      return [];
    }

    // Validate and filter items
    const validItems = items.filter((item: any) => 
      item.title && 
      item.item_url && 
      item.item_url.includes('etsy.com/listing') &&
      item.image_url &&
      typeof item.price === 'number' &&
      item.price > 0 &&
      item.price < 10000
    );

    console.log(`Extracted ${validItems.length} valid Etsy items`);
    return validItems;

  } catch (error) {
    console.error('Error scraping Etsy:', error);
    return [];
  }
}

// Calculate similarity score between search attributes and item
function calculateItemScore(searchAttrs: any, item: any): number {
  let score = 0.5; // Base score for being from Etsy search
  
  const titleLower = (item.title || '').toLowerCase();
  
  // Item type match
  if (searchAttrs.itemType && titleLower.includes(searchAttrs.itemType.toLowerCase())) {
    score += 0.15;
  }
  
  // Category match
  if (searchAttrs.category && titleLower.includes(searchAttrs.category.toLowerCase())) {
    score += 0.1;
  }
  
  // Color match
  if (searchAttrs.primaryColors) {
    for (const color of searchAttrs.primaryColors) {
      if (titleLower.includes(color.toLowerCase())) {
        score += 0.1;
        break;
      }
    }
  }
  
  // Fabric match
  if (searchAttrs.fabricType && titleLower.includes(searchAttrs.fabricType.toLowerCase())) {
    score += 0.1;
  }
  
  // Era/aesthetic match
  if (searchAttrs.era && titleLower.includes(searchAttrs.era.toLowerCase())) {
    score += 0.05;
  }
  if (searchAttrs.aesthetic && titleLower.includes(searchAttrs.aesthetic.toLowerCase())) {
    score += 0.05;
  }
  
  return Math.min(score, 1.0);
}

// Generate match explanation
function generateMatchExplanation(searchAttrs: any, item: any): string {
  const matches: string[] = [];
  const titleLower = (item.title || '').toLowerCase();
  
  if (searchAttrs.itemType && titleLower.includes(searchAttrs.itemType.toLowerCase())) {
    matches.push(searchAttrs.itemType);
  }
  if (searchAttrs.primaryColors) {
    for (const color of searchAttrs.primaryColors) {
      if (titleLower.includes(color.toLowerCase())) {
        matches.push(color + ' color');
        break;
      }
    }
  }
  if (searchAttrs.fabricType && titleLower.includes(searchAttrs.fabricType.toLowerCase())) {
    matches.push(searchAttrs.fabricType + ' material');
  }
  
  if (matches.length === 0) {
    return 'Similar style from Etsy';
  }
  
  return 'Matches: ' + matches.join(', ');
}
