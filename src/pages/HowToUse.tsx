import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import magazineCloseUp from '@/assets/magazine-close-up.jpg';
import macbookGallery from '@/assets/cura-gallery-macbook.jpg';

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

          {/* Step 1: Share - Editorial Layout */}
          <section className="max-w-6xl mx-auto px-8">
            <div className="grid md:grid-cols-12 gap-8 items-start">
              {/* Image - Left side, offset */}
              <div className="md:col-span-5 md:col-start-1 md:pt-20">
                <img 
                  src={magazineCloseUp} 
                  alt="Fashion magazine runway collage" 
                  className="w-full h-auto"
                />
                <p className="text-xs font-light text-foreground/40 mt-3 font-lora tracking-wide">
                  Editorial inspiration
                </p>
              </div>

              {/* Content - Right side, overlapping */}
              <div className="md:col-span-7 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-xs font-bold text-primary uppercase tracking-[0.25em]">
                    Step One
                  </h2>
                  <h3 className="text-3xl md:text-5xl font-light font-lora text-primary">
                    Share
                  </h3>
                  <p className="text-sm font-light font-lora text-foreground/60">
                    Build Your Visual Story
                  </p>
                </div>
                
                <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70 max-w-lg">
                  The first step in your style journey is creating a moodboard that speaks to who you are. 
                  Think of your Cura Gallery as a visual diary — a collection of images that capture not just 
                  what you like, but why you're drawn to certain aesthetics, silhouettes, and moods. This is 
                  where intuition meets expression.
                </p>
                
                <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70 max-w-lg">
                  Draw inspiration from everywhere:
                </p>

                <ul className="space-y-2 text-sm font-light font-lora text-foreground/70 leading-loose max-w-lg">
                  <li>That perfectly composed Pinterest board you return to again and again</li>
                  <li>Editorial spreads torn from magazines, saved for their artistic vision</li>
                  <li>Screenshots from social media — street style that stopped you mid-scroll</li>
                  <li>Photographs of your own wardrobe's greatest hits, the pieces you reach for instinctively</li>
                  <li>Runway moments that redefined your understanding of a silhouette</li>
                  <li>Vintage finds that speak to a different era's elegance</li>
                </ul>
                
                <aside className="bg-burgundy/5 p-6 border-l-2 border-burgundy max-w-md ml-auto mt-8">
                  <p className="text-xs font-light text-foreground/60 mb-2 uppercase tracking-wider font-lora">
                    The question we'll ask:
                  </p>
                  <p className="text-lg font-light font-lora text-primary italic">
                    "What do you love about this?"
                  </p>
                  <p className="text-sm font-light font-lora text-foreground/60 mt-3 leading-relaxed">
                    Your words matter as much as your images. Whether it's the drape of a sleeve, the confidence of a 
                    silhouette, or simply the feeling a piece evokes — these notes become the emotional compass guiding 
                    your search.
                  </p>
                </aside>

                <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70 max-w-lg pt-6">
                  As you arrange these images and add your reflections, patterns will emerge naturally. Colors that 
                  complement each other, textures that tell a story, proportions that feel inherently right. This 
                  moodboard becomes more than inspiration — it's a blueprint for the wardrobe you're meant to have.
                </p>

                <div className="bg-burgundy/5 p-5 max-w-md">
                  <p className="text-xs font-light font-lora text-foreground/60 uppercase tracking-wider mb-2">
                    Don't forget:
                  </p>
                  <p className="text-sm font-light font-lora text-foreground/70 leading-loose">
                    Visit the "My Style" section to select your style categories and dream brands. These preferences 
                    help match you with the right pieces — and the right people who can find them for you.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="w-16 h-px bg-primary/20 mx-auto"></div>

          {/* Step 2: Discover - Editorial Layout */}
          <section className="max-w-6xl mx-auto px-8">
            <div className="grid md:grid-cols-12 gap-8">
              {/* Content - Left side */}
              <div className="md:col-span-6 space-y-8 md:pt-12">
                <div className="space-y-4">
                  <h2 className="text-xs font-bold text-primary uppercase tracking-[0.25em]">
                    Step Two
                  </h2>
                  <h3 className="text-3xl md:text-5xl font-light font-lora text-primary">
                    Discover
                  </h3>
                  <p className="text-sm font-light font-lora text-foreground/60">
                    Let Intelligence Work for You
                  </p>
                </div>
                
                <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
                  With your moodboard complete, you have two paths to discovery — each designed to transform your 
                  visual inspiration into a curated wardrobe. Choose the approach that feels right for your journey.
                </p>

                <div className="space-y-6 pt-4">
                  <div className="bg-burgundy/5 p-6 border-l-2 border-burgundy">
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
                      AI-Powered Search
                    </h4>
                    <p className="text-sm font-light font-lora text-foreground/70 leading-loose mb-3">
                      Click the search button and let our AI work thoughtfully across multiple resale platforms. 
                      The algorithm considers your visual preferences, the emotional context from your notes, and 
                      your selected brands simultaneously.
                    </p>
                    <p className="text-sm font-light font-lora text-foreground/70 leading-loose">
                      Within moments, you'll receive a curated selection of pieces that align with your aesthetic DNA.
                    </p>
                  </div>

                  <div className="text-center py-3">
                    <p className="text-xs font-light font-lora text-foreground/40 uppercase tracking-widest">
                      Or
                    </p>
                  </div>

                  <div className="bg-burgundy/5 p-6 border-l-2 border-burgundy">
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
                      Connect with Professional Thrifters
                    </h4>
                    <p className="text-sm font-light font-lora text-foreground/70 leading-loose mb-3">
                      Sometimes, the human touch makes all the difference. Visit the Connect page to discover 
                      professional thrifters and stylists who share your aesthetic sensibility.
                    </p>
                    <p className="text-sm font-light font-lora text-foreground/70 leading-loose">
                      Browse their curated portfolios — visual proof of their eye for quality and their understanding 
                      of different aesthetics. When you find someone whose work resonates, open a message chat. 
                      This is personal shopping, reimagined for the secondhand era.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image - Right side, offset down */}
              <div className="md:col-span-5 md:col-start-8 md:pt-32">
                <img 
                  src={macbookGallery} 
                  alt="Cura Gallery on MacBook" 
                  className="w-full h-auto"
                />
                
                <blockquote className="mt-12 pt-8 border-t border-primary/20">
                  <p className="text-base md:text-lg font-light font-lora text-primary italic leading-relaxed">
                    Whether through algorithms or artisans, the goal remains the same: transforming inspiration 
                    into reality.
                  </p>
                </blockquote>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="w-16 h-px bg-primary/20 mx-auto"></div>

          {/* Step 3: Curate - Editorial Layout */}
          <section className="max-w-4xl mx-auto px-8">
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-10 md:col-start-2 space-y-10">
                <div className="space-y-4 text-center max-w-lg mx-auto">
                  <h2 className="text-xs font-bold text-primary uppercase tracking-[0.25em]">
                    Step Three
                  </h2>
                  <h3 className="text-3xl md:text-5xl font-light font-lora text-primary">
                    Curate
                  </h3>
                  <p className="text-sm font-light font-lora text-foreground/60">
                    Your Style Edit
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
                    This is where possibility becomes tangible. Whether discovered through AI precision or human expertise, 
                    your results arrive as a carefully curated edit — pieces that don't just match your inspiration, but 
                    understand the intention behind it.
                  </p>

                  <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
                    Each piece in your style edit has been selected for a reason. The AI has analyzed visual relationships, 
                    emotional context, and brand compatibility. The professional thrifters have applied their trained eye 
                    and intimate knowledge of the resale landscape.
                  </p>
                </div>

                <aside className="py-8 max-w-md ml-auto">
                  <div className="space-y-3 border-l-2 border-primary/30 pl-6">
                    <p className="text-base md:text-lg font-medium font-lora text-primary">
                      The moment of recognition
                    </p>
                    <p className="text-sm font-light font-lora text-foreground/50 leading-relaxed">
                      There's a particular satisfaction in finding exactly what you've been searching for — 
                      sometimes before you even knew you were looking for it. That feeling of "yes, this" is 
                      what we're creating here.
                    </p>
                  </div>
                </aside>

                <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70 max-w-2xl">
                  As you browse through your curated selection, notice how pieces relate to one another. How that 
                  vintage blazer would pair perfectly with those wide-leg trousers. How a certain dress captures 
                  the same energy as three different images in your moodboard. This isn't random matching — it's 
                  an understanding of your aesthetic as a complete vision.
                </p>

                <div className="bg-burgundy/5 p-6 border-l-2 border-burgundy max-w-lg">
                  <p className="text-sm font-light font-lora text-foreground/70 leading-loose">
                    Save pieces that resonate. Message thrifters for more information. Request additional photos. 
                    Ask about condition, fit, or styling suggestions. This is the beginning of a conversation, 
                    not the end of a search.
                  </p>
                </div>

                <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70 text-center pt-6 italic max-w-2xl mx-auto">
                  This is your curated style journey — from abstract inspiration to concrete wardrobe. We're not just 
                  helping you find clothes; we're helping you discover pieces that feel authentic. Pieces that make you 
                  stand a little taller, that integrate seamlessly into your life, that feel like they were waiting for 
                  you to find them.
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
