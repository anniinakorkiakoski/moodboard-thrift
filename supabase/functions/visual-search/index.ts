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

    // Step 3: Search catalog items using database query
    console.log('Searching catalog database...');
    
    let catalogQuery = supabase
      .from('catalog_items')
      .select('*')
      .eq('is_active', true);

    // Apply budget filters if provided
    if (budget) {
      if (budget.min) {
        catalogQuery = catalogQuery.gte('price', budget.min);
      }
      if (budget.max) {
        catalogQuery = catalogQuery.lte('price', budget.max);
      }
      console.log('Applied budget filter:', budget);
    }

    const { data: catalogItems, error: catalogError } = await catalogQuery;

    if (catalogError) {
      console.error('Catalog query error:', catalogError);
      throw new Error('Failed to query catalog');
    }

    console.log(`Found ${catalogItems?.length || 0} catalog items`);

    if (!catalogItems || catalogItems.length === 0) {
      await supabase
        .from('visual_searches')
        .update({ 
          status: 'no_matches',
          analysis_data: { 
            attributes,
            reason: 'No items in catalog match your search criteria.',
            suggestions: [
              'Try adjusting your budget range',
              'Upload a different item to search for',
              'Check back later as we add more items'
            ]
          }
        })
        .eq('id', searchId);

      return new Response(JSON.stringify({ 
        status: 'no_matches',
        attributes,
        message: 'No matches found in catalog.',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Score each catalog item based on attribute matching
    const scoredItems = catalogItems.map(item => {
      const itemAttrs = item.attributes || {};
      const itemText = `${item.title} ${item.description || ''}`.toLowerCase();
      
      // Calculate attribute-based similarity
      const attrScore = calculateAttributeSimilarity(attributes, itemAttrs);
      
      // Text-based matching for additional confidence
      let textScore = 0;
      
      // Item type match (critical)
      if (attributes.itemType && itemText.includes(attributes.itemType.toLowerCase())) {
        textScore += 0.25;
      }
      
      // Category match
      if (attributes.category && itemText.includes(attributes.category.toLowerCase())) {
        textScore += 0.15;
      }
      
      // Notable details
      if (attributes.notableDetails && attributes.notableDetails.length > 0) {
        attributes.notableDetails.forEach((detail: string) => {
          if (detail.length > 3 && itemText.includes(detail.toLowerCase())) {
            textScore += 0.1;
          }
        });
      }
      
      // Color match
      if (attributes.primaryColors && attributes.primaryColors.length > 0) {
        attributes.primaryColors.forEach((color: string) => {
          if (itemText.includes(color.toLowerCase())) {
            textScore += 0.1;
          }
        });
      }
      
      // Combine scores (70% attribute matching, 30% text matching)
      const finalScore = (attrScore * 0.7) + (Math.min(textScore, 1.0) * 0.3);
      
      const matchedAttrs = findMatchedAttributes(attributes, itemAttrs);
      
      return {
        ...item,
        similarity_score: finalScore,
        matched_attributes: matchedAttrs,
        match_explanation: generateMatchExplanation(matchedAttrs)
      };
    })
    .filter(item => item.similarity_score > 0.1) // Only keep items with some relevance
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 8); // Top 8 results

    console.log(`Scored ${scoredItems.length} matches, top score: ${scoredItems[0]?.similarity_score || 0}`);

    // Map to response format
    const mappedItems = scoredItems.map(item => ({
      platform: item.platform,
      item_url: item.item_url,
      title: item.title,
      price: item.price,
      currency: item.currency || 'EUR',
      image_url: item.image_url,
      description: item.description || item.title,
      similarity_score: item.similarity_score,
      matched_attributes: item.matched_attributes,
      match_explanation: item.match_explanation
    }));

    const topMatches = mappedItems;

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
            matched_attributes: { matched: result.matched_attributes || [] },
            match_explanation: result.match_explanation || 'Similar item'
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

  // Helper to safely get string value
  const getString = (val: any): string | null => {
    if (!val) return null;
    if (typeof val === 'string') return val.toLowerCase();
    if (Array.isArray(val)) return val.join(' ').toLowerCase();
    return String(val).toLowerCase();
  };

  // Item type match (weight: 20%)
  maxScore += 0.20;
  const searchType = getString(searchAttrs.itemType);
  const itemType = getString(itemAttrs.itemType);
  if (searchType && itemType) {
    if (searchType === itemType) score += 0.20;
  }

  // Fabric type match (weight: 15%)
  maxScore += 0.15;
  const searchFabric = getString(searchAttrs.fabricType);
  const itemFabric = getString(itemAttrs.fabricType);
  if (searchFabric && itemFabric) {
    if (searchFabric === itemFabric) score += 0.15;
    else if (itemFabric.includes(searchFabric)) score += 0.075;
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
  const searchAesthetic = getString(searchAttrs.aesthetic);
  const itemAesthetic = getString(itemAttrs.aesthetic);
  if (searchAesthetic && itemAesthetic) {
    if (searchAesthetic === itemAesthetic || itemAesthetic.includes(searchAesthetic)) score += 0.10;
  }

  // Era match (weight: 10%)
  maxScore += 0.10;
  const searchEra = getString(searchAttrs.era);
  const itemEra = getString(itemAttrs.era);
  if (searchEra && itemEra) {
    if (searchEra === itemEra) score += 0.10;
  }

  // Length match (weight: 5%)
  maxScore += 0.05;
  const searchLength = getString(searchAttrs.length);
  const itemLength = getString(itemAttrs.length);
  if (searchLength && itemLength) {
    if (searchLength === itemLength) score += 0.05;
  }

  return maxScore > 0 ? score / maxScore : 0;
}

// Find which attributes matched between search and item
function findMatchedAttributes(searchAttrs: any, itemAttrs: any): string[] {
  const matched: string[] = [];
  
  // Helper to safely get string value
  const getString = (val: any): string | null => {
    if (!val) return null;
    if (typeof val === 'string') return val.toLowerCase();
    if (Array.isArray(val)) return val.join(' ').toLowerCase();
    return String(val).toLowerCase();
  };

  const searchFabric = getString(searchAttrs.fabricType);
  const itemFabric = getString(itemAttrs.fabricType);
  if (searchFabric && itemFabric && searchFabric === itemFabric) {
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

  const searchPattern = getString(searchAttrs.pattern);
  const itemPattern = getString(itemAttrs.pattern);
  if (searchPattern && itemPattern && searchPattern === itemPattern) {
    matched.push(`${searchAttrs.pattern} pattern`);
  }

  const searchSilhouette = getString(searchAttrs.silhouette);
  const itemSilhouette = getString(itemAttrs.silhouette);
  if (searchSilhouette && itemSilhouette && searchSilhouette === itemSilhouette) {
    matched.push(`${searchAttrs.silhouette} silhouette`);
  }

  const searchSleeve = getString(searchAttrs.sleeveType);
  const itemSleeve = getString(itemAttrs.sleeveType);
  if (searchSleeve && itemSleeve && searchSleeve === itemSleeve) {
    matched.push(`${searchAttrs.sleeveType} sleeves`);
  }

  const searchLength = getString(searchAttrs.length);
  const itemLength = getString(itemAttrs.length);
  if (searchLength && itemLength && searchLength === itemLength) {
    matched.push(`${searchAttrs.length} length`);
  }

  const searchAesthetic = getString(searchAttrs.aesthetic);
  const itemAesthetic = getString(itemAttrs.aesthetic);
  if (searchAesthetic && itemAesthetic && (searchAesthetic === itemAesthetic || itemAesthetic.includes(searchAesthetic))) {
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