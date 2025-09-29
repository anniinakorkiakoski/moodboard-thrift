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
                {/* Left burgundy extension with artistic linework */}
                <div className="flex-1 h-80 bg-accent-foreground relative overflow-hidden">
                  {/* Subtle artistic line work */}
                  <div className="absolute inset-0 opacity-18">
                    <svg className="w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none">
                      {/* Sharp mountain line silhouettes */}
                      <path d="M0,210 L80,160 L120,180 L180,140 L240,170 L300,120 L360,150 L400,130" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.7" fill="none" opacity="0.8"/>
                      <path d="M0,230 L60,190 L140,200 L200,170 L280,190 L340,160 L400,175" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.5" fill="none" opacity="0.6"/>
                      {/* Paint brush stroke clouds */}
                      <path d="M50,85 Q65,80 85,82 Q105,78 125,85 Q140,88 155,85" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.6" fill="none" opacity="0.4" strokeLinecap="round"/>
                      <path d="M180,65 Q200,62 225,65 Q250,60 275,67 Q300,64 320,68" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.5" fill="none" opacity="0.5" strokeLinecap="round"/>
                      {/* Natural brush strokes with varying opacity */}
                      <path d="M40,45 Q70,42 95,48 Q125,45 155,52 Q185,49 220,55 Q250,52 285,48" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.4" fill="none" opacity="0.3" strokeLinecap="round"/>
                      <path d="M25,135 Q55,132 85,138 Q115,135 145,142 Q175,139 205,145 Q235,142 265,138" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.4" fill="none" opacity="0.4" strokeLinecap="round"/>
                      <path d="M60,115 Q85,112 110,118 Q135,115 165,122 Q195,119 225,125 Q255,122 285,118" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.3" fill="none" opacity="0.35" strokeLinecap="round"/>
                      {/* Additional delicate strokes */}
                      <path d="M90,95 Q115,92 140,98 Q165,95 190,101" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.3" fill="none" opacity="0.25" strokeLinecap="round"/>
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
                <div className="flex-1 h-80 bg-accent-foreground relative overflow-hidden">
                  {/* Subtle artistic line work */}
                  <div className="absolute inset-0 opacity-18">
                    <svg className="w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none">
                      {/* Sharp mountain line silhouettes */}
                      <path d="M0,140 L40,120 L100,150 L160,110 L220,140 L280,105 L340,130 L400,115" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.7" fill="none" opacity="0.8"/>
                      <path d="M0,165 L60,145 L120,160 L180,130 L240,155 L300,125 L360,145 L400,130" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.5" fill="none" opacity="0.6"/>
                      {/* Paint brush stroke clouds */}
                      <path d="M80,90 Q100,85 125,88 Q150,82 175,90 Q195,93 215,90" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.6" fill="none" opacity="0.4" strokeLinecap="round"/>
                      <path d="M240,70 Q265,67 290,72 Q315,69 340,75 Q365,72 385,76" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.5" fill="none" opacity="0.5" strokeLinecap="round"/>
                      {/* Natural brush strokes with varying opacity */}
                      <path d="M90,50 Q120,47 150,53 Q180,50 210,56 Q240,53 270,59 Q300,56 330,52" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.4" fill="none" opacity="0.3" strokeLinecap="round"/>
                      <path d="M70,140 Q100,137 130,143 Q160,140 190,146 Q220,143 250,149 Q280,146 310,142" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.4" fill="none" opacity="0.4" strokeLinecap="round"/>
                      <path d="M110,120 Q135,117 160,123 Q185,120 215,126 Q245,123 275,129 Q305,126 335,122" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.3" fill="none" opacity="0.35" strokeLinecap="round"/>
                      {/* Additional delicate strokes */}
                      <path d="M200,100 Q225,97 250,103 Q275,100 300,106" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.3" fill="none" opacity="0.25" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
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
            <div className="max-w-4xl mx-auto">
              
              {/* Section title */}
              <div className="text-center mb-16">
                <h2 className="text-3xl font-light font-serif text-primary mb-4">The Process</h2>
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  Three simple steps to curate your perfect wardrobe
                </p>
              </div>

              {/* Process Steps - Unified Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                
                {/* Step 1 */}
                <div className="group">
                  <div className="bg-white border border-muted shadow-sm hover:shadow-lg transition-all duration-300 p-8 h-full hover-scale">
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="w-16 h-16 bg-burgundy rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl font-medium text-burgundy-foreground">01</span>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-light font-serif text-primary">Share</h3>
                        <p className="text-sm font-light text-muted-foreground leading-relaxed">
                          Upload your style inspiration — mood boards, outfit photos, or curated imagery that speaks to your aesthetic vision.
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

                {/* Step 2 */}
                <div className="group">
                  <div className="bg-white border border-muted shadow-sm hover:shadow-lg transition-all duration-300 p-8 h-full hover-scale">
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="w-16 h-16 bg-burgundy rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl font-medium text-burgundy-foreground">02</span>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-light font-serif text-primary">Discover</h3>
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
                      <div className="w-16 h-16 bg-burgundy rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl font-medium text-burgundy-foreground">03</span>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-light font-serif text-primary">Curate</h3>
                        <p className="text-sm font-light text-muted-foreground leading-relaxed">
                          Review your personalized collection and make thoughtful additions to build your perfect wardrobe.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center mt-16">
                <p className="text-sm font-light text-muted-foreground italic">
                  Start by sharing your inspiration above
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;