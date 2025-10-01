import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryUpload } from '@/components/GalleryUpload';
import { StylerFinds } from '@/components/StylerFinds';
import { BundleDisplay } from '@/components/BundleDisplay';
import { LibrarySidebar } from '@/components/LibrarySidebar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { LogOut, User, Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
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
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="container mx-auto flex justify-end">
          {user ? (
            <div className="flex items-center gap-4">
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
      <section className="min-h-screen flex flex-col justify-center relative overflow-hidden">
        <div className="w-full px-0">
            <div className="text-center space-y-16 mb-16">
              <div className="mt-16 flex justify-center w-full">
                <div className="flex items-center w-full max-w-[2000px]">
                  {/* Left burgundy extension with artistic linework */}
                  <div className="flex-1 h-80 bg-accent-foreground relative overflow-hidden min-w-0">
                    {/* Organic artistic line work */}
                    <div className="absolute inset-0 opacity-18">
                      <svg className="w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none">
                        {/* Single detailed cloud with seamless horizontal extensions */}
                        <path d="M0,65 L35,65 Q42,58 52,61 Q65,64 72,56 Q78,49 87,52 Q96,55 103,60 Q109,65 118,62 Q127,59 135,66 Q142,73 149,67 Q155,61 162,64 Q168,67 172,62 L400,62" 
                              stroke="hsl(330 60% 75%)" strokeWidth="1.2" fill="none" opacity="0.55" strokeLinecap="round" strokeLinejoin="round"/>
                        
                        {/* Mountain with sharp peaks */}
                        <path d="M0,240 L50,240 L75,210 L85,225 L95,200 L105,215 L125,235 L400,235" 
                              stroke="hsl(330 60% 75%)" strokeWidth="1" fill="none" opacity="0.7" strokeLinecap="round" strokeLinejoin="round"/>
                        
                        {/* Lower softer hill */}
                        <path d="M0,270 Q100,250 200,255 Q300,260 400,265" 
                              stroke="hsl(330 60% 75%)" strokeWidth="0.9" fill="none" opacity="0.6" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Center transparent square */}
                  <div className="w-80 h-80 bg-transparent flex items-center justify-center flex-shrink-0">
                    <h1 className="text-8xl md:text-9xl font-black text-accent-foreground leading-none text-center tracking-tighter">
                      CURA
                    </h1>
                  </div>
                  
                  {/* Right burgundy extension with artistic linework */}
                  <div className="flex-1 h-80 bg-accent-foreground relative overflow-hidden min-w-0">
                    {/* Organic artistic line work - MIRRORED from left side */}
                    <div className="absolute inset-0 opacity-18">
                      <svg className="w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none" style={{ transform: 'scaleX(-1)' }}>
                        {/* Single detailed cloud with seamless horizontal extensions */}
                        <path d="M0,65 L35,65 Q42,58 52,61 Q65,64 72,56 Q78,49 87,52 Q96,55 103,60 Q109,65 118,62 Q127,59 135,66 Q142,73 149,67 Q155,61 162,64 Q168,67 172,62 L400,62" 
                              stroke="hsl(330 60% 75%)" strokeWidth="1.2" fill="none" opacity="0.55" strokeLinecap="round" strokeLinejoin="round"/>
                        
                        {/* Mountain with sharp peaks */}
                        <path d="M0,240 L50,240 L75,210 L85,225 L95,200 L105,215 L125,235 L400,235" 
                              stroke="hsl(330 60% 75%)" strokeWidth="1" fill="none" opacity="0.7" strokeLinecap="round" strokeLinejoin="round"/>
                        
                        {/* Lower softer hill */}
                        <path d="M0,270 Q100,250 200,255 Q300,260 400,265" 
                              stroke="hsl(330 60% 75%)" strokeWidth="0.9" fill="none" opacity="0.6" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-80 flex justify-center items-center">
                <p className="text-lg font-light text-foreground/90 max-w-xl mx-auto leading-relaxed font-serif text-center">
                  Upload your style inspiration, and let Al find the perfect secondhand pieces from across multiple platforms.
                  <br /><br />
                  <span className="text-lg">Sustainable fashion, curated for you.</span>
                </p>
              </div>
            </div>

            {/* Cura Gallery Section */}
            <div className="relative min-h-screen bg-gradient-to-b from-background to-secondary/10">
              <div className="container mx-auto px-8 pt-0 pb-16">
              <div className="text-center mb-20">
                <h2 className="text-4xl font-black text-primary mb-6 uppercase tracking-wider" style={{ fontWeight: '950', textShadow: '2px 2px 4px rgba(0,0,0,0.1)', letterSpacing: '0.2em' }}>Cura Gallery</h2>
                <p className="text-lg font-light text-foreground/90 leading-relaxed max-w-2xl mx-auto font-serif">
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
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Section title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-primary mb-4 uppercase tracking-wider" style={{ fontWeight: '950', textShadow: '2px 2px 4px rgba(0,0,0,0.1)', letterSpacing: '0.2em' }}>The Process</h2>
              <p className="text-base font-light text-foreground/90 leading-relaxed tracking-wide font-serif">
                Three simple steps to curate your perfect wardrobe
              </p>
            </div>

            {/* Process Steps - Unified Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              
              {/* Step 1 */}
              <div className="group">
                <div className="bg-white border border-muted shadow-sm hover:shadow-lg transition-all duration-300 p-8 h-full hover-scale">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-burgundy flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl font-medium text-burgundy-foreground">01</span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-black text-primary uppercase tracking-wider">Share</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
                        Upload your style inspiration — mood boards, outfit photos, or curated imagery that speaks to your aesthetic vision.
                      </p>
                      <details className="mt-4 text-left">
                        <summary className="text-xs font-medium text-burgundy cursor-pointer hover:text-burgundy/80 transition-colors uppercase tracking-wide">
                          Become a better sharer →
                        </summary>
                        <div className="mt-3 pt-3 border-t border-muted">
                          <p className="text-xs font-light text-muted-foreground leading-relaxed">
                            Caption your images with what you love about each piece. Describe the colors, textures, silhouettes, or moods that draw you in. These notes not only help you organize your thoughts but also train our AI to understand your unique style and discover better matches for you.
                          </p>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
                
                {/* Connector Arrow - Hidden on mobile */}
                <div className="hidden md:flex justify-center mt-6">
                  <div className="w-8 h-px bg-burgundy/30 relative">
                    <div className="absolute right-0 top-0 w-2 h-px bg-burgundy/30 transform rotate-45 origin-right"></div>
                    <div className="absolute right-0 top-0 w-2 h-px bg-burgundy/30 transform -rotate-45 origin-right"></div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group">
                <div className="bg-white border border-muted shadow-sm hover:shadow-lg transition-all duration-300 p-8 h-full hover-scale">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-burgundy flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl font-medium text-burgundy-foreground">02</span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-black text-primary uppercase tracking-wider">Discover</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
                        Our AI carefully searches through premium secondhand platforms to find pieces that match your unique vision.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Connector Arrow - Hidden on mobile */}
                <div className="hidden md:flex justify-center mt-6">
                  <div className="w-8 h-px bg-burgundy/30 relative">
                    <div className="absolute right-0 top-0 w-2 h-px bg-burgundy/30 transform rotate-45 origin-right"></div>
                    <div className="absolute right-0 top-0 w-2 h-px bg-burgundy/30 transform -rotate-45 origin-right"></div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group">
                <div className="bg-white border border-muted shadow-sm hover:shadow-lg transition-all duration-300 p-8 h-full hover-scale">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-burgundy flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl font-medium text-burgundy-foreground">03</span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-black text-primary uppercase tracking-wider">Curate</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
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

    </div>
  );
};

export default Index;