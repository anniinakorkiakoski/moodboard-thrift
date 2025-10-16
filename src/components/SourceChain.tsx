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
      className="relative overflow-hidden py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Fade overlays for seamless loop effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      {/* Scrolling logos container */}
      <div 
        ref={scrollRef}
        className="flex items-center gap-12 md:gap-16 overflow-x-hidden px-8"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedSources.map((source, index) => (
          <div 
            key={`${source}-${index}`} 
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
          >
            <SourceLogo name={source} />
          </div>
        ))}
      </div>
    </div>
  );
};
