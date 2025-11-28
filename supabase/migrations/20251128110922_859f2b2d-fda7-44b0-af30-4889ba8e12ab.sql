-- Add catalog items for linen blend khaki/beige wide-leg pants
INSERT INTO catalog_items (
  external_id, platform, title, description, price, currency, size, condition,
  item_url, image_url, attributes
) VALUES 
(
  'demo-linen-wide-leg-1',
  'vinted',
  'Linen Blend Wide Leg Trousers - Khaki Beige',
  'Breathable linen blend wide-leg pants in a beautiful khaki beige tone. Perfect for a relaxed, minimalist aesthetic with a bohemian touch.',
  56.00,
  'EUR',
  'M',
  'Excellent',
  'https://www.vinted.com/items/demo-linen-wide-leg-1',
  'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
  '{"itemType": "pants", "category": "wide leg pants", "fabricType": "linen blend", "primaryColors": ["khaki", "beige"], "silhouette": "wide leg", "length": "full-length", "aesthetic": ["casual", "minimalist", "bohemian"], "notableDetails": ["wide leg", "linen blend", "flowy", "relaxed fit"], "era": "modern"}'::jsonb
),
(
  'demo-beige-palazzo-1',
  'depop',
  'Beige Linen Palazzo Pants - Wide Leg',
  'Elegant palazzo-style wide leg pants in soft beige linen blend fabric. Minimalist design with a flowy bohemian silhouette.',
  62.00,
  'EUR',
  'L',
  'Good',
  'https://www.depop.com/products/demo-beige-palazzo-1',
  'https://images.unsplash.com/photo-1624623278313-a930126a11c3?w=400',
  '{"itemType": "pants", "category": "palazzo pants", "fabricType": "linen blend", "primaryColors": ["beige"], "silhouette": "wide leg", "length": "full-length", "aesthetic": ["minimalist", "bohemian", "elegant"], "notableDetails": ["palazzo style", "flowy", "wide leg", "linen"], "era": "modern"}'::jsonb
),
(
  'demo-khaki-linen-pants-1',
  'tise',
  'Casual Khaki Linen Wide Leg Pants',
  'Comfortable khaki wide-leg pants in breathable linen blend. Perfect for casual summer days with a minimalist bohemian vibe.',
  48.00,
  'EUR',
  'S',
  'Excellent',
  'https://www.tise.com/items/demo-khaki-linen-pants-1',
  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400',
  '{"itemType": "pants", "category": "wide leg pants", "fabricType": "linen blend", "primaryColors": ["khaki"], "silhouette": "wide leg", "length": "full-length", "aesthetic": ["casual", "bohemian", "minimalist"], "notableDetails": ["linen blend", "breathable", "wide leg", "relaxed"], "era": "modern"}'::jsonb
),
(
  'demo-natural-linen-wide-1',
  'vinted',
  'Natural Beige Linen Trousers - Wide Cut',
  'Natural tone linen blend trousers with a beautiful wide-leg cut. Minimalist design with bohemian flow and casual elegance.',
  54.00,
  'EUR',
  'M',
  'Good',
  'https://www.vinted.com/items/demo-natural-linen-wide-1',
  'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=400',
  '{"itemType": "pants", "category": "wide leg pants", "fabricType": "linen blend", "primaryColors": ["beige", "natural"], "silhouette": "wide leg", "length": "full-length", "aesthetic": ["minimalist", "bohemian", "casual"], "notableDetails": ["linen blend", "natural tone", "wide cut", "flowy"], "era": "modern"}'::jsonb
),
(
  'demo-sand-wide-leg-1',
  'depop',
  'Sand Beige Wide Leg Linen Pants',
  'Soft sand beige wide-leg pants in linen blend fabric. Clean minimalist lines with a relaxed bohemian fit.',
  59.00,
  'EUR',
  'L',
  'Excellent',
  'https://www.depop.com/products/demo-sand-wide-leg-1',
  'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=400',
  '{"itemType": "pants", "category": "wide leg pants", "fabricType": "linen blend", "primaryColors": ["beige", "sand"], "silhouette": "wide leg", "length": "full-length", "aesthetic": ["minimalist", "casual", "bohemian"], "notableDetails": ["sand tone", "linen blend", "wide leg", "clean lines"], "era": "modern"}'::jsonb
),
(
  'demo-taupe-linen-1',
  'tise',
  'Taupe Linen Blend Wide Leg Trousers',
  'Sophisticated taupe wide-leg trousers in soft linen blend. Minimalist bohemian style perfect for elevated casual wear.',
  51.00,
  'EUR',
  'M',
  'Good',
  'https://www.tise.com/items/demo-taupe-linen-1',
  'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400',
  '{"itemType": "pants", "category": "wide leg pants", "fabricType": "linen blend", "primaryColors": ["taupe", "beige"], "silhouette": "wide leg", "length": "full-length", "aesthetic": ["minimalist", "bohemian", "sophisticated"], "notableDetails": ["taupe color", "linen blend", "wide leg", "elevated casual"], "era": "modern"}'::jsonb
)