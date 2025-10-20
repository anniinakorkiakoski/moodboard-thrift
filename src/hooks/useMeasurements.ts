import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Measurements {
  neck_circumference?: number;
  shoulder_width?: number;
  chest_circumference?: number;
  waist_circumference?: number;
  hip_circumference?: number;
  arm_length?: number;
  bicep_circumference?: number;
  torso_length?: number;
  inseam_length?: number;
  thigh_circumference?: number;
  unit_preference?: 'cm' | 'in';
}

export const useMeasurements = () => {
  const [measurements, setMeasurements] = useState<Measurements | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_measurements')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setMeasurements({
          neck_circumference: data.neck_circumference,
          shoulder_width: data.shoulder_width,
          chest_circumference: data.chest_circumference,
          waist_circumference: data.waist_circumference,
          hip_circumference: data.hip_circumference,
          arm_length: data.arm_length,
          bicep_circumference: data.bicep_circumference,
          torso_length: data.torso_length,
          inseam_length: data.inseam_length,
          thigh_circumference: data.thigh_circumference,
          unit_preference: (data.unit_preference as 'cm' | 'in') || 'cm'
        });
      }
    } catch (error) {
      console.error('Error fetching measurements:', error);
      toast.error('Failed to load measurements');
    } finally {
      setLoading(false);
    }
  };

  const updateMeasurements = async (updates: Partial<Measurements>) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_measurements')
        .upsert({
          user_id: user.id,
          ...measurements,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setMeasurements({ ...measurements, ...updates });
      toast.success('Measurements saved successfully');
    } catch (error) {
      console.error('Error updating measurements:', error);
      toast.error('Failed to save measurements');
    } finally {
      setSaving(false);
    }
  };

  return { measurements, loading, saving, updateMeasurements };
};