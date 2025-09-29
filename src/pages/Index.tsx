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
          <div className="text-center space-y-16 mb-32">
            <div className="mt-16 flex justify-center w-full">
              <div className="flex items-center w-full max-w-[2000px]">
                {/* Left burgundy extension with artistic linework */}
                <div className="flex-1 h-80 bg-accent-foreground relative overflow-hidden min-w-0">
                  {/* Subtle artistic line work */}
                  <div className="absolute inset-0 opacity-18">
                    <svg className="w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none">
                      {/* Realistic puffy cloud formations - positioned well above mountains */}
                      <path d="M35,65 Q45,58 55,60 Q65,62 70,55 Q75,48 85,50 Q95,52 100,58 Q105,64 115,62 Q125,60 130,65 Q135,70 140,65 Q145,60 150,62 Q155,64 158,60" 
                            stroke="hsl(330 60% 75%)" strokeWidth="1.2" fill="none" opacity="0.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M80,85 Q92,78 104,82 Q116,86 125,80 Q134,74 146,78 Q158,82 168,77 Q178,72 188,76 Q198,80 205,76" 
                            stroke="hsl(330 60% 75%)" strokeWidth="1" fill="none" opacity="0.45" strokeLinecap="round" strokeLinejoin="round"/>
                      
                      {/* Small wispy clouds higher up */}
                      <path d="M120,40 Q130,36 140,38 Q150,40 158,36 Q166,32 174,36 Q182,40 188,37" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.8" fill="none" opacity="0.4" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M260,60 Q272,55 284,58 Q296,61 306,56 Q316,51 326,55 Q336,59 343,56" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.9" fill="none" opacity="0.42" strokeLinecap="round" strokeLinejoin="round"/>
                      
                      {/* Organic mountain silhouettes - positioned lower, well separated from clouds */}
                      <path d="M0,220 C18,208 32,185 48,178 C64,171 78,192 94,198 C110,204 128,175 148,168 C168,161 186,180 206,188 C226,196 246,165 270,158 C294,151 314,172 334,166 C354,160 372,150 388,145 C394,143 397,142 400,141" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.8" fill="none" opacity="0.85" strokeLinecap="round"/>
                      <path d="M0,238 C22,228 38,210 58,204 C78,198 96,215 116,222 C136,229 158,205 178,198 C198,191 218,208 242,216 C266,224 288,198 312,191 C336,184 356,201 378,195 C388,192 394,190 400,188" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.6" fill="none" opacity="0.7" strokeLinecap="round"/>
                      <path d="M0,254 C28,246 44,232 68,227 C88,222 108,236 128,241 C148,246 168,228 188,223 C208,218 228,233 252,238 C276,243 296,223 320,218 C344,213 364,228 386,223 C392,222 396,221 400,220" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.5" fill="none" opacity="0.6" strokeLinecap="round"/>
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
                  {/* Subtle artistic line work - MIRRORED from left side */}
                  <div className="absolute inset-0 opacity-18">
                    <svg className="w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none" style={{ transform: 'scaleX(-1)' }}>
                      {/* Realistic puffy cloud formations - positioned well above mountains */}
                      <path d="M35,65 Q45,58 55,60 Q65,62 70,55 Q75,48 85,50 Q95,52 100,58 Q105,64 115,62 Q125,60 130,65 Q135,70 140,65 Q145,60 150,62 Q155,64 158,60" 
                            stroke="hsl(330 60% 75%)" strokeWidth="1.2" fill="none" opacity="0.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M80,85 Q92,78 104,82 Q116,86 125,80 Q134,74 146,78 Q158,82 168,77 Q178,72 188,76 Q198,80 205,76" 
                            stroke="hsl(330 60% 75%)" strokeWidth="1" fill="none" opacity="0.45" strokeLinecap="round" strokeLinejoin="round"/>
                      
                      {/* Small wispy clouds higher up */}
                      <path d="M120,40 Q130,36 140,38 Q150,40 158,36 Q166,32 174,36 Q182,40 188,37" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.8" fill="none" opacity="0.4" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M260,60 Q272,55 284,58 Q296,61 306,56 Q316,51 326,55 Q336,59 343,56" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.9" fill="none" opacity="0.42" strokeLinecap="round" strokeLinejoin="round"/>
                      
                      {/* Organic mountain silhouettes - positioned lower, well separated from clouds */}
                      <path d="M0,220 C18,208 32,185 48,178 C64,171 78,192 94,198 C110,204 128,175 148,168 C168,161 186,180 206,188 C226,196 246,165 270,158 C294,151 314,172 334,166 C354,160 372,150 388,145 C394,143 397,142 400,141" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.8" fill="none" opacity="0.85" strokeLinecap="round"/>
                      <path d="M0,238 C22,228 38,210 58,204 C78,198 96,215 116,222 C136,229 158,205 178,198 C198,191 218,208 242,216 C266,224 288,198 312,191 C336,184 356,201 378,195 C388,192 394,190 400,188" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.6" fill="none" opacity="0.7" strokeLinecap="round"/>
                      <path d="M0,254 C28,246 44,232 68,227 C88,222 108,236 128,241 C148,246 168,228 188,223 C208,218 228,233 252,238 C276,243 296,223 320,218 C344,213 364,228 386,223 C392,222 396,221 400,220" 
                            stroke="hsl(330 60% 75%)" strokeWidth="0.5" fill="none" opacity="0.6" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center min-h-[180px]">
              <p className="text-lg font-light text-text-primary max-w-2xl mx-auto leading-relaxed font-serif px-4 text-center">
                Upload your style inspiration, and let Al find the perfect secondhand pieces from across multiple platforms.
                <br /><br />
                <span className="text-base">Sustainable fashion, curated for you.</span>
              </p>
            </div>
          </div>

          {/* Gallery Process Section */}
          <div className="py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                
                {/* Section title */}
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-black text-primary mb-4 uppercase tracking-wider">The Process</h2>
                  <p className="text-base font-light text-muted-foreground leading-relaxed uppercase tracking-wide">
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
                            <summary className="text-xs font-medium text-burgundy cursor-pointer hover:text-burgundy/80 transition-colors">
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

                {/* Call to Action */}
                <div className="text-center mt-16">
                  <p className="text-sm font-light text-muted-foreground italic uppercase tracking-wide">
                    Start by sharing your inspiration below
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Picture Feed with Sidebar */}
          <div className="relative">
            <div className="flex gap-0 relative">
              <div className="w-full pr-0 transition-all duration-500" style={{ marginRight: '33.333%' }}>
                <GalleryUpload 
                  onUpload={handleUpload}
                  onImageSearch={handleImageSearch}
                  isLoading={isSearching} 
                />
              </div>
              <div className="w-1/3 absolute right-0 top-0">
                <LibrarySidebar />
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

    </div>
  );
};

export default Index;