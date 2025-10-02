import { useEffect, useState } from 'react';

interface LogoAnimationProps {
  onComplete?: () => void;
}

export const LogoAnimation = ({ onComplete }: LogoAnimationProps) => {
  const [animationState, setAnimationState] = useState<'initial' | 'expanding' | 'extending' | 'complete'>('initial');

  useEffect(() => {
    // Stage 1: Box expansion starts immediately
    const expandTimer = setTimeout(() => {
      setAnimationState('expanding');
    }, 400);

    // Stage 2: Border extension - starts AFTER expansion completes
    const extendTimer = setTimeout(() => {
      setAnimationState('extending');
    }, 1600);

    // Complete animation
    const completeTimer = setTimeout(() => {
      setAnimationState('complete');
      onComplete?.();
    }, 2800);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(extendTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden pointer-events-none">
      <div className="relative w-full h-screen flex items-center justify-center">
        {/* Top bar - expands with box, then slides left */}
        <div
          className={`absolute left-1/2 h-[3px] bg-[hsl(340,75%,25%)] ${
            animationState === 'initial' ? 'w-28' : 
            animationState === 'expanding' ? 'w-80' : 
            'w-screen'
          }`}
          style={{
            top: 'calc(50% - 10rem)',
            transform: animationState === 'extending' ? 'translate(calc(-50% - 40px), 0)' : 'translate(-50%, 0)',
            transition: animationState === 'initial' 
              ? 'none' 
              : animationState === 'expanding'
              ? 'width 1000ms cubic-bezier(0.4, 0, 0.2, 1)'
              : 'transform 1000ms cubic-bezier(0.4, 0, 0.2, 1), width 1000ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />

        {/* Bottom bar - expands with box, then slides right */}
        <div
          className={`absolute left-1/2 h-[3px] bg-[hsl(340,75%,25%)] ${
            animationState === 'initial' ? 'w-28' : 
            animationState === 'expanding' ? 'w-80' : 
            'w-screen'
          }`}
          style={{
            top: 'calc(50% + 10rem)',
            transform: animationState === 'extending' ? 'translate(calc(-50% + 40px), 0)' : 'translate(-50%, 0)',
            transition: animationState === 'initial' 
              ? 'none' 
              : animationState === 'expanding'
              ? 'width 1000ms cubic-bezier(0.4, 0, 0.2, 1)'
              : 'transform 1000ms cubic-bezier(0.4, 0, 0.2, 1), width 1000ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />

        {/* Left border - part of initial tight square only */}
        <div
          className={`absolute w-[3px] bg-[hsl(340,75%,25%)] ${
            animationState === 'initial' ? 'h-28 opacity-100' : 'h-28 opacity-0'
          }`}
          style={{ 
            top: '50%', 
            left: 'calc(50% - 3.5rem)',
            transform: 'translateY(-50%)',
            transition: animationState === 'initial' 
              ? 'none' 
              : 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />

        {/* Right border - part of initial tight square only */}
        <div
          className={`absolute w-[3px] bg-[hsl(340,75%,25%)] ${
            animationState === 'initial' ? 'h-28 opacity-100' : 'h-28 opacity-0'
          }`}
          style={{ 
            top: '50%', 
            left: 'calc(50% + 3.5rem)',
            transform: 'translateY(-50%)',
            transition: animationState === 'initial' 
              ? 'none' 
              : 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />

        {/* CURA Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="flex items-center justify-center">
            {/* C - burgundy color, stays centered */}
            <span 
              className="text-8xl md:text-9xl font-black leading-none tracking-tighter"
              style={{ 
                color: 'hsl(340, 75%, 25%)',
                transition: 'none'
              }}
            >
              C
            </span>

            {/* URA - Fades and slides in during extension phase only */}
            <span
              className="text-8xl md:text-9xl font-black leading-none tracking-tighter"
              style={{
                color: 'hsl(340, 75%, 25%)',
                opacity: animationState === 'extending' || animationState === 'complete' ? 1 : 0,
                transform: animationState === 'extending' || animationState === 'complete' 
                  ? 'translateX(0)' 
                  : 'translateX(-32px)',
                transition: animationState === 'extending' || animationState === 'complete'
                  ? 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)'
                  : 'none'
              }}
            >
              URA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
