import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserImage {
  id: string;
  file_name: string;
  file_path: string;
  caption: string;
  aspect_ratio: number;
  created_at: string;
}

export const useUserImages = () => {
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, caption: string = '', aspectRatio: number) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.user.id}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { data, error: dbError } = await supabase
        .from('user_images')
        .insert({
          user_id: user.user.id,
          file_name: file.name,
          file_path: filePath,
          caption,
          aspect_ratio: aspectRatio
        })
        .select()
        .maybeSingle();

      if (dbError) throw dbError;

      // Refresh images list
      await fetchImages();
      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const updateCaption = async (imageId: string, caption: string) => {
    try {
      const { error } = await supabase
        .from('user_images')
        .update({ caption })
        .eq('id', imageId);

      if (error) throw error;
      
      // Update local state
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, caption } : img
      ));
    } catch (error) {
      console.error('Error updating caption:', error);
      throw error;
    }
  };

  const deleteImage = async (imageId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user-images')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      // Update local state
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  const getImageUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('user-images')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    loading,
    uploadImage,
    updateCaption,
    deleteImage,
    getImageUrl,
    refetchImages: fetchImages
  };
};