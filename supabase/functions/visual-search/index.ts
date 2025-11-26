import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Thresholds for match quality
const HIGH_THRESHOLD = 0.80;  // Show as good match
const FALLBACK_THRESHOLD = 0.60;  // Show tentative matches with confirmation

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
            content: `You are a fashion expert AI analyzing clothing items for precise visual search. 

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
  "aesthetic": "overall vibe (e.g., romantic, minimalist, bohemian, grunge, edgy, punk)"
}

CRITICAL: Read all visible text, logos, and brand names in the image carefully. Include them in the visibleText array.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `${cropInstruction}\n\nAnalyze the MAIN fashion item in extreme detail and return ONLY valid JSON with all the fields specified. Be as specific as possible about every attribute, especially unique details like studs, embellishments, hardware, or distinctive features.`
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
      // Extract JSON from markdown code blocks if present
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

    // Step 2: Generate search query and URLs from attributes - prioritize visible text and notable details
    const visibleTextStr = attributes.visibleText?.join(' ') || '';
    const notableDetailsStr = attributes.notableDetails?.join(' ') || '';
    const searchQuery = `${visibleTextStr} ${attributes.category || attributes.itemType} ${notableDetailsStr} ${attributes.silhouette || ''} ${attributes.length || ''} ${attributes.fabricType || ''} ${attributes.primaryColors?.[0] || ''} ${attributes.pattern || ''}`.trim();
    console.log('Generated search query:', searchQuery);
    console.log('Key item attributes:', {
      itemType: attributes.itemType,
      category: attributes.category,
      visibleText: attributes.visibleText,
      notableDetails: attributes.notableDetails,
      silhouette: attributes.silhouette,
      length: attributes.length
    });

    // Step 3: Search multiple platforms directly
    console.log('Searching multiple platforms...');
    
    const searchUrls = [
      `https://www.vinted.fi/catalog?search_text=${encodeURIComponent(searchQuery)}`,
      `https://www.vinted.se/catalog?search_text=${encodeURIComponent(searchQuery)}`,
      `https://www.vinted.dk/catalog?search_text=${encodeURIComponent(searchQuery)}`,
      `https://www.depop.com/search/?q=${encodeURIComponent(searchQuery)}`,
      `https://www.tise.fi/search?q=${encodeURIComponent(searchQuery)}`,
    ];

    // Use AI to extract items from search result pages
    const allItems: any[] = [];
    
    // Only process 1 platform for speed
    const url = searchUrls[0];
    
    try {
      console.log('Fetching:', url);
      
      const pageResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      
      if (!pageResponse.ok) {
        throw new Error(`Failed to fetch: ${pageResponse.status}`);
      }
      
      const html = await pageResponse.text();
      const truncatedHtml = html.substring(0, 50000); // More HTML for better extraction
      
      console.log('Extracting items with AI...');
      
      // Log a sample of HTML to verify we're getting product data
      const htmlSample = html.substring(0, 2000);
      console.log('HTML sample:', htmlSample.substring(0, 500));
      
      // Extract items using AI with strict validation
      const extractResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{
            role: 'user',
            content: `You are extracting real product listings from this Vinted search results page HTML.

CRITICAL RULES - READ CAREFULLY:
1. Extract ONLY data that is LITERALLY PRESENT in the HTML below
2. DO NOT invent, estimate, or hallucinate ANY data
3. If you cannot find real product URLs in the HTML, return an empty items array []
4. Prices must be realistic for secondhand clothing (typically €5-100)
5. Look for product links in <a> tags with href attributes containing "/items/"
6. Look for prices in elements with text like "€10" or "10,00 €"
7. Extract EXACTLY what you see - do not modify or interpret

If you cannot find clear product listings with URLs and prices in the HTML, return {"items": []}

HTML:
${truncatedHtml}`
          }],
          tools: [{
            type: 'function',
            function: {
              name: 'extract_items',
              parameters: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        itemUrl: { 
                          type: 'string',
                          description: 'Exact product URL found in HTML href attribute'
                        },
                        imageUrl: { type: 'string' },
                        title: { type: 'string' },
                        price: { type: 'string', description: 'Numeric price only, e.g. "15.50"' },
                        currency: { type: 'string', description: 'Currency code like EUR' }
                      },
                      required: ['itemUrl', 'title', 'price']
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
      
      if (extractResponse.ok) {
        const extractData = await extractResponse.json();
        const toolCall = extractData.choices?.[0]?.message?.tool_calls?.[0];
        if (toolCall) {
          const result = JSON.parse(toolCall.function.arguments);
          console.log('AI extracted data:', JSON.stringify(result, null, 2));
          
          const platform = url.includes('vinted') ? 'vinted' : url.includes('depop') ? 'depop' : 'tise';
          const baseUrl = new URL(url).origin;
          
          // Validate and add items with strict filtering
          result.items.slice(0, 8).forEach((item: any) => {
            let itemUrl = item.itemUrl || item.item_url || '';
            const priceNum = parseFloat((item.price || '0').toString().replace(/[^0-9.]/g, ''));
            
            // STRICT VALIDATION: Reject obviously fake data
            if (!itemUrl || !item.title) {
              console.log('Rejected: Missing URL or title');
              return;
            }
            
            // Reject unrealistic prices for secondhand clothing
            const maxPrice = budget?.max || 500;
            if (priceNum > maxPrice || priceNum < 0.5) {
              console.log('Rejected price outside budget:', item.title, priceNum, `(budget: ${budget?.min}-${budget?.max})`);
              return;
            }
            
            // Check minimum budget
            if (budget && budget.min && priceNum < budget.min) {
              console.log('Rejected: Below minimum budget:', item.title, priceNum);
              return;
            }
            
            // Convert relative URLs to absolute
            if (itemUrl && !itemUrl.startsWith('http')) {
              itemUrl = baseUrl + (itemUrl.startsWith('/') ? '' : '/') + itemUrl;
            }
            
            // Only add if URL contains the platform domain (validate it's real)
            if (itemUrl && (itemUrl.includes('vinted') || itemUrl.includes('depop') || itemUrl.includes('tise'))) {
              allItems.push({
                ...item,
                itemUrl,
                item_url: itemUrl,
                platform,
                attributes: {},
              });
              console.log('Added valid item:', item.title, priceNum, itemUrl);
            } else {
              console.log('Rejected invalid URL:', itemUrl);
            }
          });
          
          console.log(`Extracted ${allItems.length} validated items from ${platform}`);
        } else {
          console.log('No tool call in response');
        }
      } else {
        const errorText = await extractResponse.text();
        console.error('Extract API error:', errorText);
      }
    } catch (err) {
      console.error('Error processing URL:', url, err);
    }

    console.log(`Total items extracted: ${allItems.length}`);

    // If no items found, try a simpler search query
    if (allItems.length === 0) {
      console.log('No items found with detailed query, trying simpler search...');
      
      const simpleQuery = `${attributes.category || attributes.itemType} ${attributes.primaryColors?.[0] || ''}`.trim();
      const simpleUrl = `https://www.vinted.fi/catalog?search_text=${encodeURIComponent(simpleQuery)}`;
      
      try {
        const retryResponse = await fetch(simpleUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        });
        
        if (retryResponse.ok) {
          const retryHtml = await retryResponse.text();
          console.log('Retry search with simpler query:', simpleQuery);
          // Quick extraction attempt - don't do full validation
          const quickExtract = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [{ role: 'user', content: `Extract up to 5 product listings from this HTML. Return empty array if none found.\n\n${retryHtml.substring(0, 30000)}` }],
              tools: [{
                type: 'function',
                function: {
                  name: 'extract_items',
                  parameters: {
                    type: 'object',
                    properties: {
                      items: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            itemUrl: { type: 'string' },
                            title: { type: 'string' },
                            price: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }],
              tool_choice: { type: 'function', function: { name: 'extract_items' } }
            })
          });
          
          if (quickExtract.ok) {
            const quickData = await quickExtract.json();
            const quickResult = JSON.parse(quickData.choices?.[0]?.message?.tool_calls?.[0]?.function.arguments || '{"items":[]}');
            console.log('Retry extracted:', quickResult.items.length, 'items');
            
            quickResult.items.forEach((item: any) => {
              const priceNum = parseFloat((item.price || '0').toString().replace(/[^0-9.]/g, ''));
              if (priceNum > 0 && priceNum < 500 && item.itemUrl && item.title) {
                allItems.push({
                  itemUrl: item.itemUrl.startsWith('http') ? item.itemUrl : `https://www.vinted.fi${item.itemUrl}`,
                  item_url: item.itemUrl.startsWith('http') ? item.itemUrl : `https://www.vinted.fi${item.itemUrl}`,
                  title: item.title,
                  price: item.price,
                  platform: 'vinted',
                  attributes: {}
                });
              }
            });
          }
        }
      } catch (retryErr) {
        console.error('Retry search failed:', retryErr);
      }
    }
    
    console.log(`Final item count: ${allItems.length}`);

    // Map items to database schema format with safety checks
    const mappedItems = allItems.map(item => ({
      platform: item.platform || 'vinted',
      item_url: item.itemUrl || item.item_url || '',
      title: item.title || 'Fashion Item',
      price: parseFloat((item.price || '0').toString().replace(/[^0-9.]/g, '')) || 0,
      currency: (item.currency || 'EUR').toUpperCase().trim(),
      image_url: item.imageUrl || item.image_url || null,
      description: item.title || ''
    }));

    // Calculate similarity with balanced weighting across all attributes
    const scoredItems = mappedItems.map(item => {
      let score = 0.15; // Lower base score
      const itemText = (item.title || '').toLowerCase();
      
      // CRITICAL: Item type must match (worth 0.25)
      if (attributes.itemType && itemText.includes(attributes.itemType.toLowerCase())) {
        score += 0.25;
      }
      if (attributes.category && itemText.includes(attributes.category.toLowerCase())) {
        score += 0.1;
      }
      
      // Notable details are crucial (worth 0.25 total)
      if (attributes.notableDetails && attributes.notableDetails.length > 0) {
        attributes.notableDetails.forEach((detail: string) => {
          if (detail.length > 3 && itemText.includes(detail.toLowerCase())) {
            score += 0.125;
          }
        });
      }
      
      // Shape attributes (worth 0.2 total)
      if (attributes.silhouette && itemText.includes(attributes.silhouette.toLowerCase())) {
        score += 0.1;
      }
      if (attributes.length && itemText.includes(attributes.length.toLowerCase())) {
        score += 0.1;
      }
      
      // Visible text/brands/logos (worth 0.15 - helpful but not dominant)
      if (attributes.visibleText && attributes.visibleText.length > 0) {
        attributes.visibleText.forEach((text: string) => {
          if (text.length > 2 && itemText.includes(text.toLowerCase())) {
            score += 0.075; // Moderate boost for brand match
          }
        });
      }
      
      // Secondary attributes (worth 0.15 total)
      if (attributes.primaryColors?.[0] && itemText.includes(attributes.primaryColors[0].toLowerCase())) {
        score += 0.075;
      }
      if (attributes.fabricType && itemText.includes(attributes.fabricType.toLowerCase())) {
        score += 0.0375;
      }
      if (attributes.pattern && itemText.includes(attributes.pattern.toLowerCase())) {
        score += 0.0375;
      }
      
      return { ...item, similarity_score: Math.min(score, 1.0) };
    }).sort((a, b) => b.similarity_score - a.similarity_score);

    // Take all items
    const topMatches = scoredItems.slice(0, 8);

    if (topMatches.length === 0) {
      await supabase
        .from('visual_searches')
        .update({ 
          status: 'no_matches',
          analysis_data: { 
            attributes,
            reason: 'Could not extract valid product listings from marketplace. The items may have been removed, prices were unrealistic, or the search query did not match available inventory.',
            suggestions: [
              'Try uploading a different angle of the item',
              'Make sure the item is clearly visible in the photo',
              'Consider searching for similar but more common items',
              `Search manually on Vinted for: ${searchQuery}`
            ]
          }
        })
        .eq('id', searchId);

      return new Response(JSON.stringify({ 
        status: 'no_matches',
        attributes,
        searchQuery,
        message: 'No valid matches found. Please try a different image or search manually.',
        suggestions: [
          'Try uploading a clearer photo with the item as the main focus',
          'Search manually on marketplace sites',
          `Suggested search term: "${searchQuery}"`
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Store results with error handling
    try {
      const insertPromises = topMatches.map(result => {
        const matchedAttrs = [];
        // Balanced match explanation
        if (attributes.itemType) matchedAttrs.push(attributes.itemType);
        if (attributes.notableDetails && attributes.notableDetails.length > 0) {
          matchedAttrs.push(...attributes.notableDetails.slice(0, 2));
        }
        if (attributes.silhouette) matchedAttrs.push(`${attributes.silhouette} fit`);
        if (attributes.visibleText && attributes.visibleText.length > 0) {
          matchedAttrs.push(...attributes.visibleText.map((t: string) => `"${t}"`));
        }
        
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
            matched_attributes: { matched: matchedAttrs },
            match_explanation: `Matches: ${matchedAttrs.join(', ')}`
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
      tentativeCount: topMatches.filter(m => m.similarity_score < HIGH_THRESHOLD).length,
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

// Calculate similarity between search attributes and catalog item attributes
function calculateAttributeSimilarity(searchAttrs: any, itemAttrs: any): number {
  let score = 0;
  let maxScore = 0;

  // Item type match (weight: 20%)
  maxScore += 0.20;
  if (searchAttrs.itemType && itemAttrs.itemType) {
    if (searchAttrs.itemType.toLowerCase() === itemAttrs.itemType.toLowerCase()) score += 0.20;
  }

  // Fabric type match (weight: 15%)
  maxScore += 0.15;
  if (searchAttrs.fabricType && itemAttrs.fabricType) {
    if (searchAttrs.fabricType.toLowerCase() === itemAttrs.fabricType.toLowerCase()) score += 0.15;
    else if (itemAttrs.fabricType.toLowerCase().includes(searchAttrs.fabricType.toLowerCase())) score += 0.075;
  }

  // Color match (weight: 15%)
  maxScore += 0.15;
  if (searchAttrs.primaryColors && itemAttrs.primaryColors) {
    const colorMatch = searchAttrs.primaryColors.some((c: string) => 
      itemAttrs.primaryColors.some((ic: string) => ic.toLowerCase().includes(c.toLowerCase()))
    );
    if (colorMatch) score += 0.15;
  }

  // Pattern match (weight: 10%)
  maxScore += 0.10;
  if (searchAttrs.pattern && itemAttrs.pattern) {
    if (searchAttrs.pattern.toLowerCase() === itemAttrs.pattern.toLowerCase()) score += 0.10;
  }

  // Silhouette match (weight: 15%)
  maxScore += 0.15;
  if (searchAttrs.silhouette && itemAttrs.silhouette) {
    if (searchAttrs.silhouette.toLowerCase() === itemAttrs.silhouette.toLowerCase()) score += 0.15;
  }

  // Aesthetic match (weight: 10%)
  maxScore += 0.10;
  if (searchAttrs.aesthetic && itemAttrs.aesthetic) {
    if (searchAttrs.aesthetic.toLowerCase() === itemAttrs.aesthetic.toLowerCase()) score += 0.10;
  }

  // Era match (weight: 10%)
  maxScore += 0.10;
  if (searchAttrs.era && itemAttrs.era) {
    if (searchAttrs.era.toLowerCase() === itemAttrs.era.toLowerCase()) score += 0.10;
  }

  // Length match (weight: 5%)
  maxScore += 0.05;
  if (searchAttrs.length && itemAttrs.length) {
    if (searchAttrs.length.toLowerCase() === itemAttrs.length.toLowerCase()) score += 0.05;
  }

  return maxScore > 0 ? score / maxScore : 0;
}

// Find which attributes matched between search and item
function findMatchedAttributes(searchAttrs: any, itemAttrs: any): string[] {
  const matched: string[] = [];

  if (searchAttrs.fabricType && itemAttrs.fabricType && 
      searchAttrs.fabricType.toLowerCase() === itemAttrs.fabricType.toLowerCase()) {
    matched.push(`${searchAttrs.fabricType} fabric`);
  }

  if (searchAttrs.primaryColors && itemAttrs.primaryColors) {
    const colorMatch = searchAttrs.primaryColors.filter((c: string) => 
      itemAttrs.primaryColors.some((ic: string) => ic.toLowerCase().includes(c.toLowerCase()))
    );
    if (colorMatch.length > 0) {
      matched.push(`${colorMatch.join(', ')} color`);
    }
  }

  if (searchAttrs.pattern && itemAttrs.pattern && 
      searchAttrs.pattern.toLowerCase() === itemAttrs.pattern.toLowerCase()) {
    matched.push(`${searchAttrs.pattern} pattern`);
  }

  if (searchAttrs.silhouette && itemAttrs.silhouette && 
      searchAttrs.silhouette.toLowerCase() === itemAttrs.silhouette.toLowerCase()) {
    matched.push(`${searchAttrs.silhouette} silhouette`);
  }

  if (searchAttrs.sleeveType && itemAttrs.sleeveType && 
      searchAttrs.sleeveType.toLowerCase() === itemAttrs.sleeveType.toLowerCase()) {
    matched.push(`${searchAttrs.sleeveType} sleeves`);
  }

  if (searchAttrs.length && itemAttrs.length && 
      searchAttrs.length.toLowerCase() === itemAttrs.length.toLowerCase()) {
    matched.push(`${searchAttrs.length} length`);
  }

  if (searchAttrs.aesthetic && itemAttrs.aesthetic && 
      searchAttrs.aesthetic.toLowerCase() === itemAttrs.aesthetic.toLowerCase()) {
    matched.push(`${searchAttrs.aesthetic} aesthetic`);
  }

  return matched;
}

// Generate human-readable match explanation
function generateMatchExplanation(matchedAttributes: string[]): string {
  if (matchedAttributes.length === 0) {
    return 'Similar style and characteristics';
  }
  return matchedAttributes.join(' • ');
}