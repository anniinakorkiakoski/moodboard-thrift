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
        
        <article className="max-w-4xl mx-auto py-12">
          {/* Hero Title */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="text-4xl">🌿</span>
              <h1 className="text-5xl md:text-6xl font-black text-primary uppercase tracking-wider">
                Our Mission
              </h1>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="space-y-16 text-foreground/90">
            {/* Opening Statement */}
            <section className="space-y-6">
              <p className="text-xl md:text-2xl font-light leading-relaxed font-serif">
                Our mission is to <strong className="font-semibold text-primary">build a platform where users can create their dream wardrobe</strong> — piece by piece — based on their exact inspiration while supporting secondhand fashion and small businesses.
              </p>
            </section>

            {/* The Problem */}
            <section className="space-y-6 border-l-4 border-primary/30 pl-8">
              <p className="text-lg md:text-xl font-light leading-relaxed font-serif">
                In today's world, <strong className="font-semibold">choosing eco-friendly options is no longer optional — it's essential.</strong> But we also know that people who love fashion want more than sustainability: they want <em>trends, style evolution, luxury experiences,</em> and <em>creative expression.</em>
              </p>
              
              <p className="text-lg md:text-xl font-light leading-relaxed font-serif">
                Often, life gets busy. Finding the perfect pieces from online thrift stores or local vintage shops can feel <strong className="font-semibold">overwhelming, time-consuming, or even impossible</strong> without help. Yet the desire to express yourself through what you wear never goes away — and not feeling confident in your clothes can deeply affect how you move through the world.
              </p>
            </section>

            {/* The Solution */}
            <section className="space-y-6">
              <p className="text-xl md:text-2xl font-light leading-relaxed font-serif text-center">
                <strong className="font-semibold text-primary">Cura was created to change that.</strong>
              </p>
              
              <p className="text-lg md:text-xl font-light leading-relaxed font-serif">
                Our platform helps you source the exact pieces you're looking for — in a way that is:
              </p>
            </section>

            {/* Values Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="space-y-3 p-6 bg-background/50 border border-primary/20 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🕒</span>
                  <h3 className="text-xl font-bold text-primary">Time-friendly</h3>
                </div>
                <p className="text-base font-light leading-relaxed font-serif pl-12">
                  No endless scrolling or searching.
                </p>
              </div>

              <div className="space-y-3 p-6 bg-background/50 border border-primary/20 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🌱</span>
                  <h3 className="text-xl font-bold text-primary">Eco-friendly</h3>
                </div>
                <p className="text-base font-light leading-relaxed font-serif pl-12">
                  Prioritizing secondhand and small businesses.
                </p>
              </div>

              <div className="space-y-3 p-6 bg-background/50 border border-primary/20 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💸</span>
                  <h3 className="text-xl font-bold text-primary">Financially friendly</h3>
                </div>
                <p className="text-base font-light leading-relaxed font-serif pl-12">
                  Curated, thoughtful shopping that values quality.
                </p>
              </div>

              <div className="space-y-3 p-6 bg-background/50 border border-primary/20 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🚀</span>
                  <h3 className="text-xl font-bold text-primary">Future-forward</h3>
                </div>
                <p className="text-base font-light leading-relaxed font-serif pl-12">
                  Merging AI, style, and sustainability.
                </p>
              </div>
            </section>

            {/* Community Impact */}
            <section className="space-y-6 bg-primary/5 p-8 md:p-12 border border-primary/20">
              <p className="text-lg md:text-xl font-light leading-relaxed font-serif">
                This platform also opens doors for <strong className="font-semibold">professional thrifters, stylists, and curators.</strong> By connecting their expertise with people searching for specific pieces, Cura creates a space where everyone benefits — buyers find what they love, sellers grow their businesses, and together we move fashion toward a more conscious future.
              </p>
            </section>

            {/* Closing Statement */}
            <section className="text-center pt-12">
              <p className="text-2xl md:text-3xl font-light leading-relaxed font-serif text-primary">
                ✨ Fashion with purpose. Style with conscience. ✨
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
};
