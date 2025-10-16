import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import moodboardFloor from '@/assets/moodboard-floor.jpg';
import vintageFashion from '@/assets/vintage-fashion-photo.jpg';
import laptopGallery from '@/assets/laptop-with-cura-gallery.jpg';

export const HowToUse = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-12"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        <article className="space-y-32 py-8">
          {/* Hero Title */}
          <header className="text-center space-y-8 pt-12 pb-20">
            <h1 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-[0.3em]">
              How to Use
            </h1>
            <div className="w-16 h-px bg-primary/40 mx-auto"></div>
            <p className="text-sm md:text-base font-light font-lora text-foreground/70 max-w-2xl mx-auto leading-loose px-8">
              A thoughtful approach to discovering pieces that resonate with your personal aesthetic. 
              Consider this your guide to building a wardrobe that feels authentic, intentional, and entirely yours.
            </p>
          </header>

          {/* Step 1: Share */}
          <section className="max-w-6xl mx-auto px-8">
            <div className="grid md:grid-cols-7 gap-12 items-center">
              <div className="md:col-span-4 space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-bold text-burgundy uppercase tracking-[0.25em]">
                    Step One
                  </p>
                  <h3 className="text-4xl md:text-5xl font-light font-lora text-primary">
                    Share
                  </h3>
                </div>
                
                <p className="text-base font-light leading-loose font-lora text-foreground/80">
                  Create a moodboard that speaks to who you are. Upload images from Pinterest, magazines, 
                  social media, or your own wardrobe. Add notes about what you love — the drape, the silhouette, 
                  the feeling it evokes.
                </p>
                
                <p className="text-base font-light leading-loose font-lora text-foreground/80">
                  Don't forget to visit "My Style" to select your style categories and dream brands.
                </p>
              </div>

              <div className="md:col-span-3 relative">
                <img 
                  src={moodboardFloor} 
                  alt="Fashion moodboard inspiration photos" 
                  className="w-full h-auto"
                />
                <img 
                  src={vintageFashion} 
                  alt="Vintage fashion inspiration" 
                  className="absolute -bottom-6 -left-4 w-32 h-32 object-cover shadow-lg"
                />
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="w-16 h-px bg-primary/20 mx-auto"></div>

          {/* Step 2: Discover */}
          <section className="max-w-7xl mx-auto px-8">
            <div className="space-y-12">
              <div className="space-y-3">
                <p className="text-xs font-bold text-burgundy uppercase tracking-[0.25em]">
                  Step Two
                </p>
                <h3 className="text-4xl md:text-5xl font-light font-lora text-primary">
                  Discover
                </h3>
              </div>

              <div className="w-full">
                <img 
                  src={laptopGallery} 
                  alt="Cura Gallery on laptop" 
                  className="w-full h-auto"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">
                    AI-Powered Search
                  </h4>
                  <p className="text-base font-light font-lora text-foreground/70 leading-loose">
                    Let our AI search across multiple resale platforms, considering your visual preferences 
                    and brand selections to deliver curated results instantly.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">
                    Connect with Thrifters
                  </h4>
                  <p className="text-base font-light font-lora text-foreground/70 leading-loose">
                    Browse professional thrifters and stylists who share your aesthetic. Message them 
                    directly for personalized secondhand shopping.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="w-16 h-px bg-primary/20 mx-auto"></div>

          {/* Step 3: Curate */}
          <section className="max-w-4xl mx-auto px-8">
            <div className="space-y-10 text-center">
              <div className="space-y-3">
                <p className="text-xs font-bold text-burgundy uppercase tracking-[0.25em]">
                  Step Three
                </p>
                <h3 className="text-4xl md:text-5xl font-light font-lora text-primary">
                  Curate
                </h3>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-6">
                <p className="text-base font-light leading-loose font-lora text-foreground/80">
                  Your results arrive as a carefully curated edit — pieces that don't just match your 
                  inspiration, but understand the intention behind it.
                </p>

                <p className="text-base font-light leading-loose font-lora text-foreground/80">
                  Browse through your selection. Save pieces that resonate. Message thrifters for more 
                  information. This is the beginning of a conversation, not the end of a search.
                </p>

                <p className="text-lg font-light leading-loose font-lora text-primary italic pt-6">
                  From abstract inspiration to concrete wardrobe — pieces that feel authentic and entirely yours.
                </p>
              </div>
            </div>
          </section>

          {/* Closing */}
          <footer className="text-center py-20 pb-32">
            <p className="text-xs font-light font-lora text-foreground/40 uppercase tracking-wider mb-8">
              Ready to begin?
            </p>
            <Button
              variant="cta"
              size="lg"
              onClick={() => navigate('/')}
              className="uppercase tracking-wider"
            >
              Start Your Journey
            </Button>
          </footer>
        </article>
      </div>
    </div>
  );
};
