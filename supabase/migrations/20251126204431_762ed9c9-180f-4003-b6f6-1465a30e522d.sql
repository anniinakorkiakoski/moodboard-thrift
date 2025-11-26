-- Add display_order column to user_images table
ALTER TABLE public.user_images 
ADD COLUMN display_order INTEGER;

-- Set initial order based on created_at (oldest = highest number, newest = lowest)
UPDATE public.user_images 
SET display_order = (
  SELECT COUNT(*) 
  FROM public.user_images AS ui2 
  WHERE ui2.user_id = user_images.user_id 
  AND ui2.created_at <= user_images.created_at
);

-- Create index for efficient ordering queries
CREATE INDEX idx_user_images_display_order ON public.user_images(user_id, display_order);