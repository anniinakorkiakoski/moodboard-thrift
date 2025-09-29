import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryUpload } from '@/components/GalleryUpload';
import { StylerFinds } from '@/components/StylerFinds';
import { BundleDisplay } from '@/components/BundleDisplay';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

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
                      {/* Organic mountain silhouettes */}
                      <path d="M0,210 C20,195 35,170 55,165 C75,160 90,175 110,180 C130,185 145,160 170,155 C190,150 210,165 235,170 C260,175 280,150 305,145 C330,140 350,155 370,150 C380,148 390,145 400,142" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.7" fill="none" opacity="0.8" strokeLinecap="round"/>
                      <path d="M0,225 C25,215 40,195 65,190 C85,185 105,200 125,205 C145,210 165,185 185,180 C205,175 225,190 250,195 C275,200 295,175 320,170 C345,165 365,180 385,175 C390,174 395,173 400,172" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.5" fill="none" opacity="0.6" strokeLinecap="round"/>
                      {/* Soft cloud formations */}
                      <path d="M50,85 C60,82 70,78 80,82 C90,86 100,80 110,84 C120,88 130,85 140,87 C145,88 150,86 155,85" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.6" fill="none" opacity="0.4" strokeLinecap="round"/>
                      <path d="M180,65 C195,62 210,58 225,65 C240,72 255,65 270,67 C285,69 300,64 315,68 C318,69 320,68 320,68" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.5" fill="none" opacity="0.5" strokeLinecap="round"/>
                      {/* Natural flowing brush strokes */}
                      <path d="M40,45 C55,43 70,40 85,46 C100,52 115,48 130,50 C145,52 160,49 175,53 C190,57 205,54 220,56 C235,58 250,55 265,51 C275,49 285,47 285,48" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.4" fill="none" opacity="0.3" strokeLinecap="round"/>
                      <path d="M25,135 C40,133 55,130 70,136 C85,142 100,138 115,140 C130,142 145,139 160,143 C175,147 190,144 205,146 C220,148 235,145 250,141 C260,139 265,138 265,138" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.4" fill="none" opacity="0.4" strokeLinecap="round"/>
                      <path d="M60,115 C75,113 90,110 105,116 C120,122 135,118 150,120 C165,122 180,119 195,123 C210,127 225,124 240,126 C255,128 270,125 285,121" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.3" fill="none" opacity="0.35" strokeLinecap="round"/>
                      {/* Delicate wispy strokes */}
                      <path d="M90,95 C105,93 120,90 135,96 C150,102 165,99 180,101 C185,102 190,101 190,101" 
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
                      {/* Organic mountain silhouettes */}
                      <path d="M0,140 C15,135 30,125 50,120 C70,115 85,130 105,135 C125,140 140,115 165,110 C185,105 205,120 225,125 C245,130 265,105 290,100 C315,95 335,110 355,105 C375,100 385,95 390,92 C395,90 400,88 400,88" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.7" fill="none" opacity="0.8" strokeLinecap="round"/>
                      <path d="M0,165 C20,155 35,145 60,140 C80,135 100,150 120,155 C140,160 160,135 180,130 C200,125 220,140 245,145 C270,150 290,125 315,120 C340,115 360,130 380,125 C390,123 395,122 400,120" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.5" fill="none" opacity="0.6" strokeLinecap="round"/>
                      {/* Soft cloud formations */}
                      <path d="M80,90 C90,87 100,83 110,87 C120,91 130,85 140,89 C150,93 160,90 170,92 C180,94 190,91 200,90 C210,89 215,90 215,90" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.6" fill="none" opacity="0.4" strokeLinecap="round"/>
                      <path d="M240,70 C255,67 270,63 285,70 C300,77 315,70 330,72 C345,74 360,69 375,73 C380,74 385,73 385,76" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.5" fill="none" opacity="0.5" strokeLinecap="round"/>
                      {/* Natural flowing brush strokes */}
                      <path d="M90,50 C105,48 120,45 135,51 C150,57 165,53 180,55 C195,57 210,54 225,58 C240,62 255,59 270,61 C285,63 300,60 315,56 C325,54 330,53 330,52" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.4" fill="none" opacity="0.3" strokeLinecap="round"/>
                      <path d="M70,140 C85,138 100,135 115,141 C130,147 145,143 160,145 C175,147 190,144 205,148 C220,152 235,149 250,151 C265,153 280,150 295,146 C305,144 310,143 310,142" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.4" fill="none" opacity="0.4" strokeLinecap="round"/>
                      <path d="M110,120 C125,118 140,115 155,121 C170,127 185,123 200,125 C215,127 230,124 245,128 C260,132 275,129 290,131 C305,133 320,130 335,126" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.3" fill="none" opacity="0.35" strokeLinecap="round"/>
                      {/* Delicate wispy strokes */}
                      <path d="M200,100 C215,98 230,95 245,101 C260,107 275,104 290,106 C295,107 300,106 300,106" 
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