-- Add customer capacity management to thrifters table
ALTER TABLE public.thrifters 
ADD COLUMN max_active_customers INTEGER DEFAULT 5,
ADD COLUMN current_active_customers INTEGER DEFAULT 0;

-- Update connections table status to include waitlist
ALTER TABLE public.connections
DROP CONSTRAINT IF EXISTS connections_status_check;

ALTER TABLE public.connections
ADD CONSTRAINT connections_status_check 
CHECK (status IN ('pending', 'waitlist', 'active', 'accepted', 'rejected', 'completed'));

-- Add priority field for waitlist ordering
ALTER TABLE public.connections
ADD COLUMN priority INTEGER DEFAULT 0,
ADD COLUMN waitlist_notes TEXT;

-- Create index for efficient waitlist queries
CREATE INDEX idx_connections_waitlist 
ON public.connections(thrifter_id, status, priority DESC, created_at);

-- Create function to get active customer count
CREATE OR REPLACE FUNCTION public.get_active_customer_count(thrifter_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.connections
  WHERE thrifter_id = thrifter_uuid
    AND status = 'active'
$$;

-- Create trigger to update active customer count
CREATE OR REPLACE FUNCTION public.update_thrifter_active_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.thrifters
    SET current_active_customers = public.get_active_customer_count(NEW.thrifter_id)
    WHERE id = NEW.thrifter_id;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE public.thrifters
    SET current_active_customers = public.get_active_customer_count(OLD.thrifter_id)
    WHERE id = OLD.thrifter_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trigger_update_active_count
AFTER INSERT OR UPDATE OR DELETE ON public.connections
FOR EACH ROW
EXECUTE FUNCTION public.update_thrifter_active_count();