import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import runwayModels from '@/assets/mission-runway-models.jpg';
import editorialPortrait from '@/assets/mission-editorial-portrait.jpg';
import silhouettes from '@/assets/mission-silhouettes.jpg';
import groupBackstage from '@/assets/mission-group-backstage.jpg';
import casualGroup from '@/assets/mission-casual-group.jpg';
import vintageFashion from '@/assets/mission-vintage-fashion.jpg';
import threeMen from '@/assets/mission-three-men.jpg';

export const OurMission = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button - Fixed Position */}
      <div className="fixed top-8 left-8 z-50">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="bg-background/80 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
      
      <article className="space-y-0">
        {/* Hero Title with image background */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${runwayModels})` }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <div className="relative z-10 text-center space-y-8 px-8">
            <h1 className="text-4xl md:text-6xl font-black text-burgundy uppercase tracking-[0.3em]">
              Our Mission
            </h1>
            <div className="w-16 h-px bg-burgundy mx-auto"></div>
          </div>
        </section>

        {/* Opening Statement with image background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${editorialPortrait})` }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-8 py-32">
            <p className="text-2xl md:text-3xl font-light leading-loose font-lora text-burgundy text-center">
              Our mission is to build a platform where users can create their dream wardrobe — piece by piece — based on their exact inspiration while supporting secondhand fashion and small businesses.
            </p>
          </div>
        </section>

        {/* Editorial Pull Quote with image background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${silhouettes})` }}
          >
            <div className="absolute inset-0 bg-white/40"></div>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto px-8">
            <blockquote className="text-center">
              <p className="text-3xl md:text-4xl font-light font-lora text-burgundy italic leading-relaxed">
                "Choosing eco-friendly options is no longer optional — it's essential."
              </p>
            </blockquote>
          </div>
        </section>

        {/* The Problem with image background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${groupBackstage})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-8 py-32 space-y-12">
            <p className="text-lg md:text-xl font-light leading-loose font-lora text-burgundy">
              In today's world, we know that people who love fashion want more than sustainability: they want trends, style evolution, luxury experiences, and creative expression.
            </p>
            
            <p className="text-lg md:text-xl font-light leading-loose font-lora text-burgundy">
              Often, life gets busy. Finding the perfect pieces from online thrift stores or local vintage shops can feel overwhelming, time-consuming, or even impossible without help. Yet the desire to express yourself through what you wear never goes away — and not feeling confident in your clothes can deeply affect how you move through the world.
            </p>
          </div>
        </section>

        {/* The Solution with image background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${casualGroup})` }}
          >
            <div className="absolute inset-0 bg-white/50"></div>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto px-8">
            <p className="text-3xl md:text-4xl font-medium font-lora text-burgundy text-center">
              Cura was created to change that.
            </p>
          </div>
        </section>

        {/* Values with image background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${vintageFashion})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-8 py-32">
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

        {/* Community Impact with image background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${threeMen})` }}
          >
            <div className="absolute inset-0 bg-white/60"></div>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-8 py-32">
            <p className="text-lg md:text-2xl font-light leading-loose font-lora text-burgundy text-center">
              This platform also opens doors for professional thrifters, stylists, and curators. By connecting their expertise with people searching for specific pieces, Cura creates a space where everyone benefits — buyers find what they love, sellers grow their businesses, and together we move fashion toward a more conscious future.
            </p>
          </div>
        </section>

        {/* Closing Statement - no background */}
        <section className="bg-background py-32 text-center">
          <p className="text-2xl md:text-3xl font-light font-lora text-burgundy italic tracking-wide px-8">
            Fashion with purpose. Style with conscience.
          </p>
        </section>
      </article>
    </div>
  );
};
