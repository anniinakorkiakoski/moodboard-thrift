-- Create user_measurements table
CREATE TABLE public.user_measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Upper body measurements (in cm)
  neck_circumference NUMERIC(5,2),
  shoulder_width NUMERIC(5,2),
  chest_circumference NUMERIC(5,2),
  waist_circumference NUMERIC(5,2),
  hip_circumference NUMERIC(5,2),
  
  -- Arm measurements (in cm)
  arm_length NUMERIC(5,2),
  bicep_circumference NUMERIC(5,2),
  
  -- Torso measurements (in cm)
  torso_length NUMERIC(5,2),
  
  -- Leg measurements (in cm)
  inseam_length NUMERIC(5,2),
  thigh_circumference NUMERIC(5,2),
  
  -- Metadata
  unit_preference TEXT DEFAULT 'cm' CHECK (unit_preference IN ('cm', 'in')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one measurement record per user
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_measurements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own measurements"
  ON public.user_measurements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own measurements"
  ON public.user_measurements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own measurements"
  ON public.user_measurements
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_measurements_updated_at
  BEFORE UPDATE ON public.user_measurements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();