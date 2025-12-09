import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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

// Curated fashion image collection from Unsplash (real fashion photography)
const FASHION_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=500&fit=crop', tags: ['blazer', 'classic'] },
  { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop', tags: ['dress', 'vintage'] },
  { url: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=450&fit=crop', tags: ['coat', 'wool'] },
  { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=550&fit=crop', tags: ['jacket', 'denim'] },
  { url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=600&fit=crop', tags: ['fashion', 'streetwear'] },
  { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=650&fit=crop', tags: ['model', 'trending'] },
  { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop', tags: ['dress', 'boho'] },
  { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop', tags: ['fashion', 'minimalist'] },
  { url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=480&fit=crop', tags: ['sweater', 'knit'] },
  { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=550&fit=crop', tags: ['casual', 'classic'] },
  { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop', tags: ['vintage', 'retro'] },
  { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop', tags: ['blouse', 'elegant'] },
  { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=650&fit=crop', tags: ['fashion', 'boutique'] },
  { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=550&fit=crop', tags: ['shopping', 'style'] },
  { url: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=600&fit=crop', tags: ['rack', 'vintage'] },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop', tags: ['jacket', 'leather'] },
  { url: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=400&h=580&fit=crop', tags: ['cardigan', 'cozy'] },
  { url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=520&fit=crop', tags: ['coat', 'winter'] },
  { url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=600&fit=crop', tags: ['dress', 'summer'] },
  { url: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=400&h=550&fit=crop', tags: ['fashion', 'editorial'] },
];

const ITEM_TITLES = [
  'Vintage Wool Blazer - Excellent Condition',
  'Silk Midi Dress - Like New',
  'Cashmere Cardigan - Soft & Cozy',
  'Leather Crossbody Bag - Classic Style',
  'Linen Summer Dress - Flowy Fit',
  'Denim Jacket - Distressed Vintage',
  'Pleated Maxi Skirt - Elegant',
  'Oversized Knit Sweater - Chunky',
  'Tailored Trousers - High Waist',
  'Cotton Blouse - Embroidered Detail',
  'Wool Coat - Timeless Design',
  'Suede Ankle Boots - Minimal Wear',
  'Silk Scarf - Designer Pattern',
  'Trench Coat - Classic Beige',
  'Bohemian Maxi Dress - Floral Print',
  'Leather Tote Bag - Spacious',
  'Knit Cardigan - Neutral Tone',
  'Vintage Band Tee - Rare Find',
  'Wide Leg Pants - Relaxed Fit',
  'Statement Earrings - Gold Tone',
];

const PLATFORMS = ['vinted', 'depop', 'etsy', 'vestiaire'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchTerms, styleTags, dreamBrands, materials } = await req.json();
    console.log('Fetching inspiration feed with terms:', searchTerms);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const items: InspirationItem[] = [];

    // First, try to get real items from catalog
    const { data: catalogItems, error: catalogError } = await supabase
      .from('catalog_items')
      .select('*')
      .eq('is_active', true)
      .not('image_url', 'is', null)
      .limit(30);

    if (!catalogError && catalogItems && catalogItems.length > 0) {
      console.log(`Found ${catalogItems.length} real catalog items`);
      
      catalogItems.forEach((item, index) => {
        items.push({
          id: item.id,
          title: item.title,
          price: item.price || Math.floor(Math.random() * 100) + 20,
          currency: item.currency || 'USD',
          image_url: item.image_url,
          item_url: item.item_url,
          platform: item.platform,
          tags: [item.platform, ...(searchTerms?.slice(0, 2) || [])],
          trending: index < 5,
        });
      });
    }

    // Fill with curated fashion imagery if not enough real items
    const needed = Math.max(0, 20 - items.length);
    if (needed > 0) {
      console.log(`Adding ${needed} curated fashion items`);
      
      const shuffledImages = [...FASHION_IMAGES].sort(() => Math.random() - 0.5);
      const shuffledTitles = [...ITEM_TITLES].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < needed && i < shuffledImages.length; i++) {
        const img = shuffledImages[i];
        const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
        
        items.push({
          id: `curated-${i}-${Date.now()}`,
          title: shuffledTitles[i % shuffledTitles.length],
          price: Math.floor(Math.random() * 120) + 25,
          currency: 'USD',
          image_url: img.url,
          item_url: '#demo',
          platform: platform,
          tags: [...img.tags, ...(searchTerms?.slice(0, 1) || [])],
          trending: i < 3,
        });
      }
    }

    // Shuffle final results for variety
    const shuffledItems = items.sort(() => Math.random() - 0.5);

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
