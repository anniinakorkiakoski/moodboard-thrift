-- Insert demo catalog items for making visual search demoable
-- Items designed to match common search attributes: hoodies, jeans, boots, jackets, etc.

INSERT INTO catalog_items (
  platform, external_id, item_url, title, price, currency, 
  image_url, description, size, condition, is_active, attributes
) VALUES
-- Black Hoodies (various styles to match searches)
('vinted', 'demo-hoodie-1', 'https://www.vinted.com/items/demo-hoodie-1', 
 'Black Cropped Wrap Hoodie - Athleisure Style', 45.00, 'EUR',
 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', 
 'Cropped black hoodie with unique wrap front detail, ribbed cuffs and hem, thumbholes. Modern athleisure aesthetic.',
 'M', 'Good', true,
 '{"itemType": "hoodie", "category": "cropped hoodie", "primaryColors": ["black"], "silhouette": "cropped", "length": "cropped", "fabricType": "cotton blend", "notableDetails": ["wrap front", "ribbed hem", "thumbholes"], "aesthetic": "athleisure"}'::jsonb),

('depop', 'demo-hoodie-2', 'https://www.depop.com/products/demo-hoodie-2',
 'Vintage Black Oversized Hoodie', 38.00, 'EUR',
 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
 'Classic oversized black hoodie with hood and kangaroo pocket. Cozy and comfortable.',
 'L', 'Excellent', true,
 '{"itemType": "hoodie", "category": "hoodie", "primaryColors": ["black"], "silhouette": "oversized", "fabricType": "cotton", "aesthetic": "casual"}'::jsonb),

('vinted', 'demo-hoodie-3', 'https://www.vinted.fi/items/demo-hoodie-3',
 'Black Fitted Hoodie with Drawstring', 32.00, 'EUR',
 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
 'Fitted black hoodie with adjustable drawstring and long sleeves.',
 'S', 'Good', true,
 '{"itemType": "hoodie", "category": "hoodie", "primaryColors": ["black"], "silhouette": "fitted", "sleeveType": "long", "fabricType": "cotton blend"}'::jsonb),

-- Jeans (light blue, distressed, various cuts)
('vinted', 'demo-jeans-1', 'https://www.vinted.com/items/demo-jeans-1',
 'Light Blue Distressed Straight Leg Jeans', 42.00, 'EUR',
 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
 'Classic straight leg jeans in light blue denim with distressed knees and authentic vintage wash.',
 '30/32', 'Good', true,
 '{"itemType": "jeans", "category": "straight jeans", "primaryColors": ["light blue"], "silhouette": "straight", "length": "full-length", "fabricType": "denim", "notableDetails": ["distressed knees", "ripped details"], "aesthetic": "casual"}'::jsonb),

('depop', 'demo-jeans-2', 'https://www.depop.com/products/demo-jeans-2',
 '90s Light Wash Relaxed Fit Jeans', 48.00, 'EUR',
 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400',
 '90s style relaxed fit jeans in light wash denim. Comfortable and vintage-inspired.',
 '31/32', 'Excellent', true,
 '{"itemType": "jeans", "category": "relaxed jeans", "primaryColors": ["light blue"], "silhouette": "relaxed", "fabricType": "denim", "era": "90s"}'::jsonb),

('tise', 'demo-jeans-3', 'https://www.tise.com/items/demo-jeans-3',
 'Vintage High-Waisted Mom Jeans - Light Blue', 38.00, 'EUR',
 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=400',
 'High-waisted mom jeans in light blue denim with tapered legs.',
 '29/30', 'Good', true,
 '{"itemType": "jeans", "category": "mom jeans", "primaryColors": ["light blue"], "silhouette": "high-waisted", "fabricType": "denim", "aesthetic": "vintage"}'::jsonb),

