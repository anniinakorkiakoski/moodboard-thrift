-- Create connections table for thrifter-customer matches
CREATE TABLE public.connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  thrifter_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  initiated_by TEXT NOT NULL CHECK (initiated_by IN ('customer', 'thrifter')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(customer_id, thrifter_id)
);

-- Enable RLS
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Customers can view connections they're part of
CREATE POLICY "Customers can view their connections"
ON public.connections
FOR SELECT
USING (auth.uid() = customer_id);

-- Thrifters can view connections they're part of
CREATE POLICY "Thrifters can view their connections"
ON public.connections
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM thrifters
  WHERE thrifters.id = connections.thrifter_id
  AND thrifters.user_id = auth.uid()
));

-- Customers can create connections as customer
CREATE POLICY "Customers can create connections"
ON public.connections
FOR INSERT
WITH CHECK (auth.uid() = customer_id AND initiated_by = 'customer');

-- Thrifters can create connections as thrifter
CREATE POLICY "Thrifters can create connections"
ON public.connections
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM thrifters
    WHERE thrifters.id = connections.thrifter_id
    AND thrifters.user_id = auth.uid()
  ) AND initiated_by = 'thrifter'
);

-- Both parties can update connection status
CREATE POLICY "Parties can update their connections"
ON public.connections
FOR UPDATE
USING (
  auth.uid() = customer_id OR
  EXISTS (
    SELECT 1 FROM thrifters
    WHERE thrifters.id = connections.thrifter_id
    AND thrifters.user_id = auth.uid()
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_connections_updated_at
BEFORE UPDATE ON public.connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();