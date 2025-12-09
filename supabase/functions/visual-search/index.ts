import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Weighted scoring formula per your AI Shopping Agent spec
const WEIGHTS = {
  visualSimilarity: 0.40,   // Estimated from attribute/color/pattern matching
  textSimilarity: 0.25,     // Description vs listing text
  attributeMatch: 0.25,     // Structured attribute comparison
  qualityScore: 0.10        // Marketplace indicators
};

// Attribute importance weights for detailed matching
const ATTRIBUTE_WEIGHTS = {
  category: 0.20,           // Item type (dress, top, pants)
  silhouette: 0.15,         // Shape/cut (A-line, fitted, oversized)
  color: 0.15,              // Primary color match
  pattern: 0.12,            // Pattern type (floral, solid, stripes)
  material: 0.12,           // Fabric type
  style: 0.10,              // Aesthetic (boho, minimal, vintage)
  distinctiveFeatures: 0.16 // Unique details
};

interface ExtractedAttributes {
  category: string;
  subcategory?: string;
  colors: {
    primary: string;
    secondary?: string;
    colorFamily: string;
  };
  material: {
    fabric: string;
    texture?: string;
    weight?: string;
  };
  pattern: {
    type: string;
    scale?: string;
  };
  construction: {
    silhouette: string;
    length?: string;
    sleeves?: string;
    neckline?: string;
    closure?: string;
  };
  style: {
    era?: string;
    aesthetic: string;
    culturalOrigin?: string;
  };
  distinctiveFeatures: string[];
  searchQueries: {
    primary: string;
    fallback: string;
    alternative: string;
    keywords: string[];
  };
  textDescription: string;
  visualSignature: {
    dominantColors: string[];
    patternDescription: string;
    shapeDescription: string;
  };
}

interface ScoredItem {
  title: string;
  price: number;
  currency: string;
  item_url: string;
  image_url: string;
  shopName?: string;
  freeShipping?: boolean;
  originalPrice?: number;
  similarity_score: number;
  match_explanation: string;
  _scores: MatchScores;
  _searchQuery?: string;
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

    console.log('=== AI SHOPPING AGENT: Visual Search ===');
    console.log('Search ID:', searchId);
    console.log('Budget:', budget || 'No budget set');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update status to analyzing
    await supabase
      .from('visual_searches')
      .update({ status: 'analyzing', crop_data: cropData })
      .eq('id', searchId);

    // ============================================================
    // STEP 1: ADVANCED IMAGE ANALYSIS / FEATURE EXTRACTION
    // ============================================================
    console.log('\n[STEP 1] Extracting visual features and attributes...');
    
    const attributes = await extractDetailedAttributes(imageUrl, cropData, LOVABLE_API_KEY);
    console.log('Extracted category:', attributes.category);
    console.log('Primary color:', attributes.colors.primary);
    console.log('Silhouette:', attributes.construction.silhouette);
    console.log('Search queries:', attributes.searchQueries);

    // Store analysis data
    await supabase
      .from('visual_searches')
      .update({ 
        status: 'searching',
        analysis_data: { attributes },
        attributes: attributes
      })
      .eq('id', searchId);

    // ============================================================
    // STEP 2: PRODUCT SEARCH / RETRIEVAL (Using Local Catalog)
    // ============================================================
    console.log('\n[STEP 2] Searching local catalog with generated queries...');
    
    const searchQueries = [
      attributes.searchQueries.primary,
      attributes.searchQueries.fallback,
      attributes.searchQueries.alternative,
      ...attributes.searchQueries.keywords
    ].filter(Boolean);
    
    const searchedQueries: string[] = searchQueries;

    // Search the local catalog_items table
    const items = await searchLocalCatalog(supabase, searchQueries, attributes, budget);
    console.log(`Found ${items.length} items in local catalog`);
    
    const uniqueItems = items;

