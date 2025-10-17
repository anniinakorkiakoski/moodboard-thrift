import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryUpload } from '@/components/GalleryUpload';
import { StylerFinds } from '@/components/StylerFinds';
import { BundleDisplay } from '@/components/BundleDisplay';
import { LibrarySidebar } from '@/components/LibrarySidebar';
import { LogoAnimation } from '@/components/LogoAnimation';
import { SourceChain } from '@/components/SourceChain';
import { AllPlatformsDialog } from '@/components/AllPlatformsDialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { LogOut, User, Sparkles, Heart, Users } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

const Index = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchedImage, setSearchedImage] = useState<{ url: string; caption: string } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showLogoAnimation, setShowLogoAnimation] = useState(true); // Show on page load
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  useEffect(() => {
    // Check current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // If animation already showing on page load, mark as seen to prevent double-play
      if (showLogoAnimation && !hasSeenAnimation) {
        setHasSeenAnimation(true);
      }
      
      // Show animation only for already logged-in users on first load
      if (user && !hasSeenAnimation) {
        setShowLogoAnimation(true);
        setHasSeenAnimation(true);
      }
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      
      // Show animation on sign in event
      if (event === 'SIGNED_IN' && newUser && !hasSeenAnimation) {
        setShowLogoAnimation(true);
        setHasSeenAnimation(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [hasSeenAnimation, showLogoAnimation]);

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

  const handleImageSearch = (image: { url: string; caption: string; aspectRatio: number }) => {
    // Navigate to visual search results page
    navigate('/search', {
      state: { imageUrl: image.url }
    });
  };

  const handleStartOver = () => {
    setShowResults(false);
    setSearchedImage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Logo Animation Overlay */}
      {showLogoAnimation && (
        <LogoAnimation onComplete={() => setShowLogoAnimation(false)} />
      )}
      
      <Navigation />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center relative overflow-hidden py-20 pt-32">
        <div className="w-full px-0">
            <div className="text-center space-y-24 mb-32">
              <div className="mt-16 flex justify-center w-full px-8">
                <div className="relative inline-block">
                  {/* Top line */}
                  <div className="w-full h-1 bg-burgundy -mb-3"></div>
                  
                  {/* CURA title */}
                  <h1 className="text-[10rem] md:text-[12rem] font-black text-burgundy leading-none text-center tracking-tight">
                    CURA
                  </h1>
                  
                  {/* Bottom line */}
                  <div className="w-full h-1 bg-burgundy mt-0.5"></div>
                </div>
              </div>
              <div className="px-8 py-16">
                <p className="text-sm md:text-base font-light text-foreground/70 max-w-lg mx-auto leading-loose font-lora text-center">
                  Upload your style inspiration, and let AI and professional thrifters and stylists find the perfect secondhand pieces from across multiple platforms.
                </p>
                <p className="text-xs md:text-sm font-light text-foreground/60 max-w-md mx-auto mt-6 font-lora text-center italic">
                  Sustainable fashion, curated for you.
                </p>
              </div>
            </div>

            {/* Sourcing From Section */}
            <div className="py-24 bg-background">
              <div className="container mx-auto px-8">
                <div className="text-center space-y-6 mb-12">
                  <h2 className="text-2xl md:text-3xl font-black text-primary uppercase tracking-[0.3em]">Sourcing From</h2>
                  <div className="w-16 h-px bg-primary/40 mx-auto"></div>
                  <p className="text-sm font-light text-foreground/60 tracking-wide">
                    A network of trusted platforms
                  </p>
                </div>
                
                <SourceChain />
                
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowAllPlatforms(true)}
                    className="text-sm font-light text-foreground/70 hover:text-foreground uppercase tracking-widest transition-colors duration-300 underline underline-offset-4"
                  >
                    Click here to see all
                  </button>
                </div>
              </div>
            </div>

            {/* Cura Gallery Section */}
            <div className="relative min-h-screen py-20">
              <div className="container mx-auto px-8 pt-0 pb-8">
              <div className="text-center mb-24 space-y-6">
                <h2 className="text-2xl md:text-3xl font-black text-primary uppercase tracking-[0.3em]">Cura Gallery</h2>
                <div className="w-16 h-px bg-primary/40 mx-auto"></div>
                <p className="text-sm md:text-base font-light text-foreground/70 leading-loose max-w-xl mx-auto font-lora">
                  Share your style inspiration and discover premium secondhand pieces curated specifically for your aesthetic
                </p>
              </div>
              
              <div className="max-w-7xl mx-auto">
                <GalleryUpload 
                  onUpload={handleUpload}
                  onImageSearch={handleImageSearch}
                  isLoading={isSearching} 
                />
              </div>
            </div>
          </div>
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

      {/* The Process - Now at the bottom */}
      <section className="pt-8 pb-32 bg-background">
        <div className="container mx-auto px-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Section title */}
            <div className="text-center mb-24 space-y-6">
              <h2 className="text-2xl md:text-3xl font-black text-primary uppercase tracking-[0.3em]">The Process</h2>
              <div className="w-16 h-px bg-primary/40 mx-auto"></div>
              <p className="text-sm md:text-base font-light text-foreground/70 leading-loose font-lora">
                Three simple steps to curate your perfect wardrobe
              </p>
            </div>

            {/* Process Steps - Magazine layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
              
              {/* Step 1 */}
              <div className="group space-y-8">
                <div className="bg-white border border-muted/40 shadow-sm hover:shadow-md transition-all duration-300 p-10 h-full">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-12 h-12 bg-burgundy flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-base font-medium text-burgundy-foreground">01</span>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-primary uppercase tracking-[0.2em]">Share</h3>
                      <p className="text-xs font-light text-foreground/70 leading-loose font-lora">
                        Upload your style inspiration — mood boards, outfit photos, or curated imagery that speaks to your aesthetic vision.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group space-y-8">
                <div className="bg-white border border-muted/40 shadow-sm hover:shadow-md transition-all duration-300 p-10 h-full">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-12 h-12 bg-burgundy flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-base font-medium text-burgundy-foreground">02</span>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-primary uppercase tracking-[0.2em]">Discover</h3>
                      <p className="text-xs font-light text-foreground/70 leading-loose font-lora">
                        Our AI carefully searches through premium secondhand platforms to find pieces that match your unique vision.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group space-y-8">
                <div className="bg-white border border-muted/40 shadow-sm hover:shadow-md transition-all duration-300 p-10 h-full">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-12 h-12 bg-burgundy flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-base font-medium text-burgundy-foreground">03</span>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-primary uppercase tracking-[0.2em]">Curate</h3>
                      <p className="text-xs font-light text-foreground/70 leading-loose font-lora">
                        Review your personalized collection and make thoughtful additions to build your perfect wardrobe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AllPlatformsDialog
        open={showAllPlatforms} 
        onOpenChange={setShowAllPlatforms}
      />

    </div>
  );
};

export default Index;