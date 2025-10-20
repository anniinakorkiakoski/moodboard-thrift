import { useState, useEffect, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStyleProfile } from '@/hooks/useStyleProfile';
import { Plus, X } from 'lucide-react';

const STYLE_TAGS = [
  'Scandi',
  'Minimalist',
  'Classic',
  'Streetwear',
  'Sporty',
  'Chic',
  'Casual',
  'Smart Casual',
  'Experimental',
  'Indie',
  'Grunge',
  'Basic',
  'Girly',
  'Elegant',
  'Office',
  'Maximalist',
  'Americana',
  'Vintage',
  'Alternative',
  'Playful',
  'Fun',
  'Boho/Hippie',
  'Old Money',
  'Business Casual',
  'Unique',
  'Relaxed',
  'Everyday',
  'Classy',
  'Simple',
  'Dark Colors',
  'Y2K',
  'Engineer',
  'Skatewear',
  'Gorpcore',
  'Japanese Influenced',
  'Mixture/Combination',
];

const DREAM_BRANDS = [
  'Acne Studios',
  'Maison Margiela',
  'Prada',
  'Gucci',
  'Hermès',
  'Chanel',
  'Dior',
  'Bottega Veneta',
  'Loewe',
  'Balenciaga',
  'Saint Laurent',
  'Valentino',
  'Céline',
  'The Row',
  'Comme des Garçons',
  'Yohji Yamamoto',
  'Issey Miyake',
  'Sacai',
  'Junya Watanabe',
  'Visvim',
  'Kapital',
  'Porter-Yoshida',
  'Nike',
  'Adidas',
  'Yankees',
  'Oresund Iris',
  'Hand Me Over',
  'Free People',
  'COS',
  'Ganni',
  'Stussy',
  'Carhartt',
  'Patagonia',
  '& Other Stories',
  'Arket',
  'Weekday',
  'A.P.C.',
  'Lemaire',
  'Uniqlo',
  'Muji',
];

