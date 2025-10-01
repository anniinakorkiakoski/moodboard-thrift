import { useEffect, useState } from 'react';

interface LogoAnimationProps {
  onComplete?: () => void;
}

export const LogoAnimation = ({ onComplete }: LogoAnimationProps) => {
  const [animationState, setAnimationState] = useState<'initial' | 'expanding' | 'complete'>('initial');

  useEffect(() => {
    // Start animation after brief delay
    const startTimer = setTimeout(() => {
      setAnimationState('expanding');
    }, 300);

    // Complete animation
    const completeTimer = setTimeout(() => {
      setAnimationState('complete');
      onComplete?.();
    }, 2300);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden">
      {/* Top burgundy bar */}
      <div
        className={`absolute h-80 bg-accent-foreground transition-all duration-[1500ms] ease-in-out ${
          animationState === 'initial'
            ? 'w-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-full border-b-4 border-accent-foreground'
            : 'w-screen top-0 left-0 translate-x-0 translate-y-0'
        }`}
      />

      {/* Bottom burgundy bar */}
      <div
        className={`absolute h-80 bg-accent-foreground transition-all duration-[1500ms] ease-in-out ${
          animationState === 'initial'
            ? 'w-80 top-1/2 left-1/2 -translate-x-1/2 translate-y-0 border-t-4 border-accent-foreground'
            : 'w-screen bottom-0 left-0 translate-x-0 translate-y-0'
        }`}
      />

      {/* Left burgundy bar (vertical part of square initially) */}
      <div
        className={`absolute w-4 bg-accent-foreground transition-all duration-[1500ms] ease-in-out ${
          animationState === 'initial'
            ? 'h-80 left-1/2 top-1/2 -translate-x-full -translate-y-1/2'
            : 'h-80 left-0 top-0 -translate-x-full'
        }`}
      />

      {/* Right burgundy bar (vertical part of square initially) */}
      <div
        className={`absolute w-4 bg-accent-foreground transition-all duration-[1500ms] ease-in-out ${
          animationState === 'initial'
            ? 'h-80 left-1/2 top-1/2 translate-x-0 -translate-y-1/2'
            : 'h-80 right-0 top-0 translate-x-full'
        }`}
      />

      {/* CURA Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="flex items-center justify-center">
          {/* C - Always visible */}
          <span
            className={`text-8xl md:text-9xl font-black text-accent-foreground leading-none tracking-tighter transition-opacity duration-300 ${
              animationState === 'initial' ? 'opacity-100' : 'opacity-100'
            }`}
          >
            C
          </span>

          {/* URA - Fades in during expansion */}
          <span
            className={`text-8xl md:text-9xl font-black text-accent-foreground leading-none tracking-tighter transition-all duration-700 ${
              animationState === 'initial'
                ? 'opacity-0 translate-x-4'
                : 'opacity-100 translate-x-0'
            }`}
          >
            URA
          </span>
        </div>
      </div>
    </div>
  );
};
