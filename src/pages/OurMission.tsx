import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const OurMission = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        <article className="max-w-3xl mx-auto py-16">
          {/* Hero Title */}
          <div className="text-center mb-24">
            <h1 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-wider mb-4">
              Our Mission
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          {/* Mission Statement */}
          <div className="space-y-16 text-foreground/90">
            {/* Opening Statement */}
            <section className="space-y-6">
              <p className="text-base md:text-lg font-light leading-relaxed font-lora">
                Our mission is to <strong className="font-semibold text-primary">build a platform where users can create their dream wardrobe</strong> — piece by piece — based on their exact inspiration while supporting secondhand fashion and small businesses.
              </p>
            </section>

            {/* The Problem */}
            <section className="space-y-6 border-l-2 border-primary/20 pl-8">
              <p className="text-base md:text-lg font-light leading-relaxed font-lora">
                In today's world, <strong className="font-medium">choosing eco-friendly options is no longer optional — it's essential.</strong> But we also know that people who love fashion want more than sustainability: they want trends, style evolution, luxury experiences, and creative expression.
              </p>
              
              <p className="text-base md:text-lg font-light leading-relaxed font-lora">
                Often, life gets busy. Finding the perfect pieces from online thrift stores or local vintage shops can feel <strong className="font-medium">overwhelming, time-consuming, or even impossible</strong> without help. Yet the desire to express yourself through what you wear never goes away — and not feeling confident in your clothes can deeply affect how you move through the world.
              </p>
            </section>

            {/* The Solution */}
            <section className="space-y-6">
              <p className="text-lg md:text-xl font-light leading-relaxed font-lora text-center">
                <strong className="font-medium text-primary">Cura was created to change that.</strong>
              </p>
              
              <p className="text-base md:text-lg font-light leading-relaxed font-lora">
                Our platform helps you source the exact pieces you're looking for — in a way that is:
              </p>
            </section>

            {/* Values Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
              <div className="space-y-2 p-6 bg-background/50 border border-primary/10 hover:border-primary/30 transition-all">
                <h3 className="text-base font-semibold text-primary uppercase tracking-wide">Time-friendly</h3>
                <p className="text-sm font-light leading-relaxed font-lora text-foreground/80">
                  No endless scrolling or searching.
                </p>
              </div>

              <div className="space-y-2 p-6 bg-background/50 border border-primary/10 hover:border-primary/30 transition-all">
                <h3 className="text-base font-semibold text-primary uppercase tracking-wide">Eco-friendly</h3>
                <p className="text-sm font-light leading-relaxed font-lora text-foreground/80">
                  Prioritizing secondhand and small businesses.
                </p>
              </div>

              <div className="space-y-2 p-6 bg-background/50 border border-primary/10 hover:border-primary/30 transition-all">
                <h3 className="text-base font-semibold text-primary uppercase tracking-wide">Financially friendly</h3>
                <p className="text-sm font-light leading-relaxed font-lora text-foreground/80">
                  Curated, thoughtful shopping that values quality.
                </p>
              </div>

              <div className="space-y-2 p-6 bg-background/50 border border-primary/10 hover:border-primary/30 transition-all">
                <h3 className="text-base font-semibold text-primary uppercase tracking-wide">Future-forward</h3>
                <p className="text-sm font-light leading-relaxed font-lora text-foreground/80">
                  Merging AI, style, and sustainability.
                </p>
              </div>
            </section>

            {/* Community Impact */}
            <section className="space-y-6 bg-primary/5 p-8 md:p-10 border border-primary/10">
              <p className="text-base md:text-lg font-light leading-relaxed font-lora">
                This platform also opens doors for <strong className="font-medium">professional thrifters, stylists, and curators.</strong> By connecting their expertise with people searching for specific pieces, Cura creates a space where everyone benefits — buyers find what they love, sellers grow their businesses, and together we move fashion toward a more conscious future.
              </p>
            </section>

            {/* Closing Statement */}
            <section className="text-center pt-12 pb-8">
              <p className="text-lg md:text-xl font-light leading-relaxed font-lora text-primary italic">
                Fashion with purpose. Style with conscience.
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
};
