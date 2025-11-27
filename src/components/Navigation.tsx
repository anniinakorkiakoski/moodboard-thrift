import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

export const Navigation = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSessionExpiry = async () => {
      const sessionExpiry = localStorage.getItem('sessionExpiry');
      const rememberMe = localStorage.getItem('rememberMe');
      
      if (sessionExpiry && rememberMe === 'false') {
        const expiryDate = new Date(sessionExpiry);
        const now = new Date();
        
        if (now > expiryDate) {
          await supabase.auth.signOut();
          localStorage.removeItem('sessionExpiry');
          localStorage.removeItem('rememberMe');
        }
      }
    };

    const getUser = async () => {
      await checkSessionExpiry();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('sessionExpiry');
    localStorage.removeItem('rememberMe');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border nav-header">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <div className="w-16 h-16 border-[3px] border-burgundy flex flex-col items-center justify-center px-2 py-1.5 bg-background">
            <span className="font-display font-black text-burgundy text-lg leading-none tracking-tight">CU</span>
            <div className="w-full h-[2px] bg-burgundy my-1"></div>
            <span className="font-display font-black text-burgundy text-lg leading-none tracking-tight">RA</span>
          </div>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/gallery">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono"
              >
                gallery
              </Button>
            </Link>
            <Link to="/cura-cart">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono"
              >
                cura cart
              </Button>
            </Link>
            <Link to="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono"
              >
                profile
              </Button>
            </Link>
            <Link to="/connect">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono"
              >
                connect
              </Button>
            </Link>
            <Link to="/how-to-use">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono"
              >
                how to use
              </Button>
            </Link>
            <Link to="/our-mission">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono"
              >
                our mission
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-foreground hover:bg-muted font-mono"
            >
              sign out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/gallery">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono"
              >
                gallery
              </Button>
            </Link>
            <Link to="/connect">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono"
              >
                connect
              </Button>
            </Link>
            <Link to="/how-to-use">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono"
              >
                how to use
              </Button>
            </Link>
            <Link to="/our-mission">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono"
              >
                our mission
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono"
              >
                sign in
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
