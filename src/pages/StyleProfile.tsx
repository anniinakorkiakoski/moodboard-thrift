import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { StyleProfileSelector } from '@/components/StyleProfileSelector';
import { Navigation } from '@/components/Navigation';

export const StyleProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      } else {
        setUser(user);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 max-w-7xl pt-32">
        <StyleProfileSelector />
      </div>
    </div>
  );
};
