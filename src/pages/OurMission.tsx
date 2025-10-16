import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import casualGroup from '@/assets/mission-casual.jpg';
import threeMen from '@/assets/mission-three.jpg';
import studioSpace from '@/assets/studio-space.jpg';
import missionBanner from '@/assets/mission-banner.jpg';

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
          {/* Hero Title with Banner Background */}
          <header className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 w-full h-full"
              style={{ 
                backgroundImage: `url(${missionBanner})`,
                backgroundSize: '100% auto',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
            <div className="relative z-10 text-center space-y-8">
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-[0.3em] drop-shadow-lg">
                Our Mission
              </h1>
              <div className="w-16 h-px bg-white/60 mx-auto"></div>
            </div>
          </header>

          {/* Opening Statement - Text Only */}
          <section className="max-w-7xl mx-auto px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-base md:text-lg font-light leading-loose font-lora text-foreground/80">
                Our mission is to build a platform where users can create their dream wardrobe — piece by piece — based on their exact inspiration while supporting secondhand fashion and small businesses.
              </p>
              <blockquote className="border-l-2 border-burgundy/40 pl-6 mt-8">
                <p className="text-lg md:text-xl font-light font-lora text-burgundy italic leading-relaxed">
                  "Choosing eco-friendly options is no longer optional — it's essential."
                </p>
              </blockquote>
            </div>
          </section>

          {/* The Problem - with image background and red overlay text */}
          <section className="py-20">
            <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale"
                style={{ backgroundImage: `url(${studioSpace})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/40"></div>
              </div>
              <div className="relative z-10 max-w-3xl mx-auto px-8 py-32 space-y-12">
                <p className="text-lg md:text-xl font-light leading-loose font-lora text-burgundy drop-shadow-lg">
                  In today's world, we know that people who love fashion want more than sustainability: they want trends, style evolution, luxury experiences, and creative expression.
                </p>
                
                <p className="text-lg md:text-xl font-light leading-loose font-lora text-burgundy drop-shadow-lg">
                  Often, life gets busy. Finding the perfect pieces from online thrift stores or local vintage shops can feel overwhelming, time-consuming, or even impossible without help. Yet the desire to express yourself through what you wear never goes away — and not feeling confident in your clothes can deeply affect how you move through the world.
                </p>
              </div>
            </div>
          </section>

          {/* Values - Simple white background grid */}
          <section className="py-20 bg-background">
            <div className="max-w-6xl mx-auto px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                <div className="bg-burgundy/90 backdrop-blur-sm p-8 md:p-10 space-y-4 hover-scale">
                  <h3 className="text-sm font-bold text-burgundy-foreground uppercase tracking-[0.2em]">
                    Time-friendly
                  </h3>
                  <p className="text-xs font-light leading-relaxed font-lora text-burgundy-foreground/90">
                    No endless scrolling or searching.
                  </p>
                </div>

                <div className="bg-burgundy/90 backdrop-blur-sm p-8 md:p-10 space-y-4 hover-scale">
                  <h3 className="text-sm font-bold text-burgundy-foreground uppercase tracking-[0.2em]">
                    Eco-friendly
                  </h3>
                  <p className="text-xs font-light leading-relaxed font-lora text-burgundy-foreground/90">
                    Prioritizing secondhand and small businesses.
                  </p>
                </div>

                <div className="bg-burgundy/90 backdrop-blur-sm p-8 md:p-10 space-y-4 hover-scale">
                  <h3 className="text-sm font-bold text-burgundy-foreground uppercase tracking-[0.2em]">
                    Financially friendly
                  </h3>
                  <p className="text-xs font-light leading-relaxed font-lora text-burgundy-foreground/90">
                    Curated, thoughtful shopping that values quality.
                  </p>
                </div>

                <div className="bg-burgundy/90 backdrop-blur-sm p-8 md:p-10 space-y-4 hover-scale">
                  <h3 className="text-sm font-bold text-burgundy-foreground uppercase tracking-[0.2em]">
                    Future-forward
                  </h3>
                  <p className="text-xs font-light leading-relaxed font-lora text-burgundy-foreground/90">
                    Merging AI, style, and sustainability.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Community Impact - Editorial text with offset image */}
          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-8">
              <div className="grid md:grid-cols-12 gap-12 items-start">
                <div className="md:col-span-7 md:col-start-1 flex items-center">
                  <p className="text-base md:text-lg font-light leading-loose font-lora text-foreground/80">
                    This platform also opens doors for professional thrifters, stylists, and curators. By connecting their expertise with people searching for specific pieces, Cura creates a space where everyone benefits — buyers find what they love, sellers grow their businesses, and together we move fashion toward a more conscious future.
                  </p>
                </div>
                <div className="md:col-span-5 md:col-start-8">
                  <img 
                    src={threeMen} 
                    alt="Fashion community" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Closing Statement - Centered */}
          <footer className="max-w-5xl mx-auto py-20 pb-32 px-8 text-center">
            <p className="text-2xl md:text-3xl font-light font-lora text-primary italic tracking-wide">
              Fashion with purpose. Style with conscience.
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
};
