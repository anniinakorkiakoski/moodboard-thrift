import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Ranking weights based on your spec
const WEIGHTS = {
  imageSimilarity: 0.55,
  textSimilarity: 0.25,
  attributeMatch: 0.15,
  qualityScore: 0.05
};

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

    // STEP 1: Advanced attribute extraction using vision model
    console.log('Extracting detailed garment attributes...');
    
    const cropInstruction = cropData 
      ? `Focus ONLY on the cropped/highlighted area of this image.` 
      : `Identify the SINGLE MOST PROMINENT fashion item in this image.`;
    
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
            content: `You are a fashion expert AI specialized in identifying garment attributes for resale marketplace search.

${cropInstruction}

Extract structured attributes in JSON format:
{
  "category": "specific item type (e.g., 'wrap top', 'midi dress', 'cargo pants', 'ankle boots')",
  "subcategory": "even more specific (e.g., 'hanfu wrap top', 'A-line midi dress')",
  "colors": {
    "primary": "main color",
    "secondary": "accent color if any",
    "colorFamily": "broad category (warm/cool/neutral)"
  },
  "material": {
    "fabric": "material type (e.g., 'organza', 'cotton', 'leather', 'denim')",
    "texture": "texture (e.g., 'sheer', 'matte', 'distressed', 'smooth')",
    "weight": "light/medium/heavy"
  },
  "pattern": {
    "type": "pattern (e.g., 'floral jacquard', 'solid', 'stripes', 'animal print')",
    "scale": "small/medium/large if patterned"
  },
  "construction": {
    "silhouette": "shape (e.g., 'loose', 'fitted', 'A-line', 'oversized')",
    "length": "garment length",
    "sleeves": "sleeve type if applicable",
    "neckline": "neckline type if applicable",
    "closure": "how it fastens (e.g., 'frog buttons', 'zipper', 'wrap')"
  },
  "style": {
    "era": "vintage era if applicable (e.g., 'Y2K', '90s', 'vintage')",
    "aesthetic": "style category (e.g., 'bohemian', 'minimalist', 'traditional Chinese', 'punk')",
    "culturalOrigin": "if traditional garment (e.g., 'Hanfu', 'Kimono', null)"
  },
  "distinctiveFeatures": ["unique details like 'embroidery', 'studs', 'frog closures'"],
  "searchQueries": {
    "primary": "best 3-5 word Etsy search query",
    "fallback": "simpler 2-3 word search query",
    "alternative": "related style search query"
  },
  "textDescription": "One sentence describing the item for text matching"
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this fashion item in detail. Return ONLY valid JSON with all fields.'
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
    let attributes: any;
    try {
      const content = attributeData.choices[0].message.content;
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || content.match(/(\{[\s\S]*\})/);
      attributes = JSON.parse(jsonMatch ? jsonMatch[1] : content);
      console.log('Extracted attributes:', JSON.stringify(attributes, null, 2));
    } catch (e) {
      console.error('Failed to parse attributes:', e);
      attributes = { 
        category: 'clothing',
        searchQueries: { primary: 'vintage clothing', fallback: 'clothing' }
      };
    }

    // Store analysis data
    await supabase
      .from('visual_searches')
      .update({ 
        status: 'searching',
        analysis_data: { attributes },
        attributes: attributes
      })
      .eq('id', searchId);

    // STEP 2: Search Etsy with multiple query strategies
    console.log('Searching Etsy with extracted queries...');
    
    const searchQueries = [
      attributes.searchQueries?.primary,
      attributes.searchQueries?.fallback,
      attributes.searchQueries?.alternative,
      `vintage ${attributes.category || 'clothing'}`
    ].filter(Boolean);

    let allItems: any[] = [];
    
    for (const query of searchQueries) {
      if (allItems.length >= 20) break; // Enough items
      
      console.log(`Searching Etsy for: "${query}"`);
      const items = await scrapeEtsy(query, LOVABLE_API_KEY, budget);
      console.log(`Found ${items.length} items for query "${query}"`);
      
      // Add query source to items
      items.forEach(item => item._searchQuery = query);
      allItems.push(...items);
    }

    // Deduplicate by URL
    const uniqueItems = Array.from(
      new Map(allItems.map(item => [item.item_url, item])).values()
    );
    
    console.log(`Total unique items: ${uniqueItems.length}`);

    if (uniqueItems.length === 0) {
      await supabase
        .from('visual_searches')
        .update({ 
          status: 'no_matches',
          analysis_data: { 
            attributes,
            reason: 'No matching items found on Etsy.',
            searchedQueries: searchQueries,
            suggestions: [
              'Try uploading a clearer photo',
              'Search manually on Etsy for: ' + (attributes.searchQueries?.primary || attributes.category)
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

    // STEP 3: Score each item using the weighted formula
    console.log('Scoring items with weighted matching algorithm...');
    
    const scoredItems = uniqueItems.map(item => {
      const scores = calculateMatchScores(attributes, item);
      const finalScore = 
        (scores.imageSimilarity * WEIGHTS.imageSimilarity) +
        (scores.textSimilarity * WEIGHTS.textSimilarity) +
        (scores.attributeMatch * WEIGHTS.attributeMatch) +
        (scores.qualityScore * WEIGHTS.qualityScore);
      
      return {
        ...item,
        similarity_score: Math.min(finalScore, 1.0),
        _scores: scores,
        match_explanation: generateDetailedExplanation(attributes, item, scores)
      };
    })
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 12); // Top 12 results

    console.log(`Top match score: ${scoredItems[0]?.similarity_score.toFixed(2)}`);

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
            match_explanation: result.match_explanation
          });
      });

      await Promise.all(insertPromises);
      console.log(`Stored ${topMatches.length} results`);
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
      highQualityCount: topMatches.filter(m => m.similarity_score >= 0.7).length,
      attributes,
      searchedQueries: searchQueries
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

// Enhanced Etsy scraping with better extraction
async function scrapeEtsy(query: string, apiKey: string, budget?: { min?: number; max?: number }): Promise<any[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    
    // Build Etsy URL with filters
    let etsyUrl = `https://www.etsy.com/search?q=${encodedQuery}&ref=search_bar&explicit=1`;
    if (budget?.min) etsyUrl += `&min=${budget.min}`;
    if (budget?.max) etsyUrl += `&max=${budget.max}`;
    
    console.log('Fetching:', etsyUrl);

    const response = await fetch(etsyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
      }
    });

    if (!response.ok) {
      console.error('Etsy fetch failed:', response.status, response.statusText);
      return [];
    }

    const html = await response.text();
    console.log('HTML length:', html.length);

    // Use AI to extract listings with detailed info
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
            content: `Extract product listings from Etsy HTML. Return a JSON array with up to 15 products.

Each product object:
{
  "title": "full product title",
  "price": 29.99,
  "currency": "USD",
  "item_url": "https://www.etsy.com/listing/...",
  "image_url": "https://i.etsystatic.com/...",
  "shopName": "seller shop name if visible",
  "freeShipping": true/false,
  "originalPrice": 39.99 (if on sale, otherwise null)
}

RULES:
1. URLs must start with https://www.etsy.com/listing/
2. Image URLs from i.etsystatic.com
3. Parse prices as numbers (remove $, €, etc.)
4. Return ONLY the JSON array
5. If no valid listings found, return []`
          },
          {
            role: 'user',
            content: `Extract Etsy listings from this HTML (first 60000 chars):\n\n${html.substring(0, 60000)}`
          }
        ],
      }),
    });

    if (!extractResponse.ok) {
      console.error('AI extraction failed');
      return [];
    }

    const extractData = await extractResponse.json();
    const content = extractData.choices?.[0]?.message?.content || '[]';
    
    let items = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      items = JSON.parse(jsonMatch ? jsonMatch[0] : '[]');
    } catch (e) {
      console.error('Failed to parse items:', e);
      return [];
    }

    // Validate items
    const validItems = items.filter((item: any) => 
      item.title && 
      item.item_url?.includes('etsy.com/listing') &&
      item.image_url?.includes('etsystatic.com') &&
      typeof item.price === 'number' &&
      item.price > 0 &&
      item.price < 5000
    );

    console.log(`Validated ${validItems.length}/${items.length} items`);
    return validItems;

  } catch (error) {
    console.error('Etsy scrape error:', error);
    return [];
  }
}

