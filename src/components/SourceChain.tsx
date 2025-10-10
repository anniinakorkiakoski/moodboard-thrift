import { useEffect, useRef, useState } from 'react';

interface SourcePlatform {
  name: string;
  logo?: string;
}

const sources: SourcePlatform[] = [
  { name: 'Vinted' },
  { name: 'Depop', logo: '/logos/depop.png' },
  { name: 'Vestiaire Collective', logo: '/logos/vestiaire.png' },
  { name: 'The RealReal', logo: '/logos/therealreal.png' },
  { name: 'thredUP' },
  { name: 'eBay' },
  { name: 'Facebook Marketplace' },
  { name: 'Shpock' },
  { name: 'Grailed' },
  { name: 'Poshmark' },
  { name: 'ASOS Marketplace' },
  { name: 'Hardly Ever Worn It' },
  { name: 'Marrkt' },
  { name: 'True Vintage' },
  { name: 'FINDS' },
  { name: 'Zalando Pre-Owned' },
  { name: 'Etsy' },
  { name: 'Tise' },
  { name: 'Selpy' },
  { name: 'Emmy' }
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
          <div key={`${source.name}-${index}`} className="flex items-center flex-shrink-0">
            {/* Logo node */}
            <div className="group relative flex items-center px-8 py-4 bg-background border-2 border-foreground hover:bg-foreground transition-all duration-300 hover:scale-105">
              {source.logo ? (
                <img 
                  src={source.logo} 
                  alt={source.name}
                  className="h-8 w-auto object-contain filter brightness-0 group-hover:brightness-100 group-hover:invert transition-all duration-300"
                />
              ) : (
                <span className="text-foreground group-hover:text-background text-sm font-bold tracking-wider uppercase whitespace-nowrap transition-colors duration-300">
                  {source.name}
                </span>
              )}
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
