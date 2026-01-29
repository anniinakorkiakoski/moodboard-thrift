-- ============================================================
-- FIX: listing_analysis - Only accessible by edge functions (service role)
-- This table contains proprietary AI analysis data
-- ============================================================

-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view listing analysis" ON public.listing_analysis;

-- Create restrictive policy: no direct access (edge functions use service role)
CREATE POLICY "No direct client access to listing analysis"
ON public.listing_analysis FOR SELECT
USING (false);

-- ============================================================
-- FIX: catalog_items - Restrict to authenticated users only
-- This protects pricing, external_ids, and sourcing strategies
-- ============================================================

-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view active catalog items" ON public.catalog_items;

-- Create policy: only authenticated users can view active catalog items
CREATE POLICY "Authenticated users can view active catalog items"
ON public.catalog_items FOR SELECT
TO authenticated
USING (is_active = true);