// Calculate multi-factor match scores
function calculateMatchScores(attributes: any, item: any): {
  imageSimilarity: number;
  textSimilarity: number;
  attributeMatch: number;
  qualityScore: number;
} {
  const titleLower = (item.title || '').toLowerCase();
  
  // Since we don't have actual CLIP embeddings, estimate image similarity via text proxy
  // In production, this would use real visual embeddings
  let imageSimilarity = 0.5; // Base score
  
  // Boost if primary search query matches (indicates visual relevance)
  if (item._searchQuery === attributes.searchQueries?.primary) {
    imageSimilarity += 0.2;
  }
  
  // Text similarity - compare AI description to listing title
  let textSimilarity = 0;
  const description = (attributes.textDescription || '').toLowerCase();
  const descWords = description.split(/\s+/).filter((w: string) => w.length > 3);
  
  descWords.forEach((word: string) => {
    if (titleLower.includes(word)) {
      textSimilarity += 0.15;
    }
  });
  textSimilarity = Math.min(textSimilarity, 1.0);
  
  // Attribute matching
  let attributeMatch = 0;
  const attrChecks = [
    { attr: attributes.category, weight: 0.25 },
    { attr: attributes.subcategory, weight: 0.15 },
    { attr: attributes.colors?.primary, weight: 0.15 },
    { attr: attributes.material?.fabric, weight: 0.15 },
    { attr: attributes.pattern?.type, weight: 0.1 },
    { attr: attributes.style?.era, weight: 0.1 },
    { attr: attributes.style?.aesthetic, weight: 0.1 },
  ];
  
  attrChecks.forEach(check => {
    if (check.attr && titleLower.includes(check.attr.toLowerCase())) {
      attributeMatch += check.weight;
    }
  });
  
  // Check distinctive features
  if (attributes.distinctiveFeatures) {
    attributes.distinctiveFeatures.forEach((feature: string) => {
      if (titleLower.includes(feature.toLowerCase())) {
        attributeMatch += 0.1;
      }
    });
  }
  attributeMatch = Math.min(attributeMatch, 1.0);
  
  // Quality score - Etsy listing quality indicators
  let qualityScore = 0.5;
  if (item.freeShipping) qualityScore += 0.2;
  if (item.shopName) qualityScore += 0.1;
  if (item.image_url?.includes('il_')) qualityScore += 0.2; // High-res image indicator
  qualityScore = Math.min(qualityScore, 1.0);
  
  return {
    imageSimilarity,
    textSimilarity,
    attributeMatch,
    qualityScore
  };
}

