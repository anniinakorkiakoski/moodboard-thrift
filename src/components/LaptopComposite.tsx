import React from 'react';

interface LaptopCompositeProps {
  bgSrc: string; // Laptop photo
  screenSrc: string; // Exact screenshot to place on screen
  alt?: string;
}

// Renders the provided screenshot precisely over a laptop photo using CSS transforms
// so we avoid lossy image editing and keep your exact screenshot.
export const LaptopComposite: React.FC<LaptopCompositeProps> = ({ bgSrc, screenSrc, alt = 'Laptop showing CURA Gallery' }) => {
  return (
    <figure className="relative w-full select-none">
      <img src={bgSrc} alt="Laptop photo" className="w-full h-auto pointer-events-none" />
      {/* Screen overlay - tuned to the geometry of the uploaded laptop image */}
      <img
        src={screenSrc}
        alt={alt}
        className="absolute pointer-events-none"
        style={{
          // Position inside the display bezel (percentages tuned visually)
          top: '6.5%',
          left: '17.8%',
          width: '64.2%',
          // Perspective/angle to match the photographed screen
          transform: 'skewY(-6deg) rotate(-1.5deg) perspective(900px) rotateX(8deg)',
          // Subtle mask to respect inner bezel curvature
          clipPath: 'polygon(1.5% 3.2%, 98.5% 3.2%, 100% 96.8%, 0% 96.8%)',
        }}
      />
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
};
