import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Sparkles, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowToUse = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-[0.2em]">
              How to Use Loveable
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your personal guide to discovering pieces that truly speak to your style
            </p>
          </div>

          {/* Step 1: Share */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-primary uppercase tracking-wider">
                  1. Share
                </h2>
                <p className="text-xl text-muted-foreground">Be a Good Sharer ✨</p>
              </div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border-2 border-foreground/10 p-8 space-y-4">
              <p className="text-foreground leading-relaxed">
                Build your <span className="font-semibold">Inspiration Gallery</span> by uploading images that speak to your taste. 
                Each piece you share helps us understand your unique style language.
              </p>
              
              <div className="bg-background/50 p-6 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">When you add an image:</p>
                <p className="text-lg font-medium text-foreground italic">
                  "What do you love about this?"
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  These notes act as personal reflections and help our algorithm understand your core style preferences.
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <p className="font-semibold text-foreground">Get the most from your profile:</p>
                <ul className="space-y-2 text-muted-foreground pl-6">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Keep your profile updated in the <span className="font-medium text-foreground">"My Style"</span> section</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Use existing style categories or add your own custom ones</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Select and save your dream brands to fine-tune recommendations</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-primary/70 italic pt-2">
                The vibe: personal, expressive, and intuitive — a way to teach the system who you are through what you love.
              </p>
            </div>
          </section>

          {/* Step 2: Discover */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-primary uppercase tracking-wider">
                  2. Discover
                </h2>
                <p className="text-xl text-muted-foreground">Build Your Dream Moodboard 🌿</p>
              </div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border-2 border-foreground/10 p-8 space-y-4">
              <p className="text-foreground leading-relaxed">
                Let your creativity flow. Gather inspiration from everywhere:
              </p>
              
              <ul className="space-y-2 text-muted-foreground pl-6">
                <li className="flex items-start">
                  <span className="mr-2">✦</span>
                  <span>Pinterest pins that catch your eye</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✦</span>
                  <span>Fashion magazine clippings and editorial spreads</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✦</span>
                  <span>Screenshots from Instagram, TikTok, or your favorite style influencers</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✦</span>
                  <span>Photos of your own favorite outfits</span>
                </li>
              </ul>

              <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-lg border border-primary/20 mt-6">
                <p className="text-lg font-medium text-foreground text-center">
                  "Imagine you're your own stylist — build the wardrobe of your dreams, one image at a time."
                </p>
              </div>

              <p className="text-foreground leading-relaxed pt-2">
                Upload these into your <span className="font-semibold">Cura Gallery</span>, arranging them into a moodboard — 
                a digital collage that visualizes your dream style. This is where your aesthetic vision comes to life.
              </p>
            </div>
          </section>

          {/* Step 3: Curate */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-primary uppercase tracking-wider">
                  3. Curate
                </h2>
                <p className="text-xl text-muted-foreground">Find Your Perfect Pieces 👗</p>
              </div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border-2 border-foreground/10 p-8 space-y-4">
              <p className="text-foreground leading-relaxed">
                Once your gallery is ready, click the <span className="font-semibold">Search</span> button. 
                This is where the magic happens.
              </p>
              
              <div className="bg-background/50 p-6 rounded-lg border border-secondary/20 space-y-3">
                <p className="text-foreground">
                  Loveable's AI searches across multiple resale platforms, finding wardrobe pieces that match:
                </p>
                <ul className="space-y-2 text-muted-foreground pl-6">
                  <li className="flex items-start">
                    <span className="mr-2">→</span>
                    <span>Your visual style preferences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">→</span>
                    <span>The notes and reflections you've shared</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">→</span>
                    <span>Your selected dream brands</span>
                  </li>
                </ul>
              </div>

              <div className="text-center py-6">
                <div className="inline-block bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 px-8 py-4 rounded-lg border-2 border-primary/20">
                  <p className="text-lg font-semibold text-foreground">
                    ✨ Your style edit awaits ✨
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    That "aha!" moment when you discover pieces that truly fit who you are
                  </p>
                </div>
              </div>

              <p className="text-foreground leading-relaxed italic">
                This is your curated style journey — from inspiration to wardrobe, 
                helping you find pieces that don't just look good, but feel like <span className="font-semibold">you</span>.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center pt-8 pb-16">
            <Link to="/">
              <Button size="xl" variant="cta" className="uppercase tracking-wider">
                Start Your Style Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
