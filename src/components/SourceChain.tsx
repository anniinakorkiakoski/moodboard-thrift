import { useEffect, useRef, useState } from 'react';
import { SourceLogo } from './SourceLogo';

const sources = [
  'Vinted',
  'Depop',
  'Vestiaire Collective',
  'The RealReal',
  'thredUP',
  'eBay',
  'Facebook Marketplace',
  'Shpock',
  'Grailed',
  'Poshmark',
  'ASOS Marketplace',
  'Hardly Ever Worn It',
  'Marrkt',
  'True Vintage',
  'FINDS',
  'Zalando Pre-Owned',
  'Etsy',
  'Tise',
  'Selpy',
  'Emmy'
];

export const SourceChain = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      if (scrollContainer) {
        scrollContainer.scrollLeft = scrollPosition;
        
        // Reset when we've scrolled past the first set
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused]);

  // Duplicate sources for seamless loop
  const duplicatedSources = [...sources, ...sources];

  return (
    <div 
      className="relative overflow-hidden py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Fade overlays for seamless loop effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      {/* Scrolling chain container */}
      <div 
        ref={scrollRef}
        className="flex items-center gap-0 overflow-x-hidden"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedSources.map((source, index) => (
          <div key={`${source}-${index}`} className="flex items-center flex-shrink-0">
            {/* Logo node */}
            <div className="group relative flex items-center px-8 py-4 bg-background border-2 border-foreground hover:bg-foreground transition-all duration-300 hover:scale-105">
              <div className="text-foreground group-hover:text-background transition-colors duration-300">
                <SourceLogo name={source} />
              </div>
            </div>
            
            {/* Chain link line */}
            <div className="h-px w-16 md:w-20 bg-foreground/20 flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-foreground/50 font-light tracking-widest uppercase animate-fade-in">
          Paused
        </div>
      )}
    </div>
  );
};
