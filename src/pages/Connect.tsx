import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ThrifterGallery } from '@/components/ThrifterGallery';
import { useToast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation';

export const Connect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [userStyleTags, setUserStyleTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      } else {
        setUser(user);
        // Fetch user's style profile
        const { data: profile } = await supabase
          .from('user_style_profiles')
          .select('style_tags')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (profile?.style_tags) {
          setUserStyleTags(profile.style_tags);
        }
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!user || loading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 max-w-6xl pt-32">
        
        <article className="space-y-20 py-8">
          {/* Hero Title */}
          <header className="text-center space-y-8 pt-12 pb-12">
            <h2 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-[0.3em]">CONNECT</h2>
            <div className="w-16 h-px bg-primary/40 mx-auto"></div>
            <p className="text-sm md:text-base font-light leading-loose font-mono text-foreground/70 max-w-2xl mx-auto px-8">
              Discover expert thrifters and stylists who match your aesthetic. Connect with curators who understand your style and can help bring your wardrobe vision to life.
            </p>
          </header>

          {/* Gallery Section */}
          <section className="py-8">
            <ThrifterGallery userStyleTags={userStyleTags} userId={user.id} />
          </section>

          {/* Info Section */}
          <aside className="max-w-2xl mx-auto py-12 px-8">
          <p className="text-sm md:text-base font-light leading-relaxed font-mono text-foreground/60 text-center italic">
            Each connection is an opportunity to curate something meaningful. Whether you're seeking or offering expertise, this is where style meets intention.
          </p>
          </aside>
        </article>
      </div>
    </div>
  );
};