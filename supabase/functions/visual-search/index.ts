import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, searchId } = await req.json();
    
    if (!imageUrl || !searchId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting visual search for:', searchId);

    // Update status to analyzing
    await supabase
      .from('visual_searches')
      .update({ status: 'analyzing' })
      .eq('id', searchId);

    // Step 1: Analyze the image with OpenAI Vision
    const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a fashion expert. Analyze clothing items in images and extract detailed information about style, type, color, pattern, material, and key features. Be extremely specific and detailed.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this clothing item in detail. Extract: 1) Item type (e.g., dress, jacket, pants), 2) Style (e.g., vintage, modern, bohemian), 3) Primary colors, 4) Patterns, 5) Material hints, 6) Notable features (buttons, collar, cut, etc.), 7) Era/aesthetic. Be as specific as possible.'
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        max_tokens: 500,
      }),
    });

    if (!visionResponse.ok) {
      console.error('OpenAI Vision API error:', await visionResponse.text());
      throw new Error('Failed to analyze image');
    }

    const visionData = await visionResponse.json();
    const analysisText = visionData.choices[0].message.content;
    
    console.log('Image analysis:', analysisText);

    // Store analysis data
    await supabase
      .from('visual_searches')
      .update({ 
        status: 'searching',
        analysis_data: { description: analysisText }
      })
      .eq('id', searchId);

    // Step 2: Search for similar items
    // For now, we'll simulate the search since real marketplace APIs require authentication
    // In production, this would call APIs for Vinted, Etsy, Depop, etc.
    
    const searchTerms = extractSearchTerms(analysisText);
    console.log('Search terms:', searchTerms);

    // Simulate search results with high similarity threshold
    // In production, replace this with real API calls
    const mockResults = generateMockResults(searchTerms, searchId);
    
    // Only proceed if we have high-quality matches (similarity > 0.75)
    const highQualityMatches = mockResults.filter(r => r.similarity_score >= 0.75);

    if (highQualityMatches.length === 0) {
      // No good matches found - set status to no_matches
      await supabase
        .from('visual_searches')
        .update({ status: 'no_matches' })
        .eq('id', searchId);

      return new Response(JSON.stringify({ 
        status: 'no_matches',
        message: 'No curated matches found. Consider requesting a personal thrift service.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Store high-quality results
    for (const result of highQualityMatches) {
      await supabase
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
        });
    }

    // Update status to completed
    await supabase
      .from('visual_searches')
      .update({ status: 'completed' })
      .eq('id', searchId);

    return new Response(JSON.stringify({ 
      status: 'completed',
      resultsCount: highQualityMatches.length
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

function extractSearchTerms(analysisText: string): string[] {
  // Extract key terms from the analysis
  const terms: string[] = [];
  const text = analysisText.toLowerCase();
  
  // Common clothing items
  const items = ['dress', 'jacket', 'coat', 'pants', 'skirt', 'top', 'blouse', 'sweater', 'cardigan', 'jeans'];
  items.forEach(item => {
    if (text.includes(item)) terms.push(item);
  });
  
  // Styles
  const styles = ['vintage', 'retro', 'bohemian', 'minimalist', 'grunge', 'preppy', 'romantic'];
  styles.forEach(style => {
    if (text.includes(style)) terms.push(style);
  });
  
  return terms;
}

function generateMockResults(searchTerms: string[], searchId: string) {
  // This is a placeholder. In production, replace with real API calls to:
  // - Vinted API
  // - Etsy API
  // - Depop API
  // - Facebook Marketplace API
  // - Tise API
  // etc.
  
  const platforms = ['vinted', 'etsy', 'depop', 'tise', 'facebook_marketplace'];
  const mockResults = [];
  
  // Generate 2-3 high-quality mock results
  for (let i = 0; i < 3; i++) {
    mockResults.push({
      platform: platforms[i % platforms.length] as any,
      item_url: `https://example.com/item-${i}`,
      title: `${searchTerms.join(' ')} - Item ${i + 1}`,
      price: 25.99 + (i * 10),
      currency: 'USD',
      image_url: null,
      similarity_score: 0.80 + (Math.random() * 0.15), // 0.80-0.95
      description: `Vintage ${searchTerms.join(' ')} in excellent condition`,
    });
  }
  
  return mockResults;
}