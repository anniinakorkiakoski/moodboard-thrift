import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { StyleProfileSelector } from '@/components/StyleProfileSelector';
import { MeasurementsSection } from '@/components/MeasurementsSection';
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
      
      <div className="container mx-auto px-6 py-16 max-w-7xl pt-32" key="profile-content">
        {/* Page Header */}
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-burgundy uppercase">
            Your Profile
          </h1>
          <div className="w-16 h-px bg-burgundy/40 mx-auto"></div>
        </div>

        {/* Style Section */}
        <div className="mb-32" key="style-section">
          <StyleProfileSelector />
        </div>

        {/* Measurements Section */}
        <div className="pb-16" key="measurements-section">
          <MeasurementsSection />
        </div>
      </div>
    </div>
  );
};
