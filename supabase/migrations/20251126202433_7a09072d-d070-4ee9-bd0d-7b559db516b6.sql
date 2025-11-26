-- Add user_image_id to visual_searches to link searches to gallery images
ALTER TABLE visual_searches ADD COLUMN user_image_id uuid REFERENCES user_images(id) ON DELETE CASCADE;

-- Create saved_items table for the cart (favorited items to purchase)
CREATE TABLE saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  search_result_id uuid REFERENCES search_results(id) ON DELETE CASCADE,
  item_url text NOT NULL,
  title text NOT NULL,
  price numeric,
  currency text DEFAULT 'EUR',
  image_url text,
  platform text NOT NULL,
  created_at timestamptz DEFAULT now(),
  notes text
);

-- Enable RLS on saved_items
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for saved_items
CREATE POLICY "Users can view their own saved items"
  ON saved_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own saved items"
  ON saved_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved items"
  ON saved_items FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved items"
  ON saved_items FOR UPDATE
  USING (auth.uid() = user_id);