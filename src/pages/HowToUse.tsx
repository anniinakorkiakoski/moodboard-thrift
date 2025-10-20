import moodboardFloor from '@/assets/moodboard-floor.jpg';
import vintageFashion from '@/assets/vintage-fashion-photo.jpg';
import laptopGallery from '@/assets/laptop-with-cura-screen.jpg';
import magazineCollage from '@/assets/magazine-runway-collage.jpg';
import notecardStack from '@/assets/notecard-stack.png';
import shareCouple from '@/assets/share-couple.jpg';
import curaLogo from '@/assets/cura-logo.png';
import shareVintage from '@/assets/share-vintage.jpg';
import { Navigation } from '@/components/Navigation';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const HowToUse = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 max-w-7xl pt-32">
        
        <article className="space-y-32 py-12">
          {/* Hero Title */}
          <header className="pt-12 pb-8">
            <div className="relative">
            <h1 className="text-7xl md:text-9xl font-black text-primary tracking-tight leading-none uppercase">
              HOW_TO_<br/>USE
            </h1>
              <svg className="absolute -right-12 top-1/2 -translate-y-1/2" width="100" height="100" viewBox="0 0 100 100">
                <path 
                  d="M 20 50 L 80 50 M 80 50 L 70 40 M 80 50 L 70 60" 
                  stroke="hsl(var(--burgundy))" 
                  strokeWidth="3" 
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          <p className="text-sm md:text-base text-foreground/60 mt-8 max-w-2xl leading-loose font-mono">
            A thoughtful approach to discovering pieces that resonate with your personal aesthetic. 
            Building a wardrobe that feels authentic, intentional, and entirely yours.
            Below, each step of the process is introduced in more detail.
          </p>
          </header>

          {/* The Process - Note Cards */}
          <section className="py-16">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 space-y-6">
                <h2 className="text-2xl md:text-3xl font-black text-primary uppercase tracking-[0.3em]">THE PROCESS</h2>
                <div className="w-16 h-px bg-primary/40 mx-auto"></div>
                <p className="text-sm md:text-base font-light text-foreground/70 leading-loose font-mono">
                  Three simple steps to curate your perfect wardrobe
                </p>
              </div>

              {/* Process Steps - Real Note Card with overlay */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                
                {/* Step 1 */}
                <div className="group relative h-[280px]">
                  <img 
                    src={notecardStack} 
                    alt="Note card" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-10 h-10 bg-burgundy flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-sm font-medium text-burgundy-foreground">01</span>
                      </div>
                      <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">SHARE</h3>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group relative h-[280px]">
                  <img 
                    src={notecardStack} 
                    alt="Note card" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-10 h-10 bg-burgundy flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-sm font-medium text-burgundy-foreground">02</span>
                      </div>
                      <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">DISCOVER</h3>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group relative h-[280px]">
                  <img 
                    src={notecardStack} 
                    alt="Note card" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-10 h-10 bg-burgundy flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-sm font-medium text-burgundy-foreground">03</span>
                      </div>
                      <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">CURATE</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 1: Share */}
          <section className="py-12">
            <div className="grid md:grid-cols-12 gap-16">
              <div className="md:col-span-5 space-y-8">
                <div>
                  <div className="text-xs font-bold text-burgundy uppercase tracking-[0.3em] mb-4">
                    Stage 1
                  </div>
                  <h2 className="text-6xl font-black text-primary mb-6 relative inline-block uppercase">
                    SHARE
                    <svg className="absolute -bottom-4 left-0 w-full" height="15" viewBox="0 0 200 15">
                      <path 
                        d="M 5 10 L 195 10" 
                        stroke="hsl(var(--burgundy))" 
                        strokeWidth="2" 
                        fill="none"
                      />
                    </svg>
                  </h2>
                </div>
                
                <div className="space-y-4 text-sm md:text-base leading-loose text-foreground/70 font-mono">
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

              <div className="md:col-span-6 md:col-start-7 relative h-[600px]">
                {/* Scattered macOS-style windows */}
                
                {/* Window 1 - Top Left - Couple Photo */}
                <div className="absolute top-0 left-0 w-56 rounded-lg overflow-hidden shadow-2xl">
                  <div className="bg-gradient-to-b from-gray-300 to-gray-200 px-3 py-2 flex items-center gap-2 border-b border-gray-400/30">
                    <div className="flex items-center">
                      <div className="w-3 h-3 flex items-center justify-center">
                        <span className="text-gray-600 text-xs">×</span>
                      </div>
                    </div>
                    <div className="flex-1 text-center text-[10px] text-gray-700 font-medium">Unfold_01.jpg</div>
                  </div>
                  <img src={shareCouple} alt="Fashion inspiration" className="w-full h-64 object-cover bg-white" />
                </div>

                {/* Window 2 - Bottom Right - Vintage Fashion */}
                <div className="absolute top-56 right-0 w-60 rounded-lg overflow-hidden shadow-2xl">
                  <div className="bg-gradient-to-b from-gray-300 to-gray-200 px-3 py-2 flex items-center gap-2 border-b border-gray-400/30">
                    <div className="flex items-center">
                      <div className="w-3 h-3 flex items-center justify-center">
                        <span className="text-gray-600 text-xs">×</span>
                      </div>
                    </div>
                    <div className="flex-1 text-center text-[10px] text-gray-700 font-medium">08.jpg</div>
                  </div>
                  <img src={shareVintage} alt="Vintage fashion" className="w-full h-56 object-cover bg-white" />
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: Discover */}
          <section className="py-12">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <div className="text-xs font-bold text-burgundy uppercase tracking-[0.3em] mb-4">
                  Stage 2
                </div>
                <h2 className="text-6xl font-black text-primary mb-6 relative inline-block uppercase">
                  DISCOVER
                  <svg className="absolute -bottom-4 left-0 w-full" height="15" viewBox="0 0 200 15">
                    <path 
                      d="M 5 10 L 195 10" 
                      stroke="hsl(var(--burgundy))" 
                      strokeWidth="2" 
                      fill="none"
                    />
                  </svg>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div>
                  <img 
                    src={laptopGallery} 
                    alt="Cura Gallery interface" 
                    className="w-full h-auto shadow-lg"
                  />
                </div>

                <div className="space-y-8">
                  <div className="space-y-4 text-sm md:text-base leading-loose text-foreground/70 font-mono">
                    <p>
                      Let our AI search across multiple resale platforms, considering your visual preferences 
                      and brand selections to deliver curated results instantly.
                    </p>
                  </div>

                  <div className="space-y-6 pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-px bg-burgundy"></div>
                        <h3 className="text-lg font-bold text-primary uppercase tracking-wider">
                          AI-POWERED
                        </h3>
                      </div>
                      <p className="text-sm md:text-base leading-relaxed text-foreground/60 pl-11 font-mono">
                        Intelligent search that understands your aesthetic and finds pieces that match your vision.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-px bg-burgundy"></div>
                        <h3 className="text-lg font-bold text-primary uppercase tracking-wider">
                          HUMAN TOUCH
                        </h3>
                      </div>
                      <p className="text-sm md:text-base leading-relaxed text-foreground/60 pl-11 font-mono">
                        Connect with professional thrifters and stylists who share your aesthetic for personalized service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 3: Curate */}
          <section className="py-20">
            <div className="grid md:grid-cols-12 gap-12">
              <div className="md:col-span-5 order-2 md:order-1">
                <img 
                  src={magazineCollage} 
                  alt="Fashion curation" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="md:col-span-6 md:col-start-7 order-1 md:order-2 space-y-8">
                <div>
                  <div className="text-xs font-bold text-burgundy uppercase tracking-[0.3em] mb-4">
                    Stage 3
                  </div>
                  <div className="relative inline-block">
                    <h2 className="text-6xl font-black text-primary uppercase">
                      CURATE
                    </h2>
                    <svg className="absolute -top-6 -right-12" width="60" height="60" viewBox="0 0 60 60">
                      <path 
                        d="M 15 45 Q 30 10, 45 30 T 50 50" 
                        stroke="hsl(var(--burgundy))" 
                        strokeWidth="2.5" 
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="space-y-6 text-sm md:text-base leading-loose text-foreground/70 font-mono">
                  <p>
                    Your results arrive as a carefully curated edit — pieces that don't just match your 
                    inspiration, but understand the intention behind it.
                  </p>
                  
                  <div className="border-l-2 border-burgundy pl-6">
                    <p className="text-foreground/60">
                      Browse through your selection. Save pieces that resonate. Message thrifters for more 
                      information. This is the beginning of a conversation, not the end of a search.
                    </p>
                  </div>

                  <p className="text-lg italic text-primary pt-4">
                    From abstract inspiration to concrete wardrobe — pieces that feel authentic and entirely yours.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Closing CTA */}
          <footer className="text-center py-20 pb-32">
            <div className="space-y-8">
              <div className="relative inline-block">
                <p className="text-sm uppercase tracking-[0.3em] text-burgundy font-bold">
                  READY TO BEGIN?
                </p>
                <svg className="absolute -bottom-4 left-1/2 -translate-x-1/2" width="120" height="20" viewBox="0 0 120 20">
                  <ellipse cx="60" cy="10" rx="55" ry="8" stroke="hsl(var(--burgundy))" strokeWidth="1.5" fill="none" strokeDasharray="3,3" />
                </svg>
              </div>
              
              <Link to="/">
                <Button
                  variant="default"
                  size="lg"
                  className="uppercase tracking-wider mt-12 bg-burgundy hover:bg-burgundy/90 text-burgundy-foreground font-mono"
                >
                  start your journey
                </Button>
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};