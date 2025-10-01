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
    const { items, action } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === 'add_samples') {
      // Add sample catalog items for testing
      const sampleItems = [
        {
          platform: 'vinted',
          external_id: 'v-001',
          title: 'Y2K Khaki Wide Leg Linen Trousers',
          description: 'Vintage low-rise wide-leg pants in khaki linen blend with button closure',
          price: 45.00,
          currency: 'USD',
          item_url: 'https://vinted.com/items/example-1',
          size: 'M',
          condition: 'excellent',
          image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
          attributes: {
            itemType: 'pants',
            category: 'wide-leg trousers',
            fabricType: 'linen blend',
            primaryColors: ['khaki green', 'beige'],
            pattern: 'solid',
            silhouette: 'wide-leg, low-rise',
            length: 'floor-length',
            era: 'Y2K',
            aesthetic: 'casual, minimalist, bohemian'
          }
        },
        {
          platform: 'depop',
          external_id: 'd-001',
          title: 'Beige Linen Wide Leg Pants Low Rise',
          description: 'Y2K style wide leg linen pants with button closure and ribbed waistband',
          price: 38.00,
          currency: 'USD',
          item_url: 'https://depop.com/items/example-1',
          size: 'L',
          condition: 'very good',
          image_url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400',
          attributes: {
            itemType: 'pants',
            category: 'wide-leg trousers',
            fabricType: 'linen',
            primaryColors: ['beige', 'sand'],
            pattern: 'solid',
            silhouette: 'wide-leg, low-rise',
            length: 'full-length',
            era: 'Y2K',
            aesthetic: 'minimalist, bohemian'
          }
        },
        {
          platform: 'etsy',
          external_id: 'e-001',
          title: 'Vintage Yellow Textured Crop Top',
          description: 'Fitted crop top with keyhole detail, short sleeves and mandarin collar',
          price: 32.00,
          currency: 'USD',
          item_url: 'https://etsy.com/listing/example-1',
          size: 'S',
          condition: 'excellent',
          image_url: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400',
          attributes: {
            itemType: 'top',
            category: 'short sleeve top',
            fabricType: 'cotton blend',
            fabricTexture: 'textured',
            primaryColors: ['pale yellow', 'butter yellow'],
            pattern: 'herringbone',
            silhouette: 'fitted',
            sleeveType: 'short',
            necklineCollar: 'mandarin collar',
            length: 'cropped',
            era: 'modern',
            aesthetic: 'chic, feminine'
          }
        },
        {
          platform: 'vinted',
          external_id: 'v-002',
          title: 'Cream Ribbed Knit Sheer Top',
          description: 'Long sleeve fitted top with sheer details, ribbed texture and boat neck',
          price: 28.00,
          currency: 'USD',
          item_url: 'https://vinted.com/items/example-2',
          size: 'M',
          condition: 'good',
          image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
          attributes: {
            itemType: 'top',
            category: 'long-sleeve top',
            fabricType: 'knit',
            fabricTexture: 'sheer and ribbed',
            primaryColors: ['cream', 'off-white'],
            pattern: 'solid',
            silhouette: 'fitted',
            sleeveType: 'long',
            necklineCollar: 'boat neck',
            length: 'hip-length',
            era: 'modern',
            aesthetic: 'minimalist'
          }
        },
        {
          platform: 'therealreal',
          external_id: 'trr-001',
          title: 'Silver Jersey Mini Dress 2000s',
          description: 'Glamorous fitted mini dress with deep V-neck, kaftan sleeves and gathered bust',
          price: 125.00,
          currency: 'USD',
          item_url: 'https://therealreal.com/products/example-1',
          size: 'S',
          condition: 'excellent',
          image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
          attributes: {
            itemType: 'dress',
            category: 'mini dress',
            fabricType: 'jersey',
            fabricTexture: 'smooth',
            primaryColors: ['light gray', 'silver'],
            pattern: 'solid',
            silhouette: 'fitted',
            sleeveType: 'kaftan',
            necklineCollar: 'deep V-neck',
            length: 'mini',
            era: 'early 2000s',
            aesthetic: 'glamorous, party'
          }
        },
        {
          platform: 'depop',
          external_id: 'd-002',
          title: 'Vintage Khaki Cargo Wide Leg Pants',
          description: 'Oversized cargo style wide-leg pants with Y2K aesthetic and utility pockets',
          price: 52.00,
          currency: 'USD',
          item_url: 'https://depop.com/items/example-2',
          size: 'L',
          condition: 'very good',
          image_url: 'https://images.unsplash.com/photo-1624378515195-6bbdb73dff1a?w=400',
          attributes: {
            itemType: 'pants',
            category: 'cargo pants',
            fabricType: 'cotton twill',
            primaryColors: ['khaki', 'olive'],
            pattern: 'solid',
            silhouette: 'wide-leg, low-rise',
            length: 'full-length',
            era: 'Y2K',
            aesthetic: 'streetwear, casual'
          }
        },
        {
          platform: 'vestiaire_collective',
          external_id: 'vc-001',
          title: 'Designer Wide Leg Linen Trousers',
          description: 'High-end linen blend wide leg pants in neutral beige tone',
          price: 195.00,
          currency: 'USD',
          item_url: 'https://vestiairecollective.com/items/example-1',
          size: 'M',
          condition: 'excellent',
          image_url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400',
          attributes: {
            itemType: 'pants',
            category: 'wide-leg trousers',
            fabricType: 'linen blend',
            primaryColors: ['beige', 'taupe'],
            pattern: 'solid',
            silhouette: 'wide-leg',
            length: 'full-length',
            era: 'contemporary',
            aesthetic: 'minimalist, elegant'
          }
        },
        {
          platform: 'tise',
          external_id: 't-001',
          title: 'Cropped Yellow Top with Button Detail',
          description: 'Textured crop top with mandarin collar, keyhole cutout and cap sleeves',
          price: 22.00,
          currency: 'USD',
          item_url: 'https://tise.com/items/example-1',
          size: 'S',
          condition: 'good',
          image_url: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=400',
          attributes: {
            itemType: 'top',
            category: 'short sleeve top',
            fabricType: 'cotton',
            fabricTexture: 'textured',
            primaryColors: ['pale yellow'],
            pattern: 'textured',
            silhouette: 'fitted',
            sleeveType: 'short',
            necklineCollar: 'mandarin collar',
            length: 'cropped',
            era: 'modern',
            aesthetic: 'chic, minimal'
          }
        },
        {
          platform: 'poshmark',
          external_id: 'p-001',
          title: 'Off-White Linen Wide Leg Trousers',
          description: 'Flowy wide-leg linen pants in cream/off-white, perfect for summer',
          price: 42.00,
          currency: 'USD',
          item_url: 'https://poshmark.com/listing/example-1',
          size: 'M',
          condition: 'excellent',
          image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
          attributes: {
            itemType: 'pants',
            category: 'wide-leg trousers',
            fabricType: 'linen',
            primaryColors: ['cream', 'off-white'],
            pattern: 'solid',
            silhouette: 'wide-leg',
            length: 'full-length',
            era: 'modern',
            aesthetic: 'bohemian, minimalist'
          }
        },
        {
          platform: 'grailed',
          external_id: 'g-001',
          title: 'Y2K Olive Green Cargo Pants',
          description: 'Authentic Y2K era cargo pants with multiple pockets and low-rise fit',
          price: 65.00,
          currency: 'USD',
          item_url: 'https://grailed.com/listings/example-1',
          size: 'L',
          condition: 'very good',
          image_url: 'https://images.unsplash.com/photo-1624378515195-6bbdb73dff1a?w=400',
          attributes: {
            itemType: 'pants',
            category: 'cargo pants',
            fabricType: 'cotton',
            primaryColors: ['olive green', 'khaki'],
            pattern: 'solid',
            silhouette: 'wide-leg, low-rise',
            length: 'full-length',
            era: 'Y2K',
            aesthetic: 'streetwear, urban'
          }
        }
      ];

      const { data, error } = await supabase
        .from('catalog_items')
        .upsert(sampleItems, { onConflict: 'platform,external_id' })
        .select();

      if (error) {
        console.error('Error inserting items:', error);
        throw error;
      }

      console.log(`Successfully added ${data.length} catalog items`);

      return new Response(JSON.stringify({ 
        success: true,
        itemsAdded: data.length,
        items: data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'add_custom' && items) {
      // Add custom items from admin UI
      const { data, error } = await supabase
        .from('catalog_items')
        .insert(items)
        .select();

      if (error) throw error;

      return new Response(JSON.stringify({ 
        success: true,
        itemsAdded: data.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in catalog-ingest:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