-- Black Leather Jackets
('vinted', 'demo-jacket-1', 'https://www.vinted.fi/items/demo-jacket-1',
 'Black Leather Biker Jacket with Zippers', 85.00, 'EUR',
 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
 'Classic black leather biker jacket with asymmetric zip closure and multiple pockets.',
 'M', 'Good', true,
 '{"itemType": "jacket", "category": "biker jacket", "primaryColors": ["black"], "fabricType": "leather", "closureType": "zip", "notableDetails": ["multiple zippers", "asymmetric"], "aesthetic": "edgy"}'::jsonb),

-- Boots and Shoes
('depop', 'demo-boots-1', 'https://www.depop.com/products/demo-boots-1',
 'Black Ankle Boots with Chunky Heel', 52.00, 'EUR',
 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400',
 'Black ankle boots with chunky heel and side zip. Perfect for everyday wear.',
 '38 EU', 'Good', true,
 '{"itemType": "boots", "category": "ankle boots", "primaryColors": ["black"], "fabricType": "synthetic leather", "length": "ankle", "silhouette": "chunky", "closureType": "zip"}'::jsonb),

('vinted', 'demo-boots-2', 'https://www.vinted.com/items/demo-boots-2',
 'Black Combat Boots - Platform Sole', 68.00, 'EUR',
 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=400',
 'Platform combat boots in black with lace-up closure and thick rubber sole.',
 '39 EU', 'Excellent', true,
 '{"itemType": "boots", "category": "combat boots", "primaryColors": ["black"], "closureType": "lace-up", "notableDetails": ["platform sole"], "silhouette": "chunky", "aesthetic": "punk"}'::jsonb),

-- Tops and Shirts
('tise', 'demo-top-1', 'https://www.tise.fi/items/demo-top-1',
 'Black Cropped Tank Top - Fitted', 15.00, 'EUR',
 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400',
 'Simple black cropped tank top with fitted silhouette.',
 'S', 'Excellent', true,
 '{"itemType": "top", "category": "tank top", "primaryColors": ["black"], "silhouette": "fitted", "length": "cropped", "sleeveType": "sleeveless"}'::jsonb),

('depop', 'demo-shirt-1', 'https://www.depop.com/products/demo-shirt-1',
 'Vintage Black Band T-Shirt - Oversized', 28.00, 'EUR',
 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
 'Oversized vintage-style black band t-shirt with graphic print.',
 'M', 'Good', true,
 '{"itemType": "top", "category": "t-shirt", "primaryColors": ["black"], "silhouette": "oversized", "sleeveType": "short", "aesthetic": "vintage"}'::jsonb),

-- Dresses
('vinted', 'demo-dress-1', 'https://www.vinted.fi/items/demo-dress-1',
 'Black Midi Slip Dress - Satin', 55.00, 'EUR',
 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
 'Elegant black midi slip dress in satin fabric with thin straps.',
 'M', 'Excellent', true,
 '{"itemType": "dress", "category": "slip dress", "primaryColors": ["black"], "fabricType": "satin", "length": "midi", "silhouette": "fitted", "aesthetic": "elegant"}'::jsonb),

-- Accessories
('depop', 'demo-bag-1', 'https://www.depop.com/products/demo-bag-1',
 'Black Leather Crossbody Bag', 42.00, 'EUR',
 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
 'Compact black leather crossbody bag with adjustable strap.',
 'One Size', 'Good', true,
 '{"itemType": "bag", "category": "crossbody bag", "primaryColors": ["black"], "fabricType": "leather", "aesthetic": "minimalist"}'::jsonb),

('vinted', 'demo-belt-1', 'https://www.vinted.com/items/demo-belt-1',
 'Black Studded Leather Belt', 25.00, 'EUR',
 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400',
 'Black leather belt with metal studs and buckle closure.',
 'S/M', 'Good', true,
 '{"itemType": "belt", "category": "belt", "primaryColors": ["black"], "fabricType": "leather", "notableDetails": ["studs"], "closureType": "buckle", "aesthetic": "edgy"}'::jsonb);

-- Log the insertion
DO $$
BEGIN
  RAISE NOTICE 'Inserted 15 demo catalog items for visual search testing';
END $$;