import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import curaLogoSquare from '@/assets/cura-logo-square.png';

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
          <img 
            src={curaLogoSquare} 
            alt="CURA Logo" 
            className="w-16 h-16"
          />
        </Link>
        
        {user ? (
          <div className="flex items-center gap-1">
            <Link to="/gallery">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono px-2"
              >
                gallery
              </Button>
            </Link>
            <span className="text-foreground/40 font-mono">/</span>
            <Link to="/inspiration">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono px-2"
              >
                inspiration
              </Button>
            </Link>
            <span className="text-foreground/40 font-mono">/</span>
            <Link to="/cura-cart">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono px-2"
              >
                cart
              </Button>
            </Link>
            <span className="text-foreground/40 font-mono">/</span>
            <Link to="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono px-2"
              >
                profile
              </Button>
            </Link>
            <span className="text-foreground/40 font-mono">/</span>
            <Link to="/connect">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono px-2"
              >
                connect
              </Button>
            </Link>
            <span className="text-foreground/40 font-mono">/</span>
            <Link to="/how-to-use">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono px-2"
              >
                guide
              </Button>
            </Link>
            <span className="text-foreground/40 font-mono">/</span>
            <Link to="/our-mission">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono px-2"
              >
                mission
              </Button>
            </Link>
            <span className="text-foreground/40 font-mono">/</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-foreground hover:bg-muted font-mono px-2"
            >
              signout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Link to="/gallery">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono px-2"
              >
                gallery
              </Button>
            </Link>
            <span className="text-foreground/40 font-mono">/</span>
            <Link to="/inspiration">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono px-2"
              >
                inspiration
              </Button>
            </Link>
            <span className="text-foreground/40 font-mono">/</span>
            <Link to="/connect">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono px-2"
              >
                connect
              </Button>
            </Link>
            <span className="text-foreground/40 font-mono">/</span>
            <Link to="/how-to-use">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono px-2"
              >
                guide
              </Button>
            </Link>
            <span className="text-foreground/40 font-mono">/</span>
            <Link to="/our-mission">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono px-2"
              >
                mission
              </Button>
            </Link>
            <span className="text-foreground/40 font-mono">/</span>
            <Link to="/auth">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted font-mono px-2"
              >
                signin
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
