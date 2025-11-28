import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StyleProfile {
  style_tags: string[];
  dream_brands: string[];
  material_preferences: string[];
}

export const useStyleProfile = () => {
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_style_profiles')
        .select('style_tags, dream_brands, material_preferences')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      setProfile(data || { style_tags: [], dream_brands: [], material_preferences: [] });
    } catch (error) {
      console.error('Error fetching style profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<StyleProfile>) => {
    if (saving) return; // Prevent multiple simultaneous saves
    
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Use upsert for atomic operation
      const { error } = await supabase
        .from('user_style_profiles')
        .upsert(
          {
            user_id: user.id,
            ...updates
          },
          {
            onConflict: 'user_id'
          }
        );

      if (error) throw error;

      setProfile(prev => ({ ...prev!, ...updates }));
      toast({
        title: "Style profile updated",
        description: "Your preferences have been saved."
      });
    } catch (error) {
      console.error('Error updating style profile:', error);
      toast({
        title: "Error",
        description: "Failed to update your style profile.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, saving, updateProfile };
};
