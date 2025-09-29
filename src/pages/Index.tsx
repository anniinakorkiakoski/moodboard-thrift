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
                {/* Continuous burgundy shape with artistic landscape details */}
                <div className="flex-1 h-80 bg-accent-foreground relative overflow-hidden">
                  {/* Subtle artistic landscape layer */}
                  <div className="absolute inset-0 opacity-15">
                    <svg className="w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none">
                      {/* Abstract mountain silhouettes */}
                      <path d="M0,200 Q100,150 200,180 Q300,120 400,160 L400,320 L0,320 Z" 
                            fill="hsl(330 80% 70%)" opacity="0.3"/>
                      <path d="M0,220 Q150,180 250,200 Q350,150 400,180 L400,320 L0,320 Z" 
                            fill="hsl(330 60% 75%)" opacity="0.2"/>
                      {/* Cloud-like brushstrokes */}
                      <ellipse cx="80" cy="80" rx="40" ry="15" fill="hsl(330 70% 80%)" opacity="0.15"/>
                      <ellipse cx="200" cy="60" rx="60" ry="20" fill="hsl(330 70% 80%)" opacity="0.12"/>
                      <ellipse cx="320" cy="90" rx="45" ry="18" fill="hsl(330 70% 80%)" opacity="0.13"/>
                      {/* Textural brush marks */}
                      <path d="M50,40 Q120,35 180,45 Q240,50 300,42" 
                            stroke="hsl(330 60% 75%)" strokeWidth="2" fill="none" opacity="0.1"/>
                      <path d="M30,140 Q90,135 160,145 Q220,150 280,142" 
                            stroke="hsl(330 60% 75%)" strokeWidth="1.5" fill="none" opacity="0.08"/>
                    </svg>
                  </div>
                  {/* Canvas texture overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.02] to-transparent"></div>
                </div>
                
                {/* Center logo area with same background and artistic details */}
                <div className="w-80 h-80 bg-accent-foreground flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                  {/* Subtle artistic landscape layer for center */}
                  <div className="absolute inset-0 opacity-12">
                    <svg className="w-full h-full" viewBox="0 0 320 320" preserveAspectRatio="none">
                      {/* Centered mountain silhouettes */}
                      <path d="M0,200 Q80,160 160,180 Q240,140 320,160 L320,320 L0,320 Z" 
                            fill="hsl(330 80% 70%)" opacity="0.25"/>
                      {/* Delicate cloud forms */}
                      <ellipse cx="160" cy="70" rx="50" ry="18" fill="hsl(330 70% 80%)" opacity="0.1"/>
                      {/* Subtle brush textures */}
                      <path d="M40,60 Q100,55 180,65 Q240,70 280,62" 
                            stroke="hsl(330 60% 75%)" strokeWidth="1" fill="none" opacity="0.06"/>
                    </svg>
                  </div>
                  {/* Canvas texture overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.02] to-transparent"></div>
                  <h1 className="text-8xl md:text-9xl font-black text-burgundy-foreground leading-none text-center tracking-tighter relative z-10">
                    CURA
                  </h1>
                </div>
                
                {/* Right burgundy extension with artistic details */}
                <div className="flex-1 h-80 bg-accent-foreground relative overflow-hidden">
                  {/* Subtle artistic landscape layer */}
                  <div className="absolute inset-0 opacity-15">
                    <svg className="w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none">
                      {/* Abstract mountain silhouettes */}
                      <path d="M0,160 Q100,120 200,140 Q300,180 400,200 L400,320 L0,320 Z" 
                            fill="hsl(330 80% 70%)" opacity="0.3"/>
                      <path d="M0,180 Q150,150 250,170 Q350,200 400,220 L400,320 L0,320 Z" 
                            fill="hsl(330 60% 75%)" opacity="0.2"/>
                      {/* Cloud-like brushstrokes */}
                      <ellipse cx="120" cy="85" rx="45" ry="17" fill="hsl(330 70% 80%)" opacity="0.14"/>
                      <ellipse cx="280" cy="65" rx="55" ry="22" fill="hsl(330 70% 80%)" opacity="0.11"/>
                      <ellipse cx="350" cy="95" rx="40" ry="16" fill="hsl(330 70% 80%)" opacity="0.12"/>
                      {/* Textural brush marks */}
                      <path d="M100,45 Q170,40 240,50 Q310,55 370,47" 
                            stroke="hsl(330 60% 75%)" strokeWidth="2" fill="none" opacity="0.1"/>
                      <path d="M80,145 Q140,140 210,150 Q270,155 340,147" 
                            stroke="hsl(330 60% 75%)" strokeWidth="1.5" fill="none" opacity="0.08"/>
                    </svg>
                  </div>
                  {/* Canvas texture overlay */}
                  <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/[0.02] to-transparent"></div>
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