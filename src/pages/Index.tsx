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
                  <h1 className="text-[10rem] md:text-[12rem] font-display font-black text-burgundy leading-none text-center tracking-tight overflow-hidden">
                    {"CURA".slice(0, visibleLetters)}
                  </h1>
                  
                  {/* Bottom line */}
                  <div className="w-full h-1 bg-burgundy mt-0.5"></div>
                </div>
              </div>
              <div className="px-8 py-16">
                <p className="text-sm md:text-base font-light text-foreground/70 max-w-lg mx-auto leading-loose font-mono text-center">
                  Upload your style inspiration, and let AI and professional thrifters and stylists find the perfect secondhand pieces from across multiple platforms.
                </p>
                <p className="text-xs md:text-sm font-light text-foreground/60 max-w-md mx-auto mt-6 font-mono text-center italic">
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
                  <p className="text-sm font-light text-foreground/60 tracking-wide font-mono">
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
      <section className="pt-8 pb-32 bg-[#f5f1eb] relative overflow-hidden">
        <div className="container mx-auto px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Section title */}
            <div className="text-center mb-24 space-y-6">
              <h2 className="text-4xl md:text-6xl font-serif italic text-burgundy leading-tight">
                From moodboard to wardrobe.
              </h2>
            </div>

            {/* Visual Flow Diagram */}
            <div className="relative" style={{ minHeight: '500px' }}>
              {/* Background Numbers - positioned absolutely */}
              <div className="absolute left-[5%] top-[15%] text-[12rem] md:text-[16rem] font-black text-foreground/[0.03] leading-none pointer-events-none">01</div>
              <div className="absolute left-1/2 -translate-x-1/2 top-[5%] text-[12rem] md:text-[16rem] font-black text-foreground/[0.03] leading-none pointer-events-none">02</div>
              <div className="absolute right-[5%] top-[15%] text-[12rem] md:text-[16rem] font-black text-foreground/[0.03] leading-none pointer-events-none">03</div>

              {/* SVG Connection Lines - Diamond Pattern */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ height: '500px' }}>
                {/* Top left to top center */}
                <line x1="20%" y1="40%" x2="50%" y2="20%" stroke="#9b4444" strokeWidth="3" />
                {/* Top center to top right */}
                <line x1="50%" y1="20%" x2="80%" y2="40%" stroke="#9b4444" strokeWidth="3" />
                {/* Top left to bottom center */}
                <line x1="20%" y1="40%" x2="50%" y2="60%" stroke="#9b4444" strokeWidth="3" />
                {/* Bottom center to top right */}
                <line x1="50%" y1="60%" x2="80%" y2="40%" stroke="#9b4444" strokeWidth="3" />
                
                {/* Connection dots */}
                <circle cx="20%" cy="40%" r="8" fill="#9b4444" />
                <circle cx="50%" cy="20%" r="8" fill="#9b4444" />
                <circle cx="50%" cy="60%" r="8" fill="#9b4444" />
                <circle cx="80%" cy="40%" r="8" fill="#9b4444" />
              </svg>

              {/* Step Cards - Absolute Positioning */}
              <div className="relative" style={{ height: '500px' }}>
                
                {/* Step 1 - Left */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[280px]">
                  <div className="bg-white/60 backdrop-blur-sm p-10 border border-foreground/10 shadow-sm">
                    <p className="text-base font-mono text-foreground/90 leading-relaxed text-center">
                      upload your<br />
                      style<br />
                      inspiration
                    </p>
                  </div>
                </div>

                {/* Step 2a - Top Center */}
                <div className="absolute left-1/2 -translate-x-1/2 top-[8%] w-[280px]">
                  <div className="bg-white/60 backdrop-blur-sm p-10 border border-foreground/10 shadow-sm">
                    <p className="text-base font-mono text-foreground/90 leading-relaxed text-center">
                      use AI<br />
                      search
                    </p>
                  </div>
                </div>

                {/* Step 2b - Bottom Center */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[8%] w-[280px]">
                  <div className="bg-white/60 backdrop-blur-sm p-10 border border-foreground/10 shadow-sm">
                    <p className="text-base font-mono text-foreground/90 leading-relaxed text-center">
                      hire a human<br />
                      stylist
                    </p>
                  </div>
                </div>

                {/* Step 3 - Right */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[280px]">
                  <div className="bg-white/60 backdrop-blur-sm p-10 border border-foreground/10 shadow-sm">
                    <p className="text-base font-mono text-foreground/90 leading-relaxed text-center">
                      make<br />
                      thoughtful<br />
                      purchases
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Read More Link */}
            <div className="text-center mt-24">
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
              <p className="text-sm md:text-base font-light text-foreground/60 max-w-lg mx-auto leading-loose font-mono">
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