-- First, drop the foreign key constraint on thrifters table
DO $$ 
BEGIN
    -- Drop the constraint if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'thrifters_user_id_fkey' 
        AND table_name = 'thrifters'
    ) THEN
        ALTER TABLE public.thrifters DROP CONSTRAINT thrifters_user_id_fkey;
    END IF;
END $$;

-- Now insert the mock thrifters
INSERT INTO public.thrifters (id, user_id, display_name, bio, rating, total_orders, specialties, is_verified, avatar_url, pricing_info) VALUES
(gen_random_uuid(), gen_random_uuid(), 'Maya Chen', 'Vintage curator specializing in 90s minimalism and contemporary street style. Based in NYC with access to incredible thrift finds.', 4.9, 127, ARRAY['Vintage', 'Minimalist', 'Streetwear'], true, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 'Starting at $25 per curated piece'),
(gen_random_uuid(), gen_random_uuid(), 'Alex Rivers', 'Sustainable fashion advocate with 8+ years experience. I love mixing high-end vintage with everyday basics to create timeless looks.', 4.8, 89, ARRAY['Vintage', 'Sustainable', 'Classic'], true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', '$30-50 per item depending on sourcing'),
(gen_random_uuid(), gen_random_uuid(), 'Jordan Blake', 'Y2K and early 2000s specialist. If you want that perfect low-rise jean or baby tee, I got you. Also love cottagecore aesthetics!', 5.0, 156, ARRAY['Y2K', 'Cottagecore', 'Romantic'], true, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'Flat $35 curation fee + item cost'),
(gen_random_uuid(), gen_random_uuid(), 'Sam Morrison', 'West Coast thrifter focused on bohemian, eclectic, and festival-ready pieces. I source from the best vintage shops in California.', 4.7, 73, ARRAY['Bohemian', 'Eclectic', 'Festival'], true, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', '$20-40 per piece'),
(gen_random_uuid(), gen_random_uuid(), 'Riley Park', 'Korean street style enthusiast. Specializing in contemporary oversized silhouettes and monochromatic looks with unique textures.', 4.9, 134, ARRAY['Streetwear', 'Minimalist', 'Contemporary'], true, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', 'Starting at $30 per curated look'),
(gen_random_uuid(), gen_random_uuid(), 'Casey Taylor', 'Dark academia and preppy style expert. I curate timeless pieces perfect for creating that intellectual, polished aesthetic.', 4.8, 92, ARRAY['Dark Academia', 'Preppy', 'Classic'], true, 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400', '$25 flat fee + shipping'),
(gen_random_uuid(), gen_random_uuid(), 'Drew Martinez', 'Grunge and alt fashion specialist. Band tees, leather jackets, and everything that screams rebellion. Seattle-based.', 4.6, 68, ARRAY['Grunge', 'Alternative', 'Vintage'], true, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', '$28 per item sourcing fee'),
(gen_random_uuid(), gen_random_uuid(), 'Avery Kim', 'Soft girl aesthetic and romantic style curator. Pastels, florals, and dreamy vintage pieces are my specialty.', 5.0, 145, ARRAY['Romantic', 'Soft Girl', 'Vintage'], true, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', 'Starting at $22 per piece'),
(gen_random_uuid(), gen_random_uuid(), 'Morgan Lee', 'Luxury secondhand and designer resale expert. I find authenticated designer pieces at fraction of retail prices.', 4.9, 201, ARRAY['Luxury', 'Classic', 'Timeless'], true, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400', '10% commission on item value'),
(gen_random_uuid(), gen_random_uuid(), 'Sage Williams', 'Cottagecore and prairie style specialist. Think flowy dresses, vintage linens, and that countryside aesthetic.', 4.8, 112, ARRAY['Cottagecore', 'Prairie', 'Romantic'], true, 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400', '$25-35 per curated piece');