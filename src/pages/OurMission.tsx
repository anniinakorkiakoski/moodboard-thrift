import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import casualGroup from '@/assets/mission-casual.jpg';
import threeMen from '@/assets/mission-three.jpg';
import studioSpace from '@/assets/studio-space.jpg';
import runwayModels from '@/assets/mission-runway-models.jpg';

export const OurMission = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <article className="space-y-24 py-12">
          {/* Hero Title with decorative underline */}
          <header className="pt-12 pb-8">
            <div className="relative inline-block">
              <h1 className="text-6xl md:text-8xl font-black text-primary tracking-tight">
                about us
              </h1>
              <svg className="absolute -bottom-4 left-0 w-full" height="20" viewBox="0 0 400 20">
                <path 
                  d="M 10 15 Q 100 5, 200 15 T 390 15" 
                  stroke="hsl(var(--burgundy))" 
                  strokeWidth="3" 
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </header>

          {/* Opening Statement with arrow */}
          <section className="grid md:grid-cols-12 gap-12 items-start py-12">
            <div className="md:col-span-7 space-y-8">
              <p className="text-xl md:text-2xl font-light leading-relaxed text-foreground/80">
                Our mission is to build a platform where users can create their dream wardrobe — piece by piece — based on their exact inspiration while supporting secondhand fashion and small businesses.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-24 h-0.5 bg-burgundy"></div>
                <svg width="40" height="20" viewBox="0 0 40 20">
                  <path d="M 0 10 L 35 10 M 25 3 L 35 10 L 25 17" stroke="hsl(var(--burgundy))" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>
            <div className="md:col-span-5">
              <img 
                src={casualGroup} 
                alt="Fashion community" 
                className="w-full h-auto grayscale"
              />
            </div>
          </section>

          {/* The Problem Section */}
          <section className="py-20 px-4">
            <div className="grid md:grid-cols-12 gap-16">
              <div className="md:col-span-6 md:col-start-2">
                <div className="relative">
                  <h2 className="text-5xl md:text-6xl font-black text-primary mb-8 leading-tight">
                    the_<br/>problem
                  </h2>
                  <div className="space-y-6 text-base leading-loose text-foreground/70">
                    <p>
                      In today's world, we know that people who love fashion want more than sustainability: they want trends, style evolution, luxury experiences, and creative expression.
                    </p>
                    <p>
                      Often, life gets busy. Finding the perfect pieces from online thrift stores or local vintage shops can feel overwhelming, time-consuming, or even impossible without help.
                    </p>
                    <p className="italic text-burgundy">
                      Yet the desire to express yourself through what you wear never goes away — and not feeling confident in your clothes can deeply affect how you move through the world.
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4">
                <img 
                  src={studioSpace} 
                  alt="Studio space" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </section>

          {/* Values Grid */}
          <section className="py-16">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-16 relative inline-block">
              our values
              <svg className="absolute -right-16 -top-8" width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="35" stroke="hsl(var(--burgundy))" strokeWidth="2" fill="none" strokeDasharray="5,5" />
              </svg>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-x-24 gap-y-12 max-w-5xl">
              <div className="space-y-3">
                <div className="text-xs font-bold text-burgundy uppercase tracking-[0.3em] mb-2">
                  01
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  Time-friendly
                </h3>
                <p className="text-sm leading-relaxed text-foreground/70">
                  No endless scrolling or searching. We bring the perfect pieces directly to you.
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-burgundy uppercase tracking-[0.3em] mb-2">
                  02
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  Eco-friendly
                </h3>
                <p className="text-sm leading-relaxed text-foreground/70">
                  Prioritizing secondhand and small businesses for a more sustainable future.
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-burgundy uppercase tracking-[0.3em] mb-2">
                  03
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  Financially friendly
                </h3>
                <p className="text-sm leading-relaxed text-foreground/70">
                  Curated, thoughtful shopping that values quality over quantity.
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-burgundy uppercase tracking-[0.3em] mb-2">
                  04
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  Future-forward
                </h3>
                <p className="text-sm leading-relaxed text-foreground/70">
                  Merging AI, style, and sustainability in innovative ways.
                </p>
              </div>
            </div>
          </section>

          {/* Community Impact */}
          <section className="py-20">
            <div className="grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-5 order-2 md:order-1">
                <img 
                  src={threeMen} 
                  alt="Fashion community impact" 
                  className="w-full h-auto"
                />
              </div>
              <div className="md:col-span-6 md:col-start-7 order-1 md:order-2 space-y-6">
                <h2 className="text-4xl md:text-5xl font-black text-primary leading-tight">
                  community<br/>impact
                </h2>
                <p className="text-base leading-loose text-foreground/70">
                  This platform also opens doors for professional thrifters, stylists, and curators. By connecting their expertise with people searching for specific pieces, Cura creates a space where everyone benefits.
                </p>
                <div className="flex items-start gap-4 pt-4">
                  <div className="w-1 h-20 bg-burgundy"></div>
                  <p className="text-sm leading-relaxed text-foreground/60 italic">
                    Buyers find what they love, sellers grow their businesses, and together we move fashion toward a more conscious future.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Large Image Section */}
          <section className="py-12">
            <img 
              src={runwayModels} 
              alt="Fashion runway" 
              className="w-full h-auto"
            />
          </section>

          {/* Closing Statement */}
          <footer className="text-center py-20 pb-32">
            <div className="relative inline-block">
              <h3 className="text-4xl md:text-5xl font-light italic text-primary leading-relaxed">
                Fashion with purpose.<br/>Style with conscience.
              </h3>
              <svg className="absolute -bottom-8 left-1/2 -translate-x-1/2" width="200" height="40" viewBox="0 0 200 40">
                <ellipse cx="100" cy="20" rx="95" ry="15" stroke="hsl(var(--burgundy))" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};