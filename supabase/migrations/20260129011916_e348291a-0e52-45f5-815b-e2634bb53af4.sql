-- Create listing_analysis table for caching AI analysis results across searches
CREATE TABLE public.listing_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  source_item_id TEXT NOT NULL,
  image_url TEXT,
  detected_color TEXT,
  garment_type TEXT,
  pattern TEXT,
  style TEXT,
  brand TEXT,
  size TEXT,
  image_embedding vector(1536),
  raw_analysis JSONB,
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  UNIQUE(source, source_item_id)
);

-- Enable RLS
ALTER TABLE public.listing_analysis ENABLE ROW LEVEL SECURITY;

-- Allow read access for everyone (cached analysis is shared across users)
CREATE POLICY "Anyone can view listing analysis"
ON public.listing_analysis
FOR SELECT
USING (true);

-- Create index for efficient lookups
CREATE INDEX idx_listing_analysis_source_item ON public.listing_analysis(source, source_item_id);
CREATE INDEX idx_listing_analysis_expires ON public.listing_analysis(expires_at);

-- Add tradera to platform_type enum
ALTER TYPE public.platform_type ADD VALUE IF NOT EXISTS 'tradera';