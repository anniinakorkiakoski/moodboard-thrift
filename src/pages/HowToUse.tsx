import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import magazineTightOak from '@/assets/magazine-tight-oak.jpg';
import galleryScreenshot from '@/assets/cura-gallery-screenshot.png';

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
          <section className="max-w-5xl mx-auto px-8">
            <div className="grid md:grid-cols-[2fr,1fr] gap-12 items-start">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-xs font-bold text-primary uppercase tracking-[0.25em] text-center md:text-left">
                    Step One
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-light font-lora text-primary text-center md:text-left">
                    Share
                  </h3>
                  <p className="text-sm font-light font-lora text-foreground/60 text-center md:text-left">
                    Build Your Visual Story
                  </p>
                </div>
                
                <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
                  The first step in your style journey is creating a moodboard that speaks to who you are. 
                  Think of your Cura Gallery as a visual diary — a collection of images that capture not just 
                  what you like, but why you're drawn to certain aesthetics, silhouettes, and moods. This is 
                  where intuition meets expression.
                </p>
                
                <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
                  Draw inspiration from everywhere:
                </p>

                <ul className="space-y-3 text-sm font-light font-lora text-foreground/70 leading-loose pl-6">
                  <li>That perfectly composed Pinterest board you return to again and again</li>
                  <li>Editorial spreads torn from magazines, saved for their artistic vision</li>
                  <li>Screenshots from social media — street style that stopped you mid-scroll</li>
                  <li>Photographs of your own wardrobe's greatest hits, the pieces you reach for instinctively</li>
                  <li>Runway moments that redefined your understanding of a silhouette</li>
                  <li>Vintage finds that speak to a different era's elegance</li>
                </ul>
                
                <aside className="bg-burgundy/5 p-8 border-l-2 border-burgundy mt-8">
                  <p className="text-xs font-light text-foreground/60 mb-3 uppercase tracking-wider font-lora">
                    The question we'll ask:
                  </p>
                  <p className="text-base md:text-lg font-light font-lora text-primary italic">
                    "What do you love about this?"
                  </p>
                  <p className="text-sm font-light font-lora text-foreground/60 mt-4 leading-relaxed">
                    Your words matter as much as your images. Whether it's the drape of a sleeve, the confidence of a 
                    silhouette, or simply the feeling a piece evokes — these notes become the emotional compass guiding 
                    your search. They transform visual preference into something deeper: a reflection of who you are and 
                    how you want to feel in what you wear.
                  </p>
                </aside>

                <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
                  As you arrange these images and add your reflections, patterns will emerge naturally. Colors that 
                  complement each other, textures that tell a story, proportions that feel inherently right. This 
                  moodboard becomes more than inspiration — it's a blueprint for the wardrobe you're meant to have.
                </p>

                <div className="bg-burgundy/5 p-6 mt-8">
                  <p className="text-xs font-light font-lora text-foreground/60 uppercase tracking-wider mb-3">
                    Don't forget:
                  </p>
                  <p className="text-sm font-light font-lora text-foreground/70 leading-loose">
                    Visit the "My Style" section to select your style categories and dream brands. These preferences 
                    help match you with the right pieces — and the right people who can find them for you.
                  </p>
                </div>
              </div>

              <div>
                <img 
                  src={magazineTightOak} 
                  alt="Fashion magazine runway collage" 
                  className="w-full h-auto shadow-lg"
                />
                <p className="text-xs font-light text-foreground/40 mt-3 text-center font-lora tracking-wide">
                  Editorial inspiration
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="w-16 h-px bg-primary/20 mx-auto"></div>

          {/* Step 2: Discover */}
          <section className="max-w-5xl mx-auto px-8">
            <div className="grid md:grid-cols-[1fr,2fr] gap-12 items-start">
              <div>
                <img 
                  src={galleryScreenshot} 
                  alt="Cura Gallery screenshot" 
                  className="w-full h-auto shadow-lg"
                />
              </div>

              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-xs font-bold text-primary uppercase tracking-[0.25em] text-center md:text-left">
                    Step Two
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-light font-lora text-primary text-center md:text-left">
                    Discover
                  </h3>
                  <p className="text-sm font-light font-lora text-foreground/60 text-center md:text-left">
                    Let Intelligence Work for You
                  </p>
                </div>
                
                <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
                  With your moodboard complete, you have two paths to discovery — each designed to transform your 
                  visual inspiration into a curated wardrobe. Choose the approach that feels right for your journey.
                </p>

                <div className="space-y-8 pt-4">
                  <div className="bg-burgundy/5 p-8 border-l-2 border-burgundy">
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">
                      AI-Powered Search
                    </h4>
                    <p className="text-sm font-light font-lora text-foreground/70 leading-loose mb-4">
                      Click the search button and let our AI work thoughtfully across multiple resale platforms. 
                      The algorithm considers your visual preferences, the emotional context from your notes, and 
                      your selected brands simultaneously — understanding not just what you see, but why it resonates.
                    </p>
                    <p className="text-sm font-light font-lora text-foreground/70 leading-loose">
                      Within moments, you'll receive a curated selection of pieces that align with your aesthetic DNA. 
                      The search learns from the relationships between your inspiration images, suggesting items that 
                      would naturally complement what you've shown interest in.
                    </p>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-xs font-light font-lora text-foreground/40 uppercase tracking-widest">
                      Or
                    </p>
                  </div>

                  <div className="bg-burgundy/5 p-8 border-l-2 border-burgundy">
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">
                      Connect with Professional Thrifters
                    </h4>
                    <p className="text-sm font-light font-lora text-foreground/70 leading-loose mb-4">
                      Sometimes, the human touch makes all the difference. Visit the Connect page to discover 
                      professional thrifters and stylists who share your aesthetic sensibility. Our matching system 
                      uses both your "My Style" selections and theirs to suggest collaborators whose taste naturally 
                      aligns with yours.
                    </p>
                    <p className="text-sm font-light font-lora text-foreground/70 leading-loose mb-4">
                      Browse their curated portfolios — visual proof of their eye for quality and their understanding 
                      of different aesthetics. Each thrifter brings their own expertise: perhaps someone specializes 
                      in vintage Chanel, another in emerging designers, or maybe they have an uncanny ability to find 
                      that perfect pair of vintage Levi's.
                    </p>
                    <p className="text-sm font-light font-lora text-foreground/70 leading-loose">
                      When you find someone whose work resonates, open a message chat. Share your moodboard, discuss 
                      your vision, and let their expertise guide you to pieces you might never have discovered on your own. 
                      This is personal shopping, reimagined for the secondhand era.
                    </p>
                  </div>
                </div>

                <aside className="py-12">
                  <blockquote className="text-center">
                    <p className="text-lg md:text-xl font-light font-lora text-primary italic leading-relaxed max-w-xl mx-auto">
                      Whether through algorithms or artisans, the goal remains the same: transforming inspiration 
                      into reality.
                    </p>
                  </blockquote>
                </aside>
              </div>
            </div>
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
                Your Style Edit
              </p>
            </div>
            
            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
              This is where possibility becomes tangible. Whether discovered through AI precision or human expertise, 
              your results arrive as a carefully curated edit — pieces that don't just match your inspiration, but 
              understand the intention behind it.
            </p>

            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
              Each piece in your style edit has been selected for a reason. The AI has analyzed visual relationships, 
              emotional context, and brand compatibility. The professional thrifters have applied their trained eye 
              and intimate knowledge of the resale landscape. Both approaches share the same goal: showing you pieces 
              that feel like they were made for you.
            </p>

            <aside className="py-12">
              <div className="text-center space-y-4 max-w-lg mx-auto">
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

            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
              As you browse through your curated selection, notice how pieces relate to one another. How that 
              vintage blazer would pair perfectly with those wide-leg trousers. How a certain dress captures 
              the same energy as three different images in your moodboard. This isn't random matching — it's 
              an understanding of your aesthetic as a complete vision.
            </p>

            <div className="bg-burgundy/5 p-8 border-l-2 border-burgundy">
              <p className="text-sm font-light font-lora text-foreground/70 leading-loose">
                Save pieces that resonate. Message thrifters for more information. Request additional photos. 
                Ask about condition, fit, or styling suggestions. This is the beginning of a conversation, 
                not the end of a search.
              </p>
            </div>

            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70 text-center pt-8 italic">
              This is your curated style journey — from abstract inspiration to concrete wardrobe. We're not just 
              helping you find clothes; we're helping you discover pieces that feel authentic. Pieces that make you 
              stand a little taller, that integrate seamlessly into your life, that feel like they were waiting for 
              you to find them.
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
