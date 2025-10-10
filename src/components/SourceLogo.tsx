interface SourceLogoProps {
  name: string;
}

export const SourceLogo = ({ name }: SourceLogoProps) => {
  const getLogoStyle = (name: string) => {
    switch (name) {
      case 'Vinted':
        return { fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '-0.02em' };
      case 'Depop':
        return { fontFamily: 'Inter, sans-serif', fontWeight: 800, letterSpacing: '0.05em' };
      case 'Vestiaire Collective':
        return { fontFamily: 'serif', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase' as const };
      case 'The RealReal':
        return { fontFamily: 'serif', fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase' as const };
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
      height="32" 
      viewBox="0 0 200 32" 
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      <text
        x="100"
        y="20"
        textAnchor="middle"
        fill="currentColor"
        style={{
          ...style,
          fontSize: name.length > 15 ? '10px' : '14px',
        }}
      >
        {name}
      </text>
    </svg>
  );
};
