import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StyleProfile {
  style_tags: string[];
  dream_brands: string[];
}

export const useStyleProfile = () => {
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [loading, setLoading] = useState(true);
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
        .select('style_tags, dream_brands')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      setProfile(data || { style_tags: [], dream_brands: [] });
    } catch (error) {
      console.error('Error fetching style profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<StyleProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: existing } = await supabase
        .from('user_style_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('user_style_profiles')
          .update(updates)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_style_profiles')
          .insert({
            user_id: user.id,
            ...updates
          });

        if (error) throw error;
      }

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
    }
  };

  return { profile, loading, updateProfile };
};
