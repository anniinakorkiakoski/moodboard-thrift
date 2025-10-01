import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import editorialCloset from '@/assets/editorial-closet.jpg';

export const OurMission = () => {
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
          {/* Hero Title with breathing room */}
          <header className="text-center space-y-8 pt-12 pb-20">
            <h1 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-[0.3em]">
              Our Mission
            </h1>
            <div className="w-16 h-px bg-primary/40 mx-auto"></div>
          </header>

          {/* Opening Statement - smaller, more space */}
          <section className="max-w-2xl mx-auto space-y-12">
            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/80 text-center px-8">
              Our mission is to build a platform where users can create their dream wardrobe — piece by piece — based on their exact inspiration while supporting secondhand fashion and small businesses.
            </p>
          </section>

          {/* Editorial Pull Quote */}
          <aside className="max-w-xl mx-auto py-16">
            <blockquote className="text-center">
              <p className="text-xl md:text-2xl font-light font-lora text-primary italic leading-relaxed">
                "Choosing eco-friendly options is no longer optional — it's essential."
              </p>
            </blockquote>
          </aside>

          {/* The Problem - smaller text, more space */}
          <section className="max-w-2xl mx-auto space-y-8 px-8">
            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
              In today's world, we know that people who love fashion want more than sustainability: they want trends, style evolution, luxury experiences, and creative expression.
            </p>
            
            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70">
              Often, life gets busy. Finding the perfect pieces from online thrift stores or local vintage shops can feel overwhelming, time-consuming, or even impossible without help. Yet the desire to express yourself through what you wear never goes away — and not feeling confident in your clothes can deeply affect how you move through the world.
            </p>
          </section>

          {/* Editorial Image Section */}
          <section className="py-20">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <img 
                  src={editorialCloset} 
                  alt="Curated wardrobe space" 
                  className="w-full h-auto shadow-lg"
                />
                <p className="text-xs font-light text-foreground/40 mt-4 text-center font-lora tracking-wide">
                  A thoughtfully curated space
                </p>
              </div>
            </div>
          </section>

          {/* The Solution - Pull Quote Style */}
          <aside className="max-w-lg mx-auto py-12">
            <p className="text-lg md:text-xl font-medium font-lora text-primary text-center">
              Cura was created to change that.
            </p>
          </aside>

          {/* Values in Burgundy Squares */}
          <section className="max-w-4xl mx-auto py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              <div className="bg-burgundy p-8 md:p-10 space-y-4 hover-scale">
                <h3 className="text-sm font-bold text-burgundy-foreground uppercase tracking-[0.2em]">
                  Time-friendly
                </h3>
                <p className="text-xs font-light leading-relaxed font-lora text-burgundy-foreground/90">
                  No endless scrolling or searching.
                </p>
              </div>

              <div className="bg-burgundy p-8 md:p-10 space-y-4 hover-scale">
                <h3 className="text-sm font-bold text-burgundy-foreground uppercase tracking-[0.2em]">
                  Eco-friendly
                </h3>
                <p className="text-xs font-light leading-relaxed font-lora text-burgundy-foreground/90">
                  Prioritizing secondhand and small businesses.
                </p>
              </div>

              <div className="bg-burgundy p-8 md:p-10 space-y-4 hover-scale">
                <h3 className="text-sm font-bold text-burgundy-foreground uppercase tracking-[0.2em]">
                  Financially friendly
                </h3>
                <p className="text-xs font-light leading-relaxed font-lora text-burgundy-foreground/90">
                  Curated, thoughtful shopping that values quality.
                </p>
              </div>

              <div className="bg-burgundy p-8 md:p-10 space-y-4 hover-scale">
                <h3 className="text-sm font-bold text-burgundy-foreground uppercase tracking-[0.2em]">
                  Future-forward
                </h3>
                <p className="text-xs font-light leading-relaxed font-lora text-burgundy-foreground/90">
                  Merging AI, style, and sustainability.
                </p>
              </div>
            </div>
          </section>

          {/* Community Impact - smaller, centered */}
          <section className="max-w-2xl mx-auto py-16 px-8">
            <p className="text-sm md:text-base font-light leading-loose font-lora text-foreground/70 text-center">
              This platform also opens doors for professional thrifters, stylists, and curators. By connecting their expertise with people searching for specific pieces, Cura creates a space where everyone benefits — buyers find what they love, sellers grow their businesses, and together we move fashion toward a more conscious future.
            </p>
          </section>

          {/* Closing Statement */}
          <footer className="text-center py-20 pb-32">
            <p className="text-base md:text-lg font-light font-lora text-primary italic tracking-wide">
              Fashion with purpose. Style with conscience.
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
};
