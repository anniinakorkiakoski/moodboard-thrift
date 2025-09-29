import { useState, useEffect } from 'react';
import { GalleryUpload } from '@/components/GalleryUpload';
import { StylerFinds } from '@/components/StylerFinds';
import { BundleDisplay } from '@/components/BundleDisplay';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Index = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchedImage, setSearchedImage] = useState<{ url: string; caption: string } | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleUpload = (files: File[]) => {
    console.log('Uploaded files:', files);
    setIsSearching(true);
    setSearchedImage(null);
    
    // Simulate AI processing time
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 3000);
  };

  const handleImageSearch = (image: { url: string; caption: string }) => {
    setSearchedImage(image);
    setIsSearching(true);
    // Simulate AI processing time for visual search
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 2500);
  };

  const handleStartOver = () => {
    setShowResults(false);
    setSearchedImage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="container mx-auto flex justify-end">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button
                variant="outline"
                size="sm"
                className="border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center relative">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-16 mb-32">
            <div className="mt-16 flex justify-center">
              <div className="flex items-center w-full">
                {/* Left burgundy extension */}
                <div className="flex-1 h-80 bg-accent-foreground"></div>
                
                {/* Center transparent square */}
                <div className="w-80 h-80 bg-transparent flex items-center justify-center flex-shrink-0">
                  <h1 className="text-8xl md:text-9xl font-black text-accent-foreground leading-none text-center tracking-tighter">
                    CURA
                  </h1>
                </div>
                
                {/* Right burgundy extension */}
                <div className="flex-1 h-80 bg-accent-foreground"></div>
              </div>
            </div>
            <p className="text-lg font-light text-primary max-w-2xl mx-auto leading-relaxed mt-20 font-serif">
              Upload your style inspiration, and let Al find the perfect secondhand pieces from across multiple platforms.
              <br /><br />
              <span className="text-base">Sustainable fashion, curated for you.</span>
            </p>
          </div>

          {/* Main Picture Feed - User's Uploaded Images */}
          <GalleryUpload 
            onUpload={handleUpload}
            onImageSearch={handleImageSearch}
            isLoading={isSearching} 
          />
        </div>
      </section>

      {/* Loading State */}
      {isSearching && (
        <section className="py-16">
          <BundleDisplay isSearching={true} />
        </section>
      )}

      {/* Results Section - Shows alongside the main picture feed */}
      {showResults && (
        <section className="py-16 bg-secondary/30">
          <StylerFinds searchedImage={searchedImage} onStartOver={handleStartOver} />
        </section>
      )}

      {/* Gallery Process Section */}
      {!showResults && (
        <section className="py-32 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              
              {/* Section title */}
              <div className="text-center mb-24">
                <h2 className="text-2xl font-light font-serif text-primary mb-4">The Process</h2>
                <p className="text-sm font-light text-muted-foreground tracking-wide">
                  Three moments in your curation journey
                </p>
              </div>

              {/* Gallery-style grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
                
                {/* Step 1 - Large frame */}
                <div className="md:col-span-5 space-y-6">
                  <div className="bg-white border-2 border-muted p-12 shadow-sm">
                    <div className="space-y-4">
                      <div className="w-8 h-8 bg-burgundy flex items-center justify-center">
                        <span className="text-sm font-medium text-burgundy-foreground">01</span>
                      </div>
                      <h3 className="text-lg font-light font-serif text-primary">Share</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
                        Upload your style inspiration — mood boards, outfit photos, or curated imagery that speaks to your aesthetic vision.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 - Medium frame, offset */}
                <div className="md:col-span-4 md:col-start-7 space-y-6 md:mt-16">
                  <div className="bg-white border border-muted p-8 shadow-sm">
                    <div className="space-y-4">
                      <div className="w-6 h-6 bg-burgundy flex items-center justify-center">
                        <span className="text-xs font-medium text-burgundy-foreground">02</span>
                      </div>
                      <h3 className="text-base font-light font-serif text-primary">Discover</h3>
                      <p className="text-xs font-light text-muted-foreground leading-relaxed">
                        Our AI carefully searches through premium secondhand platforms to find pieces that match your vision.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 - Small frame, positioned uniquely */}
                <div className="md:col-span-3 md:col-start-4 space-y-6 md:-mt-8">
                  <div className="bg-white border border-muted p-6 shadow-sm">
                    <div className="space-y-3">
                      <div className="w-5 h-5 bg-burgundy flex items-center justify-center">
                        <span className="text-xs font-medium text-burgundy-foreground">03</span>
                      </div>
                      <h3 className="text-sm font-light font-serif text-primary">Curate</h3>
                      <p className="text-xs font-light text-muted-foreground leading-relaxed">
                        Review your personalized collection and make thoughtful additions to your wardrobe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;