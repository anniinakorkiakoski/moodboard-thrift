import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryUpload } from '@/components/GalleryUpload';
import { StylerFinds } from '@/components/StylerFinds';
import { BundleDisplay } from '@/components/BundleDisplay';
import { LibrarySidebar } from '@/components/LibrarySidebar';
import { LogoAnimation } from '@/components/LogoAnimation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { LogOut, User, Sparkles, Heart } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchedImage, setSearchedImage] = useState<{ url: string; caption: string } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showLogoAnimation, setShowLogoAnimation] = useState(true); // Show on page load
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false);

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
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="container mx-auto flex justify-end">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/our-mission">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-burgundy hover:bg-burgundy/10"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Our Mission
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Link to="/style-profile">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  My Style
                </Button>
              </Link>
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
            <div className="flex items-center gap-4">
              <Link to="/our-mission">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-burgundy hover:bg-burgundy/10"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Our Mission
                </Button>
              </Link>
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
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center relative overflow-hidden py-20">
        <div className="w-full px-0">
            <div className="text-center space-y-24 mb-32">
              <div className="mt-16 flex justify-center w-full">
                <div className="flex items-center w-full max-w-[2000px]">
                  {/* Left burgundy extension */}
                  <div className="flex-1 h-80 bg-accent-foreground relative overflow-hidden min-w-0">
                  </div>
                  
                  {/* Center transparent square */}
                  <div className="w-80 h-80 bg-transparent flex items-center justify-center flex-shrink-0">
                    <h1 className="text-8xl md:text-9xl font-black text-accent-foreground leading-none text-center tracking-tighter">
                      CURA
                    </h1>
                  </div>
                  
                  {/* Right burgundy extension */}
                  <div className="flex-1 h-80 bg-accent-foreground relative overflow-hidden min-w-0">
                  </div>
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

            {/* Cura Gallery Section */}
            <div className="relative min-h-screen py-20">
              <div className="container mx-auto px-8 pt-0 pb-32">
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
      <section className="py-32 bg-background">
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

      {/* Sourcing From Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-8">
          <div className="text-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-black text-primary uppercase tracking-[0.3em]">Sourcing From</h2>
              <div className="w-16 h-px bg-primary/40 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {[
                { name: 'Vinted', initial: 'V', color: 'bg-orange-500' },
                { name: 'Depop', initial: 'D', color: 'bg-green-500' },
                { name: 'Vestiaire Collective', initial: 'VC', color: 'bg-black' },
                { name: 'The RealReal', initial: 'TRR', color: 'bg-gray-800' },
                { name: 'thredUP', initial: 'TU', color: 'bg-blue-600' },
                { name: 'eBay', initial: 'E', color: 'bg-red-600' },
                { name: 'Facebook Marketplace', initial: 'FB', color: 'bg-blue-500' },
                { name: 'Shpock', initial: 'S', color: 'bg-purple-600' },
                { name: 'Grailed', initial: 'G', color: 'bg-gray-700' },
                { name: 'Poshmark', initial: 'P', color: 'bg-pink-600' },
                { name: 'ASOS Marketplace', initial: 'AM', color: 'bg-green-600' },
                { name: 'Hardly Ever Worn It', initial: 'HEWI', color: 'bg-burgundy' },
                { name: 'Marrkt', initial: 'M', color: 'bg-indigo-600' },
                { name: 'True Vintage', initial: 'TV', color: 'bg-amber-700' },
                { name: 'FINDS', initial: 'F', color: 'bg-teal-600' },
                { name: 'Zalando Pre-Owned', initial: 'Z', color: 'bg-orange-600' },
                { name: 'Etsy', initial: 'Et', color: 'bg-orange-500' },
                { name: 'Tise', initial: 'T', color: 'bg-blue-500' },
                { name: 'Selpy', initial: 'Se', color: 'bg-purple-500' },
                { name: 'Emmy', initial: 'Em', color: 'bg-pink-500' }
              ].map((platform, index) => (
                <div 
                  key={platform.name}
                  className="group cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="bg-white border border-muted/40 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105 p-4">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <div className={`w-8 h-8 ${platform.color} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white text-[10px] font-bold">{platform.initial}</span>
                      </div>
                      <span className="text-[10px] font-light text-foreground/70 font-lora leading-tight">{platform.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;