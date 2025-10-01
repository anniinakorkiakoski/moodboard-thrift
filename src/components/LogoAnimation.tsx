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
    }, 500);

    // Complete animation
    const completeTimer = setTimeout(() => {
      setAnimationState('complete');
      onComplete?.();
    }, 2500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden">
      {/* Top frame border - starts as part of square, extends to full width bar */}
      <div
        className={`absolute bg-accent-foreground transition-all duration-[1500ms] ease-in-out ${
          animationState === 'initial'
            ? 'w-80 h-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10rem]'
            : 'w-screen h-80 top-0 left-0 translate-x-0 translate-y-0'
        }`}
      />

      {/* Bottom frame border - starts as part of square, extends to full width bar */}
      <div
        className={`absolute bg-accent-foreground transition-all duration-[1500ms] ease-in-out ${
          animationState === 'initial'
            ? 'w-80 h-4 top-1/2 left-1/2 -translate-x-1/2 translate-y-[10rem]'
            : 'w-screen h-80 bottom-0 left-0 translate-x-0 translate-y-0'
        }`}
      />

      {/* Left frame border - part of initial square, fades out during expansion */}
      <div
        className={`absolute w-4 h-80 bg-accent-foreground top-1/2 left-1/2 -translate-x-[10rem] -translate-y-1/2 transition-opacity duration-500 ${
          animationState === 'initial' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Right frame border - part of initial square, fades out during expansion */}
      <div
        className={`absolute w-4 h-80 bg-accent-foreground top-1/2 left-1/2 translate-x-[10rem] -translate-y-1/2 transition-opacity duration-500 ${
          animationState === 'initial' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* CURA Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="flex items-center justify-center">
          {/* C - Always visible */}
          <span className="text-8xl md:text-9xl font-black text-accent-foreground leading-none tracking-tighter">
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
