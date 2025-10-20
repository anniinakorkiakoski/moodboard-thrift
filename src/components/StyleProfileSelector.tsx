import { useState, useEffect, KeyboardEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStyleProfile } from '@/hooks/useStyleProfile';
import { Sparkles, Heart, Plus, X } from 'lucide-react';

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

      {/* Selected Collections - Split Layout */}
      {(selectedStyles.length > 0 || selectedBrands.length > 0) && (
        <div className="grid md:grid-cols-2 gap-16">
          {/* Your Style Collection - Left Side */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4 text-burgundy" />
              <h3 className="text-xs font-medium tracking-widest uppercase text-burgundy">
                Your Style
              </h3>
            </div>
            <div className="space-y-6">
              {selectedStyles.map(style => (
                <div
                  key={style}
                  className="group flex items-center cursor-pointer"
                  onClick={() => STYLE_TAGS.includes(style) ? toggleStyle(style) : removeStyle(style)}
                >
                  {/* Left burgundy bar */}
                  <div className="flex-1 h-12 bg-burgundy relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <svg className="w-full h-full" viewBox="0 0 100 48" preserveAspectRatio="none">
                        <path d="M0,24 Q20,18 40,24 Q60,30 80,24 Q90,21 100,20" 
                              stroke="hsl(330 60% 75%)" strokeWidth="0.5" fill="none" opacity="0.6"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Center transparent square with text */}
                  <div className="w-48 h-12 bg-transparent flex items-center justify-center flex-shrink-0 border-y-2 border-burgundy relative group-hover:bg-burgundy/5 transition-colors">
                    <p className="text-xs font-light text-burgundy tracking-wider uppercase text-center px-2">
                      {style}
                    </p>
                    {!STYLE_TAGS.includes(style) && (
                      <X className="absolute -top-2 -right-2 w-4 h-4 bg-burgundy text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  
                  {/* Right burgundy bar */}
                  <div className="flex-1 h-12 bg-burgundy relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <svg className="w-full h-full" viewBox="0 0 100 48" preserveAspectRatio="none" style={{ transform: 'scaleX(-1)' }}>
                        <path d="M0,24 Q20,18 40,24 Q60,30 80,24 Q90,21 100,20" 
                              stroke="hsl(330 60% 75%)" strokeWidth="0.5" fill="none" opacity="0.6"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Brand Wishlist - Right Side */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 justify-center">
              <Heart className="w-4 h-4 text-burgundy" />
              <h3 className="text-xs font-medium tracking-widest uppercase text-burgundy">
                Your Brands
              </h3>
            </div>
            <div className="space-y-6">
              {selectedBrands.map(brand => (
                <div
                  key={brand}
                  className="group flex items-center cursor-pointer"
                  onClick={() => DREAM_BRANDS.includes(brand) ? toggleBrand(brand) : removeBrand(brand)}
                >
                  {/* Left burgundy bar */}
                  <div className="flex-1 h-12 bg-burgundy relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <svg className="w-full h-full" viewBox="0 0 100 48" preserveAspectRatio="none">
                        <path d="M0,30 Q25,22 50,28 Q75,34 100,28" 
                              stroke="hsl(330 60% 75%)" strokeWidth="0.5" fill="none" opacity="0.6"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Center transparent square with text */}
                  <div className="w-48 h-12 bg-transparent flex items-center justify-center flex-shrink-0 border-y-2 border-burgundy relative group-hover:bg-burgundy/5 transition-colors">
                    <p className="text-xs font-light text-burgundy tracking-wider uppercase text-center px-2">
                      {brand}
                    </p>
                    {!DREAM_BRANDS.includes(brand) && (
                      <X className="absolute -top-2 -right-2 w-4 h-4 bg-burgundy text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  
                  {/* Right burgundy bar */}
                  <div className="flex-1 h-12 bg-burgundy relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <svg className="w-full h-full" viewBox="0 0 100 48" preserveAspectRatio="none" style={{ transform: 'scaleX(-1)' }}>
                        <path d="M0,30 Q25,22 50,28 Q75,34 100,28" 
                              stroke="hsl(330 60% 75%)" strokeWidth="0.5" fill="none" opacity="0.6"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selection Areas - Split Layout */}
      <div className="grid md:grid-cols-2 gap-16">
        {/* Style Aesthetics - Left Side */}
        <Card className="p-10 space-y-8 bg-gradient-to-br from-background to-burgundy/5">
          <div className="space-y-2 text-center">
            <div className="flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4 text-burgundy" />
              <h3 className="text-xs font-medium tracking-widest uppercase text-burgundy">
                Style Aesthetics
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Select styles that define your aesthetic
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {STYLE_TAGS.map(style => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`
                  p-3 rounded border transition-all text-xs font-light tracking-wide
                  ${selectedStyles.includes(style)
                    ? 'border-burgundy bg-burgundy/5 text-burgundy'
                    : 'border-border hover:border-burgundy/50'
                  }
                `}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Add Custom Style */}
          <div className="pt-6 border-t space-y-3">
            <Input
              placeholder="Add custom aesthetic"
              value={customStyleInput}
              onChange={(e) => setCustomStyleInput(e.target.value)}
              onKeyPress={handleStyleKeyPress}
              className="h-10 text-xs"
            />
            <Button
              onClick={addCustomStyle}
              variant="outline"
              type="button"
              className="w-full h-10 text-xs border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
            >
              <Plus className="w-3 h-3 mr-2" />
              Add Style
            </Button>
          </div>
        </Card>

        {/* Brand Universe - Right Side */}
        <Card className="p-10 space-y-8 bg-gradient-to-br from-background to-burgundy/5">
          <div className="space-y-2 text-center">
            <div className="flex items-center gap-2 justify-center">
              <Heart className="w-4 h-4 text-burgundy" />
              <h3 className="text-xs font-medium tracking-widest uppercase text-burgundy">
                Brand Universe
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose brands you love or hunt for
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DREAM_BRANDS.map(brand => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className={`
                  p-3 rounded border transition-all text-xs font-light tracking-wide
                  ${selectedBrands.includes(brand)
                    ? 'border-burgundy bg-burgundy/5 text-burgundy'
                    : 'border-border hover:border-burgundy/50'
                  }
                `}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Add Custom Brand */}
          <div className="pt-6 border-t space-y-3">
            <Input
              placeholder="Add dream brand"
              value={customBrandInput}
              onChange={(e) => setCustomBrandInput(e.target.value)}
              onKeyPress={handleBrandKeyPress}
              className="h-10 text-xs"
            />
            <Button
              onClick={addCustomBrand}
              variant="outline"
              type="button"
              className="w-full h-10 text-xs border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
            >
              <Plus className="w-3 h-3 mr-2" />
              Add Brand
            </Button>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pb-16">
        <Button 
          onClick={handleSave} 
          size="xl"
          className="min-w-[300px] bg-burgundy hover:bg-burgundy/90 text-xs tracking-widest"
          disabled={saving}
        >
          {saving ? "SAVING..." : "SAVE MY STYLE PROFILE"}
        </Button>
      </div>
    </div>
  );
};
