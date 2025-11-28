-- Add catalog items for oversized/distressed jeans
INSERT INTO catalog_items (
  external_id, platform, title, description, price, currency, size, condition,
  item_url, image_url, attributes
) VALUES 
(
  'demo-oversized-jeans-1',
  'vinted',
  'Oversized Distressed Light Blue Jeans with Fold Detail',
  'Relaxed oversized fit jeans in light wash denim with authentic distressing and unique fold details at the hem. Perfect for a casual streetwear look.',
  45.00,
  'EUR',
  '32/34',
  'Good',
  'https://www.vinted.com/items/demo-oversized-jeans-1',
  'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400',
  '{"itemType": "jeans", "category": "oversized jeans", "fabricType": "denim", "primaryColors": ["light blue"], "silhouette": "oversized", "length": "full-length", "aesthetic": "streetwear", "notableDetails": ["oversized fit", "fold detail at hem", "distressed", "relaxed"], "era": "modern"}'::jsonb
),
(
  'demo-wide-leg-jeans-1',
  'depop',
  'Wide Leg Light Wash Jeans - Oversized',
  'Super comfortable wide leg jeans in a beautiful light blue wash. Oversized fit with ripped knee details.',
  52.00,
  'EUR',
  '30/32',
  'Excellent',
  'https://www.depop.com/products/demo-wide-leg-jeans-1',
  'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400',
  '{"itemType": "jeans", "category": "wide leg jeans", "fabricType": "denim", "primaryColors": ["light blue"], "silhouette": "wide leg", "length": "full-length", "aesthetic": "casual", "notableDetails": ["oversized", "wide leg", "ripped knee", "light wash"], "era": "modern"}'::jsonb
),
(
  'demo-baggy-jeans-1',
  'tise',
  'Baggy Light Blue Denim with Distressed Details',
  'Y2K inspired baggy jeans in light blue denim. Features distressing throughout and a relaxed oversized fit.',
  39.00,
  'EUR',
  '31/32',
  'Good',
  'https://www.tise.com/items/demo-baggy-jeans-1',
  'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=400',
  '{"itemType": "jeans", "category": "baggy jeans", "fabricType": "denim", "primaryColors": ["light blue"], "silhouette": "baggy", "length": "full-length", "aesthetic": "Y2K", "notableDetails": ["baggy fit", "oversized", "distressed", "light wash"], "era": "Y2K"}'::jsonb
),
(
  'demo-straight-distressed-jeans-1',
  'vinted',
  'Straight Leg Jeans with Heavy Distressing',
  'Classic straight leg jeans in light blue with heavy distressing at knees and thighs. True to size fit.',
  41.00,
  'EUR',
  '30/32',
  'Good',
  'https://www.vinted.com/items/demo-straight-distressed-jeans-1',
  'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400',
  '{"itemType": "jeans", "category": "distressed jeans", "fabricType": "denim", "primaryColors": ["light blue"], "silhouette": "straight", "length": "full-length", "aesthetic": "casual", "notableDetails": ["distressed knees", "ripped details", "straight fit", "light wash"], "era": "modern"}'::jsonb
),
(
  'demo-boyfriend-jeans-1',
  'depop',
  'Vintage Boyfriend Jeans - Light Wash',
  'Relaxed boyfriend fit jeans with a vintage light wash. Slightly oversized with a comfortable mid-rise.',
  47.00,
  'EUR',
  '29/31',
  'Excellent',
  'https://www.depop.com/products/demo-boyfriend-jeans-1',
  'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400',
  '{"itemType": "jeans", "category": "boyfriend jeans", "fabricType": "denim", "primaryColors": ["light blue"], "silhouette": "relaxed", "length": "full-length", "aesthetic": "vintage", "notableDetails": ["boyfriend fit", "relaxed", "light wash", "mid-rise"], "era": "vintage"}'::jsonb
)