export const StyleProfileSelector = () => {
  const { profile, loading, saving, updateProfile } = useStyleProfile();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [customStyleInput, setCustomStyleInput] = useState('');
  const [customBrandInput, setCustomBrandInput] = useState('');

  useEffect(() => {
    if (profile) {
      setSelectedStyles(profile.style_tags || []);
      setSelectedBrands(profile.dream_brands || []);
    }
  }, [profile]);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const addCustomStyle = () => {
    const trimmed = customStyleInput.trim();
    if (trimmed && !selectedStyles.includes(trimmed)) {
      setSelectedStyles(prev => [...prev, trimmed]);
      setCustomStyleInput('');
    }
  };

  const addCustomBrand = () => {
    const trimmed = customBrandInput.trim();
    if (trimmed && !selectedBrands.includes(trimmed)) {
      setSelectedBrands(prev => [...prev, trimmed]);
      setCustomBrandInput('');
    }
  };

  const handleStyleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomStyle();
    }
  };

  const handleBrandKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomBrand();
    }
  };

  const removeStyle = (style: string) => {
    setSelectedStyles(prev => prev.filter(s => s !== style));
  };

  const removeBrand = (brand: string) => {
    setSelectedBrands(prev => prev.filter(b => b !== brand));
  };

  const handleSave = () => {
    updateProfile({
      style_tags: selectedStyles,
      dream_brands: selectedBrands
    });
  };

  if (loading) {
    return <div className="text-center py-8 text-sm">Loading your style profile...</div>;
  }

  return (
    <div className="space-y-20 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="text-center space-y-6 pt-12">
        <h2 className="text-5xl md:text-6xl font-black tracking-tight text-burgundy uppercase">
          Define Your Style
        </h2>
        <div className="w-16 h-px bg-burgundy/40 mx-auto"></div>
        <p className="text-sm md:text-base font-light text-foreground/70 leading-loose max-w-xl mx-auto font-mono">
          Curate your fashion DNA to discover pieces that truly resonate with your aesthetic
        </p>
      </div>

      {/* Selected Items Display */}
      {(selectedStyles.length > 0 || selectedBrands.length > 0) && (
        <div className="grid md:grid-cols-2 gap-12">
          {/* Your Style Tags */}
          {selectedStyles.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-px bg-burgundy/40 mx-auto mb-4"></div>
                <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-burgundy">
                  Your Style
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedStyles.map(style => (
                  <button
                    key={style}
                    onClick={() => STYLE_TAGS.includes(style) ? toggleStyle(style) : removeStyle(style)}
                    className="group px-4 py-2 bg-burgundy text-white text-xs font-mono uppercase tracking-wide hover:bg-burgundy/80 transition-colors relative"
                  >
                    {style}
                    <X className="absolute -top-1 -right-1 w-3 h-3 bg-white text-burgundy rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Your Brand Tags */}
          {selectedBrands.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-px bg-burgundy/40 mx-auto mb-4"></div>
                <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-burgundy">
                  Your Brands
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedBrands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => DREAM_BRANDS.includes(brand) ? toggleBrand(brand) : removeBrand(brand)}
                    className="group px-4 py-2 bg-burgundy text-white text-xs font-mono uppercase tracking-wide hover:bg-burgundy/80 transition-colors relative"
                  >
                    {brand}
                    <X className="absolute -top-1 -right-1 w-3 h-3 bg-white text-burgundy rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selection Areas */}
      <div className="space-y-20">
        {/* Style Aesthetics Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="text-xs font-bold text-burgundy uppercase tracking-[0.3em]">
              Style Aesthetics
            </div>
            <div className="w-16 h-px bg-burgundy/40 mx-auto"></div>
            <p className="text-sm font-light text-foreground/60 font-mono">
              Select styles that define your aesthetic
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
            {STYLE_TAGS.map(style => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`
                  px-4 py-3 text-xs font-mono uppercase tracking-wide transition-all border
                  ${selectedStyles.includes(style)
                    ? 'bg-burgundy text-white border-burgundy'
                    : 'bg-white text-foreground border-foreground/20 hover:border-burgundy'
                  }
                `}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Add Custom Style */}
          <div className="max-w-md mx-auto space-y-3">
            <Input
              placeholder="Add your own style tag"
              value={customStyleInput}
              onChange={(e) => setCustomStyleInput(e.target.value)}
              onKeyPress={handleStyleKeyPress}
              className="h-10 text-xs font-mono border-foreground/20"
            />
            <Button
              onClick={addCustomStyle}
              variant="outline"
              type="button"
              className="w-full h-10 text-xs font-mono border-burgundy text-burgundy hover:bg-burgundy hover:text-white uppercase tracking-wide"
            >
              <Plus className="w-3 h-3 mr-2" />
              Add Custom Style
            </Button>
          </div>
        </div>

        {/* Brand Universe Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="text-xs font-bold text-burgundy uppercase tracking-[0.3em]">
              Brand Universe
            </div>
            <div className="w-16 h-px bg-burgundy/40 mx-auto"></div>
            <p className="text-sm font-light text-foreground/60 font-mono">
              Choose brands you love or hunt for
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
            {DREAM_BRANDS.map(brand => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className={`
                  px-4 py-3 text-xs font-mono uppercase tracking-wide transition-all border
                  ${selectedBrands.includes(brand)
                    ? 'bg-burgundy text-white border-burgundy'
                    : 'bg-white text-foreground border-foreground/20 hover:border-burgundy'
                  }
                `}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Add Custom Brand */}
          <div className="max-w-md mx-auto space-y-3">
            <Input
              placeholder="Add your dream brand"
              value={customBrandInput}
              onChange={(e) => setCustomBrandInput(e.target.value)}
              onKeyPress={handleBrandKeyPress}
              className="h-10 text-xs font-mono border-foreground/20"
            />
            <Button
              onClick={addCustomBrand}
              variant="outline"
              type="button"
              className="w-full h-10 text-xs font-mono border-burgundy text-burgundy hover:bg-burgundy hover:text-white uppercase tracking-wide"
            >
              <Plus className="w-3 h-3 mr-2" />
              Add Custom Brand
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pb-16 pt-8">
        <Button 
          onClick={handleSave} 
          variant="cta"
          size="xl"
          className="uppercase tracking-wider font-mono"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save My Style Profile"}
        </Button>
      </div>
    </div>
  );
};
