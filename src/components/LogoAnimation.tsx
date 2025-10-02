import { useEffect, useState } from 'react';

interface LogoAnimationProps {
  onComplete?: () => void;
}

export const LogoAnimation = ({ onComplete }: LogoAnimationProps) => {
  const [animationState, setAnimationState] = useState<'initial' | 'expanding' | 'extending' | 'complete'>('initial');

  useEffect(() => {
    // Stage 1: Box expansion
    const expandTimer = setTimeout(() => {
      setAnimationState('expanding');
    }, 300);

    // Stage 2: Border extension and letter reveal
    const extendTimer = setTimeout(() => {
      setAnimationState('extending');
    }, 1200);

    // Complete animation
    const completeTimer = setTimeout(() => {
      setAnimationState('complete');
      onComplete?.();
    }, 2700);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(extendTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Calculate dimensions based on state
  const boxSize = animationState === 'initial' ? 'w-32 h-32' : 'w-80 h-80';
  const cScale = animationState === 'initial' ? 'scale-75' : 'scale-100';
  const topTransform = animationState === 'extending' ? 'translate(calc(-50% - 32px), 0)' : 'translate(-50%, 0)';
  const bottomTransform = animationState === 'extending' ? 'translate(calc(-50% + 32px), 0)' : 'translate(-50%, 0)';

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center overflow-hidden pointer-events-none">
      <div className="relative w-full h-screen flex items-center justify-center">
        {/* Top bar - expands then slides left */}
        <div
          className={`absolute bg-accent-foreground left-1/2 h-2 transition-all ease-in-out ${
            animationState === 'initial' ? 'w-32 duration-[900ms]' : 
            animationState === 'expanding' ? 'w-80 duration-[900ms]' : 
            'w-screen duration-[1000ms]'
          }`}
          style={{
            top: 'calc(50% - 10rem)',
            transform: animationState === 'extending' ? topTransform : 'translate(-50%, 0)'
          }}
        />

        {/* Bottom bar - expands then slides right */}
        <div
          className={`absolute bg-accent-foreground left-1/2 h-2 transition-all ease-in-out ${
            animationState === 'initial' ? 'w-32 duration-[900ms]' : 
            animationState === 'expanding' ? 'w-80 duration-[900ms]' : 
            'w-screen duration-[1000ms]'
          }`}
          style={{
            top: 'calc(50% + 10rem)',
            transform: animationState === 'extending' ? bottomTransform : 'translate(-50%, 0)'
          }}
        />

        {/* Left border - part of initial square, fades during expansion */}
        <div
          className={`absolute w-2 bg-accent-foreground transition-all duration-[900ms] ease-in-out ${
            animationState === 'initial' ? 'h-32 opacity-100' : 'h-80 opacity-0'
          }`}
          style={{ 
            top: '50%', 
            left: animationState === 'initial' ? 'calc(50% - 4rem)' : 'calc(50% - 10rem)', 
            transform: 'translateY(-50%)' 
          }}
        />

        {/* Right border - part of initial square, fades during expansion */}
        <div
          className={`absolute w-2 bg-accent-foreground transition-all duration-[900ms] ease-in-out ${
            animationState === 'initial' ? 'h-32 opacity-100' : 'h-80 opacity-0'
          }`}
          style={{ 
            top: '50%', 
            left: animationState === 'initial' ? 'calc(50% + 4rem)' : 'calc(50% + 10rem)', 
            transform: 'translateY(-50%)' 
          }}
        />

        {/* CURA Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="flex items-center justify-center">
            {/* C - Scales with box during expansion */}
            <span className={`text-8xl md:text-9xl font-black text-accent-foreground leading-none tracking-tighter transition-transform duration-[900ms] ease-in-out ${cScale}`}>
              C
            </span>

            {/* URA - Fades in during extension phase */}
            <span
              className={`text-8xl md:text-9xl font-black text-accent-foreground leading-none tracking-tighter transition-all duration-[800ms] ease-in-out ${
                animationState === 'extending' || animationState === 'complete' 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-8'
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
