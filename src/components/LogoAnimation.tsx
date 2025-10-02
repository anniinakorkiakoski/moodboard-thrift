import { useEffect, useState } from 'react';

interface LogoAnimationProps {
  onComplete?: () => void;
}

// Seamless, high-end CURA logo formation animation
// Stages: initial (tight box + C) -> expanding (box grows) -> extending (top/bottom extenders slide) -> complete
export const LogoAnimation = ({ onComplete }: LogoAnimationProps) => {
  const [animationState, setAnimationState] = useState<'initial' | 'expanding' | 'extending' | 'complete'>('initial');

  // Dimensions (px) and timings (ms)
  const THICKNESS = 10; // extra thick borders
  const INITIAL_SIZE = 112; // tight box hugging the C
  const FINAL_SIZE = 320; // final logo box

  useEffect(() => {
    // Stage timings for cinematic but snappy effect (~1.8s total)
    const t1 = setTimeout(() => setAnimationState('expanding'), 100);
    const t2 = setTimeout(() => setAnimationState('extending'), 950);
    const t3 = setTimeout(() => {
      setAnimationState('complete');
      onComplete?.();
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  // Box width/height based on stage
  const boxWidth = animationState === 'initial' ? INITIAL_SIZE : FINAL_SIZE;
  const boxHeight = animationState === 'initial' ? INITIAL_SIZE : FINAL_SIZE;

  // Easing for premium feel
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden pointer-events-none">
      <div className="relative w-full h-screen flex items-center justify-center">
        {/* Central Box (persists): animates width/height only so thickness doesn't jump */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
          style={{
            width: boxWidth,
            height: boxHeight,
            transition: animationState === 'initial' ? 'none' : `width 800ms ${ease}, height 800ms ${ease}`,
            willChange: 'width, height',
          }}
        >
          {/* Top edge of the box */}
          <div
            className="absolute left-0 right-0 bg-burgundy z-20"
            style={{ height: THICKNESS, top: 0 }}
          />
          {/* Bottom edge of the box */}
          <div
            className="absolute left-0 right-0 bg-burgundy z-20"
            style={{ height: THICKNESS, bottom: 0 }}
          />
          {/* Left edge of the box */}
          <div
            className="absolute top-0 bottom-0 bg-burgundy z-20"
            style={{ width: THICKNESS, left: 0 }}
          />
          {/* Right edge of the box */}
          <div
            className="absolute top-0 bottom-0 bg-burgundy z-20"
            style={{ width: THICKNESS, right: 0 }}
          />

          {/* C - scales subtly with the box to feel organic */}
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <span
              className="font-black leading-none tracking-tighter text-burgundy"
              style={{
                fontSize: 96,
                transform: animationState === 'initial' ? 'scale(0.88)' : 'scale(1)',
                transition: animationState === 'initial' ? 'none' : `transform 800ms ${ease}`,
                willChange: 'transform',
              }}
            >
              C
            </span>
          </div>
        </div>

        {/* Extenders - appear during extending stage; central box edges remain to avoid visual gaps */}
        {/* Top extender slides left */}
        <div
          className="absolute left-1/2 bg-burgundy z-10"
          style={{
            top: `calc(50% - ${FINAL_SIZE / 2}px)`,
            height: THICKNESS,
            width: '100vw',
            transform:
              animationState === 'extending' || animationState === 'complete'
                ? 'translate(calc(-50% - 64px), 0)'
                : 'translate(-50%, 0)',
            transition:
              animationState === 'initial'
                ? 'none'
                : `transform 700ms ${ease}`,
            willChange: 'transform',
          }}
        />

        {/* Bottom extender slides right */}
        <div
          className="absolute left-1/2 bg-burgundy z-10"
          style={{
            top: `calc(50% + ${FINAL_SIZE / 2}px)`,
            height: THICKNESS,
            width: '100vw',
            transform:
              animationState === 'extending' || animationState === 'complete'
                ? 'translate(calc(-50% + 64px), 0)'
                : 'translate(-50%, 0)',
            transition:
              animationState === 'initial'
                ? 'none'
                : `transform 700ms ${ease}`,
            willChange: 'transform',
          }}
        />

        {/* URA - enters only after extenders start moving for a seamless reveal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="flex items-center justify-center">
            {/* Spacer to align with the existing C visually */}
            <span
              className="font-black leading-none tracking-tighter text-burgundy select-none"
              aria-hidden
              style={{ fontSize: 96, opacity: 0, width: 0 }}
            >
              C
            </span>
            <span
              className="font-black leading-none tracking-tighter text-burgundy"
              style={{
                fontSize: 96,
                opacity: animationState === 'extending' || animationState === 'complete' ? 1 : 0,
                transform:
                  animationState === 'extending' || animationState === 'complete'
                    ? 'translateX(0)'
                    : 'translateX(-32px)',
                transition:
                  animationState === 'initial'
                    ? 'none'
                    : `opacity 600ms ${ease}, transform 600ms ${ease}`,
                willChange: 'opacity, transform',
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
