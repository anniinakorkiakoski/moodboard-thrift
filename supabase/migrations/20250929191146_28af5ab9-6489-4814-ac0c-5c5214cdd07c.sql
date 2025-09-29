-- Create user style profiles table
CREATE TABLE public.user_style_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  style_tags TEXT[] DEFAULT '{}',
  dream_brands TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_style_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own style profile
CREATE POLICY "Users can view their own style profile"
ON public.user_style_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own style profile
CREATE POLICY "Users can insert their own style profile"
ON public.user_style_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own style profile
CREATE POLICY "Users can update their own style profile"
ON public.user_style_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_user_style_profiles_updated_at
BEFORE UPDATE ON public.user_style_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();