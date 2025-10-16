interface SourceLogoProps {
  name: string;
}

export const SourceLogo = ({ name }: SourceLogoProps) => {
  // Logo image mapping - using public folder logos where available
  const logoImages: Record<string, string> = {
    'Depop': '/logos/depop.png',
    'Vestiaire Collective': '/logos/vestiaire.png',
    'The RealReal': '/logos/therealreal.png',
  };

  // If we have a logo image, use it
  if (logoImages[name]) {
    return (
      <img 
        src={logoImages[name]} 
        alt={name}
        className="h-12 w-auto object-contain mix-blend-multiply"
        style={{ background: 'transparent' }}
      />
    );
  }

  // Otherwise use styled text
  const getLogoStyle = (name: string) => {
    switch (name) {
      case 'Vinted':
        return { fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '-0.02em' };
      case 'thredUP':
        return { fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '-0.01em' };
      case 'eBay':
        return { fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '-0.03em' };
      case 'Grailed':
        return { fontFamily: 'Inter, sans-serif', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' as const };
      case 'Poshmark':
        return { fontFamily: 'Inter, sans-serif', fontWeight: 800, letterSpacing: '0.02em', textTransform: 'uppercase' as const };
      case 'Etsy':
        return { fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '0.03em' };
      case 'ASOS Marketplace':
        return { fontFamily: 'Inter, sans-serif', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' as const };
      case 'Zalando Pre-Owned':
        return { fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' as const };
      default:
        return { fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '0.02em' };
    }
  };

  const style = getLogoStyle(name);

  return (
    <svg 
      width="auto" 
      height="48" 
      viewBox="0 0 200 48" 
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      <text
        x="100"
        y="30"
        textAnchor="middle"
        fill="currentColor"
        style={{
          ...style,
          fontSize: name.length > 15 ? '14px' : '18px',
        }}
      >
        {name}
      </text>
    </svg>
  );
};
