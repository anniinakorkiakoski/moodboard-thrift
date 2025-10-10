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
            <p className="text-sm md:text-base font-light font-lora text-foreground/70 max-w-2xl mx-auto leading-loose px-8">
              A thoughtful approach to discovering pieces that resonate with your personal aesthetic. 
              Consider this your guide to building a wardrobe that feels authentic, intentional, and entirely yours.
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
              The first step in your style journey begins with sharing what moves you. Think of your Inspiration Gallery 
              as a visual diary — a collection of images that capture not just what you like, but why you're drawn to 
              certain aesthetics, silhouettes, and moods. Every photograph you upload becomes part of a larger conversation 
              between you and our platform, teaching the algorithm to understand the subtle nuances of your taste.
            </p>
            
            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
              As you build this collection, you'll begin to see patterns emerge — perhaps you're drawn to clean lines 
              and architectural shapes, or maybe there's a recurring softness in the textures you choose. These visual 
              threads become the foundation of your personal style language.
            </p>
            
            <aside className="bg-burgundy/5 p-8 border-l-2 border-burgundy">
              <p className="text-xs font-light text-foreground/60 mb-3 uppercase tracking-wider font-lora">
                The question we'll ask:
              </p>
              <p className="text-base md:text-lg font-light font-lora text-primary italic">
                "What do you love about this?"
              </p>
              <p className="text-xs font-light font-lora text-foreground/60 mt-4 leading-relaxed">
                Your words matter as much as your images. Whether it's the drape of a sleeve, the confidence of a 
                silhouette, or simply the feeling a piece evokes — these notes become the emotional compass guiding 
                your search. They transform visual preference into something deeper: a reflection of who you are and 
                how you want to feel in what you wear.
              </p>
            </aside>

            <div className="space-y-4 pt-4">
              <p className="text-xs font-light font-lora text-foreground/60 uppercase tracking-wider">
                Refining your profile:
              </p>
              <div className="space-y-4 text-sm font-light font-lora text-foreground/70 leading-loose">
                <p>
                  Visit the "My Style" section regularly to keep your preferences current. As your taste evolves, 
                  so should your profile — this is a living document of your aesthetic journey.
                </p>
                <p>
                  Choose from our curated style categories or create your own. Perhaps you're drawn to "effortless 
                  minimalism" one season and "romantic maximalism" the next. Both are valid, both are you.
                </p>
                <p>
                  Select your dream brands thoughtfully. These aren't just labels — they're shorthand for quality, 
                  craftsmanship, and design philosophies that align with your values. They help us understand not 
                  just what you like, but what you aspire to wear.
                </p>
              </div>
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
              Here's where intuition meets creativity. Your Cura Gallery is more than a collection — it's a mood, 
              a feeling, a visual manifesto of your ideal wardrobe. Think of yourself as both editor and stylist, 
              curating a spread that could grace the pages of your favorite magazine.
            </p>
            
            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
              Draw inspiration from everywhere and anywhere:
            </p>
            
            <ul className="space-y-3 text-sm font-light font-lora text-foreground/70 leading-loose pl-6">
              <li>That perfectly composed Pinterest board you return to again and again</li>
              <li>Editorial spreads torn from magazines, saved for their artistic vision</li>
              <li>Screenshots from social media — street style that stopped you mid-scroll</li>
              <li>Photographs of your own wardrobe's greatest hits, the pieces you reach for instinctively</li>
              <li>Runway moments that redefined your understanding of a silhouette</li>
              <li>Vintage finds that speak to a different era's elegance</li>
            </ul>

            <aside className="py-12">
              <blockquote className="text-center">
                <p className="text-lg md:text-xl font-light font-lora text-primary italic leading-relaxed max-w-xl mx-auto">
                  Imagine you're styling your dream wardrobe, one carefully chosen image at a time. 
                  This is your vision board brought to life.
                </p>
              </blockquote>
            </aside>

            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
              As you arrange these images, patterns will emerge naturally. Colors that complement each other, 
              textures that tell a story, proportions that feel inherently right. This moodboard becomes more 
              than inspiration — it's a blueprint for the wardrobe you're meant to have. The platform learns 
              not just from individual images, but from how they relate to one another, understanding the 
              aesthetic ecosystem you're creating.
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
              This is the moment your vision transforms into possibility. With your gallery complete and your 
              preferences refined, a single click initiates an intelligent search across the resale landscape. 
              What follows is more than matching — it's an understanding, a translation of your aesthetic 
              language into tangible pieces waiting to be discovered.
            </p>
            
            <div className="bg-burgundy/5 p-8 space-y-4 border-l-2 border-burgundy">
              <p className="text-sm font-light font-lora text-foreground/70 leading-loose">
                Our AI works thoughtfully, searching across carefully selected resale platforms to find pieces 
                that align with your aesthetic DNA. The algorithm considers multiple dimensions simultaneously:
              </p>
              <div className="space-y-3 text-sm font-light font-lora text-foreground/60 leading-loose pl-6">
                <p>
                  The visual language of your inspiration images — colors, silhouettes, proportions, and the 
                  intangible quality that makes something feel right
                </p>
                <p>
                  The emotional context from your notes and reflections, understanding not just what you see 
                  but why it resonates
                </p>
                <p>
                  Your selected brands and style categories, ensuring recommendations align with your quality 
                  standards and design preferences
                </p>
                <p>
                  The relationships between pieces, suggesting items that would naturally complement what 
                  you've already shown interest in
                </p>
              </div>
            </div>

            <aside className="py-12">
              <div className="text-center space-y-4 max-w-lg mx-auto">
                <p className="text-base md:text-lg font-medium font-lora text-primary">
                  Your style edit awaits
                </p>
                <p className="text-sm font-light font-lora text-foreground/50 leading-relaxed">
                  There's a particular satisfaction in finding exactly what you've been searching for — 
                  sometimes before you even knew you were looking for it. That's the moment we're creating here.
                </p>
              </div>
            </aside>

            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70 text-center">
              This is your curated style journey — from abstract inspiration to concrete wardrobe. We're not just 
              helping you find clothes; we're helping you discover pieces that don't just look good, but feel 
              authentic. Pieces that make you stand a little taller, that integrate seamlessly into your life, 
              that feel like they were made for the person you are and the person you're becoming.
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
