import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
            <p className="text-sm md:text-base font-light font-lora text-foreground/70 max-w-xl mx-auto leading-loose">
              Your personal guide to discovering pieces that truly speak to your style
            </p>
          </header>

          {/* Step 1: Share */}
          <section className="max-w-2xl mx-auto space-y-12 px-8">
            <div className="space-y-6">
              <h2 className="text-xs font-bold text-primary uppercase tracking-[0.25em] text-center">
                Step One
              </h2>
              <h3 className="text-2xl md:text-3xl font-light font-lora text-primary text-center">
                Share
              </h3>
              <p className="text-sm font-light font-lora text-foreground/60 text-center">
                Be a Good Sharer
              </p>
            </div>
            
            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
              Build your Inspiration Gallery by uploading images that speak to your taste. 
              Each piece you share helps us understand your unique style language.
            </p>
            
            <aside className="bg-burgundy/5 p-8 border-l-2 border-burgundy">
              <p className="text-xs font-light text-foreground/60 mb-3 uppercase tracking-wider font-lora">
                When you add an image:
              </p>
              <p className="text-base md:text-lg font-light font-lora text-primary italic">
                "What do you love about this?"
              </p>
              <p className="text-xs font-light font-lora text-foreground/60 mt-4 leading-relaxed">
                These notes act as personal reflections and help our algorithm understand your core style preferences.
              </p>
            </aside>

            <div className="space-y-4 pt-4">
              <p className="text-xs font-light font-lora text-foreground/60 uppercase tracking-wider">
                Get the most from your profile:
              </p>
              <ul className="space-y-3 text-sm font-light font-lora text-foreground/70 leading-loose">
                <li>Keep your profile updated in the "My Style" section</li>
                <li>Use existing style categories or add your own custom ones</li>
                <li>Select and save your dream brands to fine-tune recommendations</li>
              </ul>
            </div>

            <p className="text-xs font-light font-lora text-foreground/50 italic text-center pt-8">
              Personal, expressive, and intuitive — a way to teach the system who you are through what you love.
            </p>
          </section>

          {/* Divider */}
          <div className="w-16 h-px bg-primary/20 mx-auto"></div>

          {/* Step 2: Discover */}
          <section className="max-w-2xl mx-auto space-y-12 px-8">
            <div className="space-y-6">
              <h2 className="text-xs font-bold text-primary uppercase tracking-[0.25em] text-center">
                Step Two
              </h2>
              <h3 className="text-2xl md:text-3xl font-light font-lora text-primary text-center">
                Discover
              </h3>
              <p className="text-sm font-light font-lora text-foreground/60 text-center">
                Build Your Dream Moodboard
              </p>
            </div>
            
            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
              Let your creativity flow. Gather inspiration from everywhere:
            </p>
            
            <ul className="space-y-3 text-sm font-light font-lora text-foreground/70 leading-loose pl-6">
              <li>Pinterest pins that catch your eye</li>
              <li>Fashion magazine clippings and editorial spreads</li>
              <li>Screenshots from Instagram, TikTok, or your favorite style influencers</li>
              <li>Photos of your own favorite outfits</li>
            </ul>

            <aside className="py-12">
              <blockquote className="text-center">
                <p className="text-lg md:text-xl font-light font-lora text-primary italic leading-relaxed">
                  "Imagine you're your own stylist — build the wardrobe of your dreams, one image at a time."
                </p>
              </blockquote>
            </aside>

            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
              Upload these into your Cura Gallery, arranging them into a moodboard — 
              a digital collage that visualizes your dream style. This is where your aesthetic vision comes to life.
            </p>
          </section>

          {/* Divider */}
          <div className="w-16 h-px bg-primary/20 mx-auto"></div>

          {/* Step 3: Curate */}
          <section className="max-w-2xl mx-auto space-y-12 px-8">
            <div className="space-y-6">
              <h2 className="text-xs font-bold text-primary uppercase tracking-[0.25em] text-center">
                Step Three
              </h2>
              <h3 className="text-2xl md:text-3xl font-light font-lora text-primary text-center">
                Curate
              </h3>
              <p className="text-sm font-light font-lora text-foreground/60 text-center">
                Find Your Perfect Pieces
              </p>
            </div>
            
            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
              Once your gallery is ready, click the Search button. 
              This is where the magic happens.
            </p>
            
            <div className="bg-burgundy/5 p-8 space-y-4 border-l-2 border-burgundy">
              <p className="text-sm font-light font-lora text-foreground/70 leading-loose">
                Loveable's AI searches across multiple resale platforms, finding wardrobe pieces that match:
              </p>
              <ul className="space-y-2 text-sm font-light font-lora text-foreground/60 leading-loose pl-6">
                <li>Your visual style preferences</li>
                <li>The notes and reflections you've shared</li>
                <li>Your selected dream brands</li>
              </ul>
            </div>

            <aside className="py-12">
              <div className="text-center space-y-4">
                <p className="text-base md:text-lg font-medium font-lora text-primary">
                  Your style edit awaits
                </p>
                <p className="text-xs font-light font-lora text-foreground/50">
                  Discover pieces that truly fit who you are
                </p>
              </div>
            </aside>

            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70 italic text-center">
              This is your curated style journey — from inspiration to wardrobe, 
              helping you find pieces that don't just look good, but feel like you.
            </p>
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
