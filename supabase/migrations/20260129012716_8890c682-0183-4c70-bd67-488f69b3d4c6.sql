-- Create a public view for thrifters that hides sensitive business data
CREATE VIEW public.thrifters_public
WITH (security_invoker=on) AS
  SELECT 
    id,
    display_name,
    bio,
    avatar_url,
    rating,
    specialties,
    pricing_info,
    is_verified,
    created_at,
    -- Expose availability as a boolean, not exact counts
    CASE 
      WHEN current_active_customers < max_active_customers THEN true
      ELSE false
    END AS has_availability
  FROM public.thrifters;

-- Comment explaining the view
COMMENT ON VIEW public.thrifters_public IS 'Public view of thrifters that hides sensitive business metrics (user_id, exact customer counts, total_orders)';

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view thrifter profiles" ON public.thrifters;

-- Create restrictive policy: only thrifter can see their own full record, or authenticated users querying via the view
CREATE POLICY "Thrifters can view their own full profile"
ON public.thrifters FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for the view to work (security_invoker means RLS applies to the querying user)
-- The view will only return data the user can access, but we need service role for public browsing
-- Actually, we need to allow the view to read data - let's use a function approach instead

-- Alternative: Allow authenticated users to see thrifters via view, but hide sensitive fields in the view itself
DROP POLICY IF EXISTS "Thrifters can view their own full profile" ON public.thrifters;

-- Create a security definer function to get public thrifter data
CREATE OR REPLACE FUNCTION public.get_public_thrifters()
RETURNS TABLE (
  id uuid,
  display_name text,
  bio text,
  avatar_url text,
  rating numeric,
  specialties text[],
  pricing_info text,
  is_verified boolean,
  created_at timestamptz,
  has_availability boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    t.id,
    t.display_name,
    t.bio,
    t.avatar_url,
    t.rating,
    t.specialties,
    t.pricing_info,
    t.is_verified,
    t.created_at,
    (t.current_active_customers < t.max_active_customers) AS has_availability
  FROM public.thrifters t
  WHERE t.is_verified = true
$$;

-- Create a function for individual thrifter lookup
CREATE OR REPLACE FUNCTION public.get_thrifter_public(thrifter_id uuid)
RETURNS TABLE (
  id uuid,
  display_name text,
  bio text,
  avatar_url text,
  rating numeric,
  specialties text[],
  pricing_info text,
  is_verified boolean,
  created_at timestamptz,
  has_availability boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    t.id,
    t.display_name,
    t.bio,
    t.avatar_url,
    t.rating,
    t.specialties,
    t.pricing_info,
    t.is_verified,
    t.created_at,
    (t.current_active_customers < t.max_active_customers) AS has_availability
  FROM public.thrifters t
  WHERE t.id = thrifter_id
$$;

-- Now create restrictive RLS policies
-- Thrifters can see their own full profile (for dashboard purposes)
CREATE POLICY "Thrifters can view own full profile"
ON public.thrifters FOR SELECT
USING (auth.uid() = user_id);

-- Keep existing insert/update policies (they're already properly scoped)