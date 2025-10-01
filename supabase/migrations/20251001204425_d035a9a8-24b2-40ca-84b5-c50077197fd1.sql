-- Enable pgvector extension for similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add enhanced fields to visual_searches table for detailed analysis
ALTER TABLE visual_searches 
ADD COLUMN IF NOT EXISTS crop_data jsonb,
ADD COLUMN IF NOT EXISTS attributes jsonb,
ADD COLUMN IF NOT EXISTS embedding vector(512);

-- Add attribute match details to search_results
ALTER TABLE search_results
ADD COLUMN IF NOT EXISTS matched_attributes jsonb,
ADD COLUMN IF NOT EXISTS match_explanation text;

-- Create catalog_items table for indexed marketplace items
CREATE TABLE IF NOT EXISTS catalog_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  external_id text NOT NULL,
  title text NOT NULL,
  description text,
  price numeric,
  currency text DEFAULT 'USD',
  image_url text,
  item_url text NOT NULL,
  size text,
  condition text,
  location text,
  shipping_info text,
  
  -- Extracted attributes
  attributes jsonb DEFAULT '{}'::jsonb,
  
  -- Visual embedding for similarity search
  embedding vector(512),
  
  -- Metadata
  indexed_at timestamp with time zone DEFAULT now(),
  last_verified_at timestamp with time zone,
  is_active boolean DEFAULT true,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  UNIQUE(platform, external_id)
);

-- Enable RLS on catalog_items
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view active catalog items
CREATE POLICY "Anyone can view active catalog items"
ON catalog_items FOR SELECT
USING (is_active = true);

-- Create index for fast similarity searches
CREATE INDEX IF NOT EXISTS idx_catalog_items_embedding ON catalog_items USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_catalog_items_platform ON catalog_items(platform) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_catalog_items_price ON catalog_items(price) WHERE is_active = true;

-- Add trigger for updated_at
CREATE TRIGGER update_catalog_items_updated_at
BEFORE UPDATE ON catalog_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create admin table for managing catalog ingestion
CREATE TABLE IF NOT EXISTS catalog_admin_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by uuid NOT NULL,
  platform text NOT NULL,
  items_count integer DEFAULT 0,
  status text DEFAULT 'pending',
  error_message text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE catalog_admin_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage uploads"
ON catalog_admin_uploads FOR ALL
USING (auth.uid() = uploaded_by);