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
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden pointer-events-none">
      <div className="relative w-full h-screen flex items-center justify-center">
        {/* Top bar - starts as thin top border of square, expands to full extender */}
        <div
          className={`absolute bg-accent-foreground transition-all duration-[1500ms] ease-in-out ${
            animationState === 'initial'
              ? 'w-80 h-1 left-1/2 -translate-x-1/2'
              : 'w-full h-80 left-0 top-0'
          }`}
          style={
            animationState === 'initial'
              ? { top: 'calc(50% - 10rem)' }
              : { top: '0' }
          }
        />

        {/* Bottom bar - starts as thin bottom border of square, expands to full extender */}
        <div
          className={`absolute bg-accent-foreground transition-all duration-[1500ms] ease-in-out ${
            animationState === 'initial'
              ? 'w-80 h-1 left-1/2 -translate-x-1/2'
              : 'w-full h-80 left-0 bottom-0'
          }`}
          style={
            animationState === 'initial'
              ? { top: 'calc(50% + 10rem)' }
              : { bottom: '0' }
          }
        />

        {/* Left border - part of initial square frame only */}
        <div
          className={`absolute w-1 h-80 bg-accent-foreground transition-opacity duration-700 ${
            animationState === 'initial' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            top: '50%',
            left: 'calc(50% - 10rem)',
            transform: 'translateY(-50%)'
          }}
        />

        {/* Right border - part of initial square frame only */}
        <div
          className={`absolute w-1 h-80 bg-accent-foreground transition-opacity duration-700 ${
            animationState === 'initial' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            top: '50%',
            left: 'calc(50% + 10rem)',
            transform: 'translateY(-50%)'
          }}
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
              className={`text-8xl md:text-9xl font-black text-accent-foreground leading-none tracking-tighter transition-all duration-1000 delay-300 ${
                animationState === 'initial'
                  ? 'opacity-0 -translate-x-8'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              URA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