    if (uniqueItems.length === 0) {
      await supabase
        .from('visual_searches')
        .update({ 
          status: 'no_matches',
          analysis_data: { 
            attributes,
            reason: 'No matching items found in catalog.',
            searchedQueries,
            suggestions: [
              `Try adding more items to the catalog`,
              'Upload a clearer photo of the item',
              'Consider hiring a professional thrifter'
            ]
          }
        })
        .eq('id', searchId);

      return new Response(JSON.stringify({ 
        status: 'no_matches',
        attributes,
        message: 'No matches found.',
        searchedQueries
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ============================================================
    // STEP 3: MATCHING & SCORING WITH WEIGHTED ALGORITHM
    // ============================================================
    console.log('\n[STEP 3] Scoring items with weighted matching algorithm...');
    
    const scoredItems: ScoredItem[] = uniqueItems.map(item => {
      const scores = calculateAdvancedMatchScores(attributes, item);
      
      // Apply weighted formula
      const finalScore = 
        (scores.visualSimilarity * WEIGHTS.visualSimilarity) +
        (scores.textSimilarity * WEIGHTS.textSimilarity) +
        (scores.attributeMatch * WEIGHTS.attributeMatch) +
        (scores.qualityScore * WEIGHTS.qualityScore);
      
      return {
        ...item,
        similarity_score: Math.min(finalScore, 1.0),
        _scores: scores,
        match_explanation: generateMatchExplanation(attributes, item, scores)
      };
    })
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 15); // Top 15 results

    // ============================================================
    // STEP 4: FILTER BY MATCH QUALITY THRESHOLDS
    // ============================================================
    console.log('\n[STEP 4] Filtering by quality thresholds...');
    
    const highQuality = scoredItems.filter(i => i.similarity_score >= 0.70);
    const mediumQuality = scoredItems.filter(i => i.similarity_score >= 0.50 && i.similarity_score < 0.70);
    const lowQuality = scoredItems.filter(i => i.similarity_score < 0.50);
    
    console.log(`High quality (≥70%): ${highQuality.length}`);
    console.log(`Medium quality (50-69%): ${mediumQuality.length}`);
    console.log(`Low quality (<50%): ${lowQuality.length}`);
    console.log(`Top score: ${(scoredItems[0]?.similarity_score * 100).toFixed(1)}%`);

    // Store results in database
    const topMatches = scoredItems.slice(0, 12);
    
    try {
      const insertPromises = topMatches.map((result: ScoredItem) => {
        // Get platform from result, default to depop
        const platform = (result as any).platform || 'depop';
        
        return supabase
          .from('search_results')
          .insert({
            search_id: searchId,
            platform: platform as any,
            item_url: result.item_url,
            title: result.title,
            price: result.price,
            currency: result.currency || 'EUR',
            image_url: result.image_url,
            similarity_score: result.similarity_score,
            description: result.title,
            matched_attributes: {
              breakdown: result._scores.breakdown,
              matchedFeatures: extractMatchedFeatures(attributes, result)
            },
            match_explanation: result.match_explanation
          });
      });

      await Promise.all(insertPromises);
      console.log(`\nStored ${topMatches.length} results to database`);
    } catch (dbError) {
      console.error('Database insert error:', dbError);
    }

    // Update final status
    const finalStatus = highQuality.length > 0 ? 'completed' : 
                        mediumQuality.length > 0 ? 'completed' : 'no_matches';
    
    await supabase
      .from('visual_searches')
      .update({ 
        status: finalStatus,
        analysis_data: {
          attributes,
          searchedQueries,
          matchStats: {
            total: uniqueItems.length,
            highQuality: highQuality.length,
            mediumQuality: mediumQuality.length,
            lowQuality: lowQuality.length,
            topScore: scoredItems[0]?.similarity_score
          }
        }
      })
      .eq('id', searchId);

    console.log('\n=== SEARCH COMPLETE ===');

    return new Response(JSON.stringify({ 
      status: finalStatus,
      resultsCount: topMatches.length,
      highQualityCount: highQuality.length,
      attributes,
      searchedQueries,
      matchStats: {
        highQuality: highQuality.length,
        mediumQuality: mediumQuality.length,
        topScore: scoredItems[0]?.similarity_score
      }
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

// ============================================================
// ADVANCED ATTRIBUTE EXTRACTION
// Uses Gemini vision to extract detailed garment features
// ============================================================
async function extractDetailedAttributes(
  imageUrl: string, 
  cropData: any, 
  apiKey: string
): Promise<ExtractedAttributes> {
  const cropInstruction = cropData 
    ? `Focus ONLY on the cropped/highlighted area of this image.` 
    : `Identify the SINGLE MOST PROMINENT fashion item in this image.`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
Return ONLY valid JSON.`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this fashion item in detail.' },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Attribute extraction error:', errorText);
    throw new Error('Failed to extract attributes');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || content.match(/(\{[\s\S]*\})/);
    return JSON.parse(jsonMatch ? jsonMatch[1] : content);
  } catch (e) {
    console.error('Failed to parse attributes, using defaults');
    return {
      category: 'clothing',
      colors: { primary: 'unknown', colorFamily: 'neutral' },
      material: { fabric: 'unknown' },
      pattern: { type: 'unknown' },
      construction: { silhouette: 'regular' },
      style: { aesthetic: 'casual' },
      distinctiveFeatures: [],
      searchQueries: { 
        primary: 'vintage clothing', 
        fallback: 'clothing',
        alternative: 'fashion',
        keywords: ['clothing']
      },
      textDescription: 'A clothing item',
      visualSignature: {
        dominantColors: [],
        patternDescription: '',
        shapeDescription: ''
      }
    };
  }
}

// ============================================================
// LOCAL CATALOG SEARCH
// Searches the catalog_items table with text matching
// ============================================================
async function searchLocalCatalog(
  supabase: any,
  queries: string[],
  attributes: ExtractedAttributes,
  budget?: { min?: number; max?: number }
): Promise<any[]> {
  try {
    // Build a text search query from all search terms
    const allKeywords = new Set<string>();
    
    // Add words from all queries
    queries.forEach(q => {
      q.toLowerCase().split(/\s+/).forEach(word => {
        if (word.length > 2) allKeywords.add(word);
      });
    });
    
    // Add color and category
    if (attributes.colors?.primary) {
      allKeywords.add(attributes.colors.primary.toLowerCase());
    }
    if (attributes.category) {
      attributes.category.toLowerCase().split(/\s+/).forEach(w => allKeywords.add(w));
    }
    
    console.log('Searching catalog with keywords:', Array.from(allKeywords).slice(0, 10));
    
    // Query catalog_items with text search
    let query = supabase
      .from('catalog_items')
      .select('*')
      .eq('is_active', true);
    
    // Apply budget filters
    if (budget?.min) {
      query = query.gte('price', budget.min);
    }
    if (budget?.max) {
      query = query.lte('price', budget.max);
    }
    
    const { data: items, error } = await query.limit(50);
    
    if (error) {
      console.error('Catalog query error:', error);
      return [];
    }
    
    console.log(`Retrieved ${items?.length || 0} items from catalog`);
    
    if (!items || items.length === 0) {
      return [];
    }
    
    // Score items by keyword match
    const scoredItems = items.map((item: any) => {
      const searchText = `${item.title || ''} ${item.description || ''}`.toLowerCase();
      let matchCount = 0;
      
      allKeywords.forEach(keyword => {
        if (searchText.includes(keyword)) {
          matchCount++;
        }
      });
      
      return {
        ...item,
        title: item.title,
        price: item.price || 0,
        currency: item.currency || 'EUR',
        item_url: item.item_url,
        image_url: item.image_url,
        shopName: item.platform,
        _matchScore: matchCount / Math.max(allKeywords.size, 1)
      };
    });
    
    // Sort by match score and return top items
    return scoredItems
      .filter((item: any) => item._matchScore > 0 || items.length <= 10)
      .sort((a: any, b: any) => b._matchScore - a._matchScore)
      .slice(0, 20);
    
  } catch (error) {
    console.error('Local catalog search error:', error);
    return [];
  }
}

// ============================================================
// ADVANCED MATCH SCORING ALGORITHM
// Hybrid: Text similarity + Attribute matching + Quality signals
// ============================================================
function calculateAdvancedMatchScores(
  attributes: ExtractedAttributes, 
  item: any
): MatchScores {
  const titleLower = (item.title || '').toLowerCase();
  const titleWords = new Set(titleLower.split(/\s+/));
  
  // ---- ATTRIBUTE MATCHING (structured comparison) ----
  const breakdown = {
    categoryMatch: 0,
    colorMatch: 0,
    patternMatch: 0,
    materialMatch: 0,
    silhouetteMatch: 0,
    styleMatch: 0,
    featureMatch: 0
  };

  // Category match (20%)
  if (attributes.category) {
    const categoryTerms = attributes.category.toLowerCase().split(/\s+/);
    const matches = categoryTerms.filter(t => titleLower.includes(t));
    breakdown.categoryMatch = matches.length / categoryTerms.length;
    
    // Subcategory bonus
    if (attributes.subcategory) {
      const subTerms = attributes.subcategory.toLowerCase().split(/\s+/);
      const subMatches = subTerms.filter(t => titleLower.includes(t));
      if (subMatches.length > 0) {
        breakdown.categoryMatch = Math.min(1, breakdown.categoryMatch + 0.3);
      }
    }
  }

  // Color match (15%)
  if (attributes.colors?.primary) {
    const colorTerms = attributes.colors.primary.toLowerCase().split(/\s+/);
    if (colorTerms.some(c => titleLower.includes(c))) {
      breakdown.colorMatch = 0.8;
    }
    // Secondary color bonus
    if (attributes.colors.secondary && 
        titleLower.includes(attributes.colors.secondary.toLowerCase())) {
      breakdown.colorMatch = Math.min(1, breakdown.colorMatch + 0.2);
    }
  }

  // Pattern match (12%)
  if (attributes.pattern?.type) {
    const patternTerms = attributes.pattern.type.toLowerCase().split(/\s+/);
    if (patternTerms.some(p => titleLower.includes(p))) {
      breakdown.patternMatch = 1.0;
    } else if (attributes.pattern.type.toLowerCase() === 'solid' && 
               !titleLower.match(/floral|stripe|plaid|print|pattern/)) {
      breakdown.patternMatch = 0.6; // Implicit solid match
    }
  }

  // Material match (12%)
  if (attributes.material?.fabric) {
    const materialTerms = attributes.material.fabric.toLowerCase().split(/\s+/);
    if (materialTerms.some(m => titleLower.includes(m))) {
      breakdown.materialMatch = 1.0;
    }
    // Texture bonus
    if (attributes.material.texture && 
        titleLower.includes(attributes.material.texture.toLowerCase())) {
      breakdown.materialMatch = Math.min(1, breakdown.materialMatch + 0.2);
    }
  }

  // Silhouette match (15%)
  if (attributes.construction?.silhouette) {
    const silTerms = attributes.construction.silhouette.toLowerCase().split(/\s+/);
    if (silTerms.some(s => titleLower.includes(s))) {
      breakdown.silhouetteMatch = 0.8;
    }
    // Length and other construction details
    if (attributes.construction.length && 
        titleLower.includes(attributes.construction.length.toLowerCase())) {
      breakdown.silhouetteMatch = Math.min(1, breakdown.silhouetteMatch + 0.2);
    }
  }

  // Style match (10%)
  if (attributes.style) {
    if (attributes.style.aesthetic && 
        titleLower.includes(attributes.style.aesthetic.toLowerCase())) {
      breakdown.styleMatch = 0.7;
    }
    if (attributes.style.era && 
        titleLower.includes(attributes.style.era.toLowerCase())) {
      breakdown.styleMatch = Math.min(1, breakdown.styleMatch + 0.3);
    }
    if (attributes.style.culturalOrigin && 
        titleLower.includes(attributes.style.culturalOrigin.toLowerCase())) {
      breakdown.styleMatch = Math.min(1, breakdown.styleMatch + 0.4);
    }
  }

  // Distinctive features match (16%)
  if (attributes.distinctiveFeatures?.length > 0) {
    const featureMatches = attributes.distinctiveFeatures.filter(f => 
      titleLower.includes(f.toLowerCase())
    );
    breakdown.featureMatch = Math.min(1, featureMatches.length / Math.max(2, attributes.distinctiveFeatures.length));
  }

  // Calculate weighted attribute score
  const attributeMatch = 
    (breakdown.categoryMatch * ATTRIBUTE_WEIGHTS.category) +
    (breakdown.colorMatch * ATTRIBUTE_WEIGHTS.color) +
    (breakdown.patternMatch * ATTRIBUTE_WEIGHTS.pattern) +
    (breakdown.materialMatch * ATTRIBUTE_WEIGHTS.material) +
    (breakdown.silhouetteMatch * ATTRIBUTE_WEIGHTS.silhouette) +
    (breakdown.styleMatch * ATTRIBUTE_WEIGHTS.style) +
    (breakdown.featureMatch * ATTRIBUTE_WEIGHTS.distinctiveFeatures);

  // ---- VISUAL SIMILARITY ESTIMATION ----
  // Without CLIP embeddings, estimate from visual description matching
  let visualSimilarity = 0.4; // Base score
  
  // Boost from visual signature matches
  if (attributes.visualSignature) {
    const colorMatches = attributes.visualSignature.dominantColors?.filter(c => 
      titleLower.includes(c.toLowerCase())
    ).length || 0;
    visualSimilarity += colorMatches * 0.15;
    
    // Pattern description similarity
    if (attributes.visualSignature.patternDescription) {
      const patternWords = attributes.visualSignature.patternDescription.toLowerCase().split(/\s+/);
      const patternMatches = patternWords.filter(w => w.length > 3 && titleLower.includes(w)).length;
      visualSimilarity += Math.min(0.2, patternMatches * 0.05);
    }
  }
  
  // Primary search query match (strong signal)
  if (item._searchQuery === attributes.searchQueries?.primary) {
    visualSimilarity += 0.15;
  }
  
  visualSimilarity = Math.min(1, visualSimilarity);

  // ---- TEXT SIMILARITY ----
  let textSimilarity = 0;
  if (attributes.textDescription) {
    const descWords = attributes.textDescription.toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3);
    
    const wordMatches = descWords.filter(w => titleWords.has(w) || titleLower.includes(w));
    textSimilarity = Math.min(1, wordMatches.length / Math.max(5, descWords.length));
  }

  // Keyword matching bonus
  if (attributes.searchQueries?.keywords) {
    const keywordMatches = attributes.searchQueries.keywords.filter(k => 
      titleLower.includes(k.toLowerCase())
    ).length;
    textSimilarity = Math.min(1, textSimilarity + keywordMatches * 0.1);
  }

  // ---- QUALITY SCORE ----
  let qualityScore = 0.5;
  if (item.freeShipping) qualityScore += 0.15;
  if (item.shopName) qualityScore += 0.1;
  if (item.image_url?.includes('il_')) qualityScore += 0.15; // High-res indicator
  if (item.originalPrice && item.originalPrice > item.price) qualityScore += 0.1; // On sale
  qualityScore = Math.min(1, qualityScore);

  return {
    visualSimilarity,
    textSimilarity,
    attributeMatch,
    qualityScore,
    breakdown
  };
}

// ============================================================
// MATCH EXPLANATION GENERATOR
// ============================================================
function generateMatchExplanation(
  attributes: ExtractedAttributes, 
  item: any, 
  scores: MatchScores
): string {
  const matches: string[] = [];
  const titleLower = (item.title || '').toLowerCase();

  // Collect matched attributes
  if (scores.breakdown.categoryMatch > 0.5) {
    matches.push(attributes.category);
  }
  if (scores.breakdown.colorMatch > 0.5 && attributes.colors?.primary) {
    matches.push(attributes.colors.primary);
  }
  if (scores.breakdown.materialMatch > 0.5 && attributes.material?.fabric) {
    matches.push(attributes.material.fabric);
  }
  if (scores.breakdown.patternMatch > 0.5 && attributes.pattern?.type !== 'solid') {
    matches.push(attributes.pattern.type);
  }
  if (scores.breakdown.silhouetteMatch > 0.5 && attributes.construction?.silhouette) {
    matches.push(attributes.construction.silhouette + ' fit');
  }
  if (scores.breakdown.styleMatch > 0.5) {
    if (attributes.style?.aesthetic) matches.push(attributes.style.aesthetic);
    if (attributes.style?.era) matches.push(attributes.style.era);
  }

  // Add matched distinctive features
  if (attributes.distinctiveFeatures) {
    attributes.distinctiveFeatures.forEach(f => {
      if (titleLower.includes(f.toLowerCase())) {
        matches.push(f);
      }
    });
  }

  if (matches.length === 0) {
    const avgScore = (scores.visualSimilarity + scores.textSimilarity + scores.attributeMatch) / 3;
    if (avgScore > 0.5) return 'Similar style match';
    return 'Related item';
  }

  // Dedupe and limit
  const uniqueMatches = [...new Set(matches)].slice(0, 5);
  return 'Matches: ' + uniqueMatches.join(', ');
}

// ============================================================
// EXTRACT MATCHED FEATURES FOR STORAGE
// ============================================================
function extractMatchedFeatures(attributes: ExtractedAttributes, item: ScoredItem): string[] {
  const features: string[] = [];
  const titleLower = (item.title || '').toLowerCase();

  if (attributes.category && titleLower.includes(attributes.category.toLowerCase())) {
    features.push(`category:${attributes.category}`);
  }
  if (attributes.colors?.primary && titleLower.includes(attributes.colors.primary.toLowerCase())) {
    features.push(`color:${attributes.colors.primary}`);
  }
  if (attributes.material?.fabric && titleLower.includes(attributes.material.fabric.toLowerCase())) {
    features.push(`material:${attributes.material.fabric}`);
  }
  if (attributes.construction?.silhouette && titleLower.includes(attributes.construction.silhouette.toLowerCase())) {
    features.push(`silhouette:${attributes.construction.silhouette}`);
  }

  return features;
}
