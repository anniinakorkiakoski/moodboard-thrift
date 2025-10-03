-- Add customer capacity management to thrifters table (only if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'thrifters' AND column_name = 'max_active_customers'
  ) THEN
    ALTER TABLE public.thrifters ADD COLUMN max_active_customers INTEGER DEFAULT 5;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'thrifters' AND column_name = 'current_active_customers'
  ) THEN
    ALTER TABLE public.thrifters ADD COLUMN current_active_customers INTEGER DEFAULT 0;
  END IF;
END $$;

-- Update connections table status to include waitlist
ALTER TABLE public.connections
DROP CONSTRAINT IF EXISTS connections_status_check;

ALTER TABLE public.connections
ADD CONSTRAINT connections_status_check 
CHECK (status IN ('pending', 'waitlist', 'active', 'accepted', 'rejected', 'completed'));

-- Add priority and notes fields for waitlist (only if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'connections' AND column_name = 'priority'
  ) THEN
    ALTER TABLE public.connections ADD COLUMN priority INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'connections' AND column_name = 'waitlist_notes'
  ) THEN
    ALTER TABLE public.connections ADD COLUMN waitlist_notes TEXT;
  END IF;
END $$;

-- Create index for efficient waitlist queries
DROP INDEX IF EXISTS idx_connections_waitlist;
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

DROP TRIGGER IF EXISTS trigger_update_active_count ON public.connections;
CREATE TRIGGER trigger_update_active_count
AFTER INSERT OR UPDATE OR DELETE ON public.connections
FOR EACH ROW
EXECUTE FUNCTION public.update_thrifter_active_count();