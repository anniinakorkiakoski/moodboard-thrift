-- Create enum for search status
CREATE TYPE search_status AS ENUM ('pending', 'analyzing', 'searching', 'completed', 'no_matches');

-- Create enum for platform types
CREATE TYPE platform_type AS ENUM ('vinted', 'tise', 'etsy', 'emmy', 'facebook_marketplace', 'depop', 'other_vintage');

-- Table for visual search requests
CREATE TABLE public.visual_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  status search_status NOT NULL DEFAULT 'pending',
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for search results
CREATE TABLE public.search_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id UUID NOT NULL REFERENCES public.visual_searches(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  item_url TEXT NOT NULL,
  title TEXT NOT NULL,
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  image_url TEXT,
  similarity_score DECIMAL(3, 2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for professional thrifters (marketplace)
CREATE TABLE public.thrifters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  rating DECIMAL(3, 2) DEFAULT 5.0,
  total_orders INTEGER DEFAULT 0,
  specialties TEXT[],
  pricing_info TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for thrift service requests
CREATE TABLE public.thrift_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id UUID NOT NULL REFERENCES public.visual_searches(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thrifter_id UUID REFERENCES public.thrifters(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  budget DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visual_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thrifters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thrift_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for visual_searches
CREATE POLICY "Users can view their own searches"
  ON public.visual_searches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own searches"
  ON public.visual_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own searches"
  ON public.visual_searches FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for search_results
CREATE POLICY "Users can view results for their searches"
  ON public.search_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.visual_searches
      WHERE visual_searches.id = search_results.search_id
      AND visual_searches.user_id = auth.uid()
    )
  );

-- RLS Policies for thrifters (public profiles)
CREATE POLICY "Anyone can view thrifter profiles"
  ON public.thrifters FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own thrifter profile"
  ON public.thrifters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own thrifter profile"
  ON public.thrifters FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for thrift_requests
CREATE POLICY "Customers can view their own requests"
  ON public.thrift_requests FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Thrifters can view requests assigned to them"
  ON public.thrift_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.thrifters
      WHERE thrifters.id = thrift_requests.thrifter_id
      AND thrifters.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create requests"
  ON public.thrift_requests FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers and assigned thrifters can update requests"
  ON public.thrift_requests FOR UPDATE
  USING (
    auth.uid() = customer_id
    OR EXISTS (
      SELECT 1 FROM public.thrifters
      WHERE thrifters.id = thrift_requests.thrifter_id
      AND thrifters.user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_visual_searches_updated_at
  BEFORE UPDATE ON public.visual_searches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_thrifters_updated_at
  BEFORE UPDATE ON public.thrifters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_thrift_requests_updated_at
  BEFORE UPDATE ON public.thrift_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for better performance
CREATE INDEX idx_visual_searches_user_id ON public.visual_searches(user_id);
CREATE INDEX idx_visual_searches_status ON public.visual_searches(status);
CREATE INDEX idx_search_results_search_id ON public.search_results(search_id);
CREATE INDEX idx_thrift_requests_customer_id ON public.thrift_requests(customer_id);
CREATE INDEX idx_thrift_requests_thrifter_id ON public.thrift_requests(thrifter_id);