// Generate detailed match explanation
function generateDetailedExplanation(attributes: any, item: any, scores: any): string {
  const matches: string[] = [];
  const titleLower = (item.title || '').toLowerCase();
  
  // Category match
  if (attributes.category && titleLower.includes(attributes.category.toLowerCase())) {
    matches.push(attributes.category);
  }
  
  // Color match
  if (attributes.colors?.primary && titleLower.includes(attributes.colors.primary.toLowerCase())) {
    matches.push(attributes.colors.primary + ' color');
  }
  
  // Material match
  if (attributes.material?.fabric && titleLower.includes(attributes.material.fabric.toLowerCase())) {
    matches.push(attributes.material.fabric);
  }
  
  // Style match
  if (attributes.style?.aesthetic && titleLower.includes(attributes.style.aesthetic.toLowerCase())) {
    matches.push(attributes.style.aesthetic + ' style');
  }
  
  // Era match
  if (attributes.style?.era && titleLower.includes(attributes.style.era.toLowerCase())) {
    matches.push(attributes.style.era);
  }
  
  // Distinctive features
  if (attributes.distinctiveFeatures) {
    attributes.distinctiveFeatures.forEach((f: string) => {
      if (titleLower.includes(f.toLowerCase())) {
        matches.push(f);
      }
    });
  }
  
  if (matches.length === 0) {
    const overallScore = (scores.imageSimilarity + scores.textSimilarity + scores.attributeMatch) / 3;
    if (overallScore > 0.6) {
      return 'Similar style from Etsy search';
    }
    return 'Related item';
  }
  
  return 'Matches: ' + matches.slice(0, 4).join(', ');
}
