import { useEffect, useState } from 'react';

interface LogoAnimationProps {
  onComplete?: () => void;
}

// Seamless, high-end CURA logo formation animation
// Stages: initial (tight box + C) -> expanding (box grows) -> extending (top/bottom extenders slide) -> complete
export const LogoAnimation = ({ onComplete }: LogoAnimationProps) => {
  const [animationState, setAnimationState] = useState<'initial' | 'expanding' | 'extending' | 'complete'>('initial');
  const [visibleLetters, setVisibleLetters] = useState<number>(1); // 1=C, 2=CU, 3=CUR, 4=CURA

  // Dimensions (px) and timings (ms)
  const THICKNESS = 10; // extra thick borders
  const INITIAL_SIZE = 112; // tight box hugging the C
  const FINAL_SIZE = 320; // final logo box

  useEffect(() => {
    // Stage timings for cinematic but snappy effect (~2.2s total)
    const t1 = setTimeout(() => setAnimationState('expanding'), 100);
    const t2 = setTimeout(() => setAnimationState('extending'), 950);
    // Letters appear sequentially during extending
    const t3 = setTimeout(() => setVisibleLetters(2), 1050); // U appears
    const t4 = setTimeout(() => setVisibleLetters(3), 1200); // R appears
    const t5 = setTimeout(() => setVisibleLetters(4), 1350); // A appears
    const t6 = setTimeout(() => {
      setAnimationState('complete');
      onComplete?.();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
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

          {/* CURA letters - C moves left as others appear */}
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="flex items-center" style={{ fontSize: 96 }}>
              {['C', 'U', 'R', 'A'].map((letter, index) => (
                <span
                  key={letter}
                  className="font-black leading-none tracking-tighter text-burgundy"
                  style={{
                    opacity: index < visibleLetters ? 1 : 0,
                    transform: index < visibleLetters ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `opacity 300ms ${ease}, transform 300ms ${ease}`,
                    willChange: 'opacity, transform',
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Top extender - full-height burgundy block sliding left */}
        <div
          className="absolute left-1/2 bg-burgundy z-10"
          style={{
            top: `calc(50% - ${FINAL_SIZE / 2}px - ${THICKNESS}px)`,
            height: FINAL_SIZE + THICKNESS * 2,
            width: '100vw',
            transform:
              animationState === 'extending' || animationState === 'complete'
                ? 'translate(calc(-50% - 160px), 0)'
                : 'translate(calc(-50% + 160px), 0)',
            transition:
              animationState === 'initial' || animationState === 'expanding'
                ? 'none'
                : `transform 900ms ${ease}`,
            willChange: 'transform',
          }}
        />

        {/* Bottom extender - full-height burgundy block sliding right */}
        <div
          className="absolute left-1/2 bg-burgundy z-10"
          style={{
            top: `calc(50% - ${FINAL_SIZE / 2}px - ${THICKNESS}px)`,
            height: FINAL_SIZE + THICKNESS * 2,
            width: '100vw',
            transform:
              animationState === 'extending' || animationState === 'complete'
                ? 'translate(calc(-50% + 160px), 0)'
                : 'translate(calc(-50% - 160px), 0)',
            transition:
              animationState === 'initial' || animationState === 'expanding'
                ? 'none'
                : `transform 900ms ${ease}`,
            willChange: 'transform',
          }}
        />
      </div>
    </div>
  );
};
