-- Add material_preferences column to user_style_profiles table
ALTER TABLE user_style_profiles 
ADD COLUMN material_preferences text[] DEFAULT '{}';

COMMENT ON COLUMN user_style_profiles.material_preferences IS 'User preferred materials for clothing (e.g., cotton, silk, wool)';
