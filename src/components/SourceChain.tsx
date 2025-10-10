import { useEffect, useRef, useState } from 'react';

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
            {/* Node circle */}
            <div className="group relative flex items-center">
              <div 
                className="w-3 h-3 rounded-full bg-foreground border-2 border-background transition-all duration-300 group-hover:scale-150 group-hover:bg-primary z-10"
              />
              
              {/* Source name tooltip */}
              <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                <div className="bg-foreground text-background px-4 py-2 text-xs font-medium tracking-wider uppercase">
                  {source}
                </div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-foreground absolute -top-1 left-1/2 -translate-x-1/2" />
              </div>
            </div>
            
            {/* Chain link line */}
            <div className="h-px w-16 md:w-24 bg-foreground/30 flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-foreground/50 font-light tracking-widest uppercase animate-fade-in">
          Hover to explore
        </div>
      )}
    </div>
  );
};
