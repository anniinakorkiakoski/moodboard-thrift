import moodboardFloor from '@/assets/moodboard-floor.jpg';
import vintageFashion from '@/assets/vintage-fashion-photo.jpg';

import notecardStack from '@/assets/notecard-stack.png';
import shareCouple from '@/assets/share-couple.jpg';
import curaLogo from '@/assets/cura-logo.png';
import shareVintage from '@/assets/share-vintage.jpg';
import laptopPhoto from '@/assets/laptop-floor-source.png';
import curaScreen from '@/assets/cura-gallery-screenshot-exact.png';
import { Navigation } from '@/components/Navigation';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const HowToUse = () => {
  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      <Navigation />
      
      <div className="container mx-auto px-8 py-12 max-w-7xl pt-32">
        {/* Hero Section */}
        <section className="py-16 mb-24">
          <h1 className="text-7xl md:text-8xl font-bold text-burgundy tracking-tight mb-8 uppercase">
            how to use
          </h1>
          <p className="text-base text-foreground/70 max-w-2xl leading-relaxed">
            A thoughtful approach to discovering pieces that resonate with your personal aesthetic. 
            Building a wardrobe that feels authentic, intentional, and entirely yours.
          </p>
        </section>

        {/* Step 1: Share */}
        <section className="py-24 border-t border-foreground/10">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Left side - Text */}
            <div className="md:col-span-5 space-y-8">
              <div className="flex items-start gap-8">
                <div className="text-[120px] md:text-[160px] font-bold text-burgundy leading-none">
                  1.
                </div>
                <div className="pt-8">
                  <h2 className="text-5xl md:text-6xl font-bold text-burgundy mb-6 uppercase tracking-tight">
                    share
                  </h2>
                  <div className="w-12 h-12 rounded-full bg-burgundy mt-4"></div>
                </div>
              </div>
              
              <div className="space-y-6 text-base leading-relaxed text-foreground/70 pl-4">
                <p>
                  Create a moodboard that speaks to who you are. Upload images from Pinterest, magazines, 
                  social media, or your own wardrobe.
                </p>
                <p>
                  Add notes about what you love — the drape, the silhouette, the feeling it evokes. 
                  Visit "My Style" to select your style categories and dream brands.
                </p>
              </div>
            </div>

            {/* Right side - Images */}
            <div className="md:col-span-6 md:col-start-7 relative h-[500px]">
              <div className="absolute top-0 left-0 w-64 h-80 overflow-hidden shadow-xl">
                <img src={shareCouple} alt="Fashion inspiration" className="w-full h-full object-cover" />
              </div>

              <div className="absolute bottom-0 right-0 w-56 h-72 overflow-hidden shadow-xl">
                <img src={shareVintage} alt="Vintage fashion" className="w-full h-full object-cover" />
              </div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-burgundy"></div>
            </div>
          </div>
        </section>

        {/* Step 2: Discover */}
        <section className="py-24 border-t border-foreground/10">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Left side - Image */}
            <div className="md:col-span-6 relative">
              <img src={laptopPhoto} alt="Laptop with CURA interface" className="w-full h-auto shadow-xl" />
              <img
                src={curaScreen}
                alt="CURA Gallery interface"
                className="absolute pointer-events-none"
                style={{
                  top: '6.2%',
                  left: '17.4%',
                  width: '65.0%',
                  transform: 'skewY(-5.4deg) rotate(-1.2deg) perspective(1200px) rotateX(9deg)',
                  transformOrigin: 'top left',
                }}
              />
              <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-burgundy"></div>
            </div>

            {/* Right side - Text */}
            <div className="md:col-span-5 md:col-start-8 space-y-8">
              <div className="flex items-start gap-8">
                <div className="text-[120px] md:text-[160px] font-bold text-burgundy leading-none">
                  2.
                </div>
                <div className="pt-8">
                  <h2 className="text-5xl md:text-6xl font-bold text-burgundy mb-6 uppercase tracking-tight">
                    discover
                  </h2>
                </div>
              </div>

              <div className="space-y-6 text-base leading-relaxed text-foreground/70 pl-4">
                <p>
                  Let our AI search across multiple resale platforms, considering your visual preferences 
                  and brand selections to deliver curated results instantly.
                </p>
                
                <div className="space-y-4 pt-4">
                  <div>
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
                      AI-Powered
                    </h3>
                    <p className="text-sm text-foreground/60">
                      Intelligent search that understands your aesthetic.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
                      Human Touch
                    </h3>
                    <p className="text-sm text-foreground/60">
                      Connect with professional thrifters who share your style.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 3: Curate */}
        <section className="py-24 border-t border-foreground/10">
          <div className="grid md:grid-cols-12 gap-12">
            {/* Left side - Text */}
            <div className="md:col-span-6 space-y-8">
              <div className="flex items-start gap-8">
                <div className="text-[120px] md:text-[160px] font-bold text-burgundy leading-none">
                  3.
                </div>
                <div className="pt-8">
                  <h2 className="text-5xl md:text-6xl font-bold text-burgundy mb-6 uppercase tracking-tight">
                    curate
                  </h2>
                  <div className="w-12 h-12 rounded-full bg-burgundy mt-4"></div>
                </div>
              </div>

              <div className="space-y-6 text-base leading-relaxed text-foreground/70 pl-4">
                <p>
                  Your results arrive as a carefully curated edit — pieces that don't just match your 
                  inspiration, but understand the intention behind it.
                </p>

                <p>
                  Browse through your selection. Save pieces that resonate. Message thrifters for more 
                  information. This is the beginning of a conversation, not the end of a search.
                </p>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="md:col-span-5 md:col-start-8 relative">
              <div className="relative h-96 overflow-hidden shadow-xl">
                <img src={vintageFashion} alt="Curated fashion piece" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className="py-32 text-center border-t border-foreground/10">
          <div className="space-y-8">
            <p className="text-2xl text-foreground/80 italic max-w-2xl mx-auto leading-relaxed">
              From abstract inspiration to concrete wardrobe — pieces that feel authentic and entirely yours.
            </p>
            
            <Link to="/">
              <Button
                variant="default"
                size="lg"
                className="uppercase tracking-wider mt-8 bg-burgundy hover:bg-burgundy/90 text-burgundy-foreground px-12 py-6 text-base"
              >
                start your journey
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};