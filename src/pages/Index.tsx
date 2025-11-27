import { useState, useEffect } from 'react';
import { SourceChain } from '@/components/SourceChain';
import { AllPlatformsDialog } from '@/components/AllPlatformsDialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import notecardStack from '@/assets/notecard-stack.png';

const Index = () => {
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  const [visibleLetters, setVisibleLetters] = useState(0);

  // Typewriter animation for CURA title
  useEffect(() => {
    const letters = 'CURA'.length;
    let currentLetter = 0;
    
    const interval = setInterval(() => {
      if (currentLetter <= letters) {
        setVisibleLetters(currentLetter);
        currentLetter++;
      } else {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center relative overflow-hidden py-20 pt-32">
        <div className="w-full px-0">
            <div className="text-center space-y-24 mb-32">
              <div className="mt-16 flex justify-center w-full px-8">
                <div className="relative inline-block">
                  {/* Top line */}
                  <div className="w-full h-1 bg-burgundy -mb-3"></div>
                  
                  {/* CURA title with kerning-preserving typewriter animation */}
                  <h1 className="hero-logo text-[10rem] md:text-[12rem] font-display font-black text-burgundy leading-none text-center tracking-tight overflow-hidden">
                    {"CURA".slice(0, visibleLetters)}
                  </h1>
                  
                  {/* Bottom line */}
                  <div className="w-full h-1 bg-burgundy mt-0.5"></div>
                </div>
              </div>
              <div className="px-8 py-16">
                <p className="text-sm md:text-base font-light text-foreground/70 max-w-lg mx-auto leading-loose text-center">
                  Upload your style inspiration, and let AI and professional thrifters and stylists find the perfect secondhand pieces from across multiple platforms.
                </p>
                <p className="text-xs md:text-sm font-light text-foreground/60 max-w-md mx-auto mt-6 text-center italic">
                  Sustainable fashion, curated for you.
                </p>
              </div>
            </div>

            {/* Sourcing From Section */}
            <div className="py-12 bg-background">
              <div className="container mx-auto px-8">
                <div className="text-center space-y-6 mb-12">
                  <h2 className="text-2xl md:text-3xl font-black text-primary uppercase tracking-[0.3em]">SOURCING FROM</h2>
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

        </div>
      </section>

      {/* The Process */}
      <section className="pt-8 pb-32 bg-background">
        <div className="container mx-auto px-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Section title */}
            <div className="text-center mb-24 space-y-6">
              <h2 className="text-2xl md:text-3xl font-black text-primary uppercase tracking-[0.3em]">THE PROCESS</h2>
              <div className="w-16 h-px bg-primary/40 mx-auto"></div>
              <p className="text-sm md:text-base font-light text-foreground/70 leading-loose">
                Three simple steps to curate your perfect wardrobe
              </p>
            </div>

            {/* Process Steps - Real Note Card with overlay */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              
              {/* Step 1 */}
              <div className="group relative h-[350px] process-card">
                <img 
                  src={notecardStack} 
                  alt="Note card" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="flex flex-col items-center text-center space-y-4 pt-6">
                    <div className="w-10 h-10 bg-burgundy flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-sm font-medium text-burgundy-foreground">01</span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">SHARE</h3>
                      <p className="text-xs font-light text-foreground/70 leading-relaxed font-mono">
                        Upload your style inspiration — mood boards, outfit photos, or curated imagery that speaks to your aesthetic vision.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative h-[350px] process-card">
                <img 
                  src={notecardStack} 
                  alt="Note card" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="flex flex-col items-center text-center space-y-4 pt-6">
                    <div className="w-10 h-10 bg-burgundy flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-sm font-medium text-burgundy-foreground">02</span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">DISCOVER</h3>
                      <p className="text-xs font-light text-foreground/70 leading-relaxed font-mono">
                        Our AI carefully searches through premium secondhand platforms to find pieces that match your unique vision.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative h-[350px] process-card">
                <img 
                  src={notecardStack} 
                  alt="Note card" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="flex flex-col items-center text-center space-y-4 pt-6">
                    <div className="w-10 h-10 bg-burgundy flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-sm font-medium text-burgundy-foreground">03</span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">CURATE</h3>
                      <p className="text-xs font-light text-foreground/70 leading-relaxed font-mono">
                        Review your personalized collection and make thoughtful additions to build your perfect wardrobe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Read More Link */}
            <div className="text-center mt-16">
              <Link 
                to="/how-to-use"
                className="text-sm font-light text-foreground/70 hover:text-foreground uppercase tracking-widest transition-colors duration-300 underline underline-offset-4 font-mono"
              >
                Read more about the process
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-8">
          <div className="text-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-wider">
                Ready to Begin Your CURA Journey?
              </h2>
              <div className="w-24 h-px bg-burgundy mx-auto"></div>
              <p className="text-sm md:text-base font-light text-foreground/60 max-w-lg mx-auto leading-loose">
                Start building your curated secondhand wardrobe today
              </p>
            </div>
            
            <Link to="/gallery">
              <Button
                variant="cta"
                size="xl"
                className="uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Enter CURA Gallery
              </Button>
            </Link>
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