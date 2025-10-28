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
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1EB' }}>
      <Navigation />
      
      <div className="container mx-auto px-6 py-16 max-w-5xl pt-32" key="profile-content">
        {/* Document Header */}
        <div className="mb-16">
          <div className="border border-foreground/20 bg-white p-12">
            <div className="text-center mb-8">
              <h1 className="text-2xl tracking-[0.3em] text-foreground uppercase font-light">
                STYLE BIOGRAPHY
              </h1>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-12 gap-px bg-foreground/20 border border-foreground/20">
              {/* Name Field */}
              <div className="col-span-6 bg-white p-4">
                <div className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2">Name</div>
                <div className="text-sm font-mono">{user?.email?.split('@')[0] || 'User'}</div>
              </div>

              {/* Profile Photo Placeholder */}
              <div className="col-span-6 bg-white p-4 row-span-3 flex items-center justify-center">
                <div className="w-32 h-40 border border-foreground/20 flex items-center justify-center">
                  <div className="text-xs text-foreground/40 text-center">
                    PROFILE<br/>IMAGE
                  </div>
                </div>
              </div>

              {/* Title Field */}
              <div className="col-span-6 bg-white p-4">
                <div className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2">Title</div>
                <div className="text-sm font-mono">Fashion Enthusiast</div>
              </div>

              {/* Date Joined */}
              <div className="col-span-6 bg-white p-4">
                <div className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2">Member Since</div>
                <div className="text-sm font-mono">
                  {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              {/* Function/Role */}
              <div className="col-span-6 bg-white p-4">
                <div className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2">Function</div>
                <div className="text-sm font-mono">Collector & Curator</div>
              </div>

              {/* Email */}
              <div className="col-span-6 bg-white p-4">
                <div className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2">Contact</div>
                <div className="text-sm font-mono text-foreground/70">{user?.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Style Section */}
        <div className="mb-16" key="style-section">
          <div className="border border-foreground/20 bg-white p-12">
            <StyleProfileSelector />
          </div>
        </div>

        {/* Measurements Section */}
        <div className="pb-16" key="measurements-section">
          <div className="border border-foreground/20 bg-white p-12">
            <MeasurementsSection />
          </div>
        </div>
      </div>
    </div>
  );
};
