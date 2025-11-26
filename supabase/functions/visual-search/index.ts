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
    const { imageUrl, searchId, cropData } = await req.json();
    
    if (!imageUrl || !searchId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
            content: `You are a fashion expert AI analyzing clothing items for precise visual search. Extract structured attributes in JSON format with these exact fields:
{
  "itemType": "main garment type (e.g., jacket, dress, top, pants)",
  "category": "specific category (e.g., blazer, midi dress, button-up shirt)",
  "fabricType": "material type (e.g., satin, cotton, denim, wool, linen)",
  "fabricTexture": "texture qualities (e.g., sheen, matte, textured, smooth)",
  "primaryColors": ["dominant color 1", "color 2"],
  "pattern": "pattern type (e.g., solid, floral, stripes, geometric, animal print)",
  "silhouette": "overall shape (e.g., fitted, oversized, A-line, boxy, cropped)",
  "sleeveType": "sleeve style (e.g., long, short, kimono, puff, sleeveless)",
  "necklineCollar": "neckline/collar (e.g., v-neck, crew, collared, off-shoulder)",
  "length": "garment length (e.g., cropped, hip-length, midi, maxi)",
  "closureType": "fastening (e.g., button-front, zip, wrap, pullover)",
  "notableDetails": ["detail 1", "detail 2"],
  "era": "style era (e.g., 90s, vintage, modern, Y2K)",
  "aesthetic": "overall vibe (e.g., romantic, minimalist, bohemian, grunge)"
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this clothing item in extreme detail and return ONLY valid JSON with all the fields specified. Be as specific as possible about every attribute.'
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

    // Step 2: Generate search query and URLs from attributes
    const searchQuery = `${attributes.category || attributes.itemType} ${attributes.fabricType || ''} ${attributes.primaryColors?.[0] || ''} ${attributes.pattern || ''}`.trim();
    console.log('Generated search query:', searchQuery);

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
    
    for (const url of searchUrls.slice(0, 3)) { // Process first 3 platforms
      try {
        console.log('Fetching:', url);
        
        const pageResponse = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });
        
        if (!pageResponse.ok) {
          console.error('Failed to fetch:', url, pageResponse.status);
          continue;
        }
        
        const html = await pageResponse.text();
        const truncatedHtml = html.substring(0, 50000); // First 50k chars
        
        console.log('Extracting items with AI...');
        
        // Extract items using AI
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
              content: `Extract fashion item listings from this search results page. Find item URLs, image URLs, titles, and prices.\n\nHTML:\n${truncatedHtml}`
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
                          itemUrl: { type: 'string' },
                          imageUrl: { type: 'string' },
                          title: { type: 'string' },
                          price: { type: 'string' },
                          currency: { type: 'string' }
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
        
        if (extractResponse.ok) {
          const extractData = await extractResponse.json();
          const toolCall = extractData.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall) {
            const result = JSON.parse(toolCall.function.arguments);
            const platform = url.includes('vinted') ? 'vinted' : url.includes('depop') ? 'depop' : 'tise';
            
            // Add items to our list with platform info
            result.items.forEach((item: any) => {
              allItems.push({
                ...item,
                platform,
                attributes: {}, // Will be analyzed later
              });
            });
            
            console.log(`Extracted ${result.items.length} items from ${platform}`);
          }
        }
      } catch (err) {
        console.error('Error processing URL:', url, err);
      }
    }

    console.log(`Total items extracted: ${allItems.length}`);

    // Map items to database schema format
    const mappedItems = allItems.map(item => ({
      platform: item.platform,
      item_url: item.itemUrl || '',
      title: item.title || 'Untitled',
      price: parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0'),
      currency: item.currency || 'EUR',
      image_url: item.imageUrl || null,
      description: item.title || ''
    }));

    // Quickly calculate basic text similarity for initial sorting
    const scoredItems = mappedItems.map(item => {
      // Simple text-based scoring for speed
      let score = 0;
      const searchText = `${attributes.category} ${attributes.fabricType} ${attributes.primaryColors?.join(' ')} ${attributes.pattern}`.toLowerCase();
      const itemText = item.title.toLowerCase();
      
      // Count keyword matches
      const keywords = searchText.split(' ').filter(k => k.length > 2);
      keywords.forEach(keyword => {
        if (itemText.includes(keyword)) score += 0.2;
      });
      
      return { ...item, similarity_score: Math.min(score, 1.0) };
    }).sort((a, b) => b.similarity_score - a.similarity_score);

    // Take top items that have at least some match
    const topMatches = scoredItems.filter(item => item.similarity_score >= FALLBACK_THRESHOLD).slice(0, 20);

    if (topMatches.length === 0) {
      await supabase
        .from('visual_searches')
        .update({ status: 'no_matches' })
        .eq('id', searchId);

      return new Response(JSON.stringify({ 
        status: 'no_matches',
        attributes,
        message: 'No curated matches found for this item.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Store results with match explanations
    const insertPromises = topMatches.map(result => {
      const matchedAttrs = [];
      if (attributes.category) matchedAttrs.push(attributes.category);
      if (attributes.primaryColors?.[0]) matchedAttrs.push(attributes.primaryColors[0]);
      
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

    // Update status
    const finalStatus = topMatches.some(m => m.similarity_score >= HIGH_THRESHOLD) ? 'completed' : 'completed';
    await supabase
      .from('visual_searches')
      .update({ status: finalStatus })
      .eq('id', searchId);

    return new Response(JSON.stringify({ 
      status: finalStatus,
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