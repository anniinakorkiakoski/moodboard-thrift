import { useState, useEffect, KeyboardEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStyleProfile } from '@/hooks/useStyleProfile';
import { Sparkles, Heart, Plus, X } from 'lucide-react';

const STYLE_TAGS = [
  'Copenhagen Style',
  'Stockholm Style',
  'Bohemian',
  'Sporty',
  '90s',
  'Indie',
  'Model Off Duty',
  'Preppy',
  'Minimalist',
  'Vintage',
  'Grunge',
  'Y2K',
  'Streetwear',
  'Cottagecore',
  'Dark Academia',
  'Clean Girl',
];

const DREAM_BRANDS = [
  'Acne Studios',
  'Maison Margiela',
  'Prada',
  'Yankees',
  'Nike',
  'Adidas',
  'Oresund Iris',
  'Hand Me Over',
  'Free People',
  'The Row',
  'COS',
  'Ganni',
  'Stussy',
  'Carhartt',
  'Patagonia',
  '& Other Stories',
  'Arket',
  'Weekday',
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
    return <div className="text-center py-8">Loading your style profile...</div>;
  }

  return (
    <div className="space-y-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 pt-8">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Define Your Style</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Curate your fashion DNA to discover pieces that truly resonate with your aesthetic
        </p>
      </div>

      {/* Selected Collections - Only show if items are selected */}
      {(selectedStyles.length > 0 || selectedBrands.length > 0) && (
        <div className="space-y-12">
          {selectedStyles.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-semibold">Your Style Collection</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {selectedStyles.map(style => (
                  <div
                    key={style}
                    className="group relative bg-card border-2 border-burgundy rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => STYLE_TAGS.includes(style) ? toggleStyle(style) : removeStyle(style)}
                  >
                    <p className="text-sm font-medium text-center break-words">{style}</p>
                    {!STYLE_TAGS.includes(style) && (
                      <X className="absolute -top-2 -right-2 w-5 h-5 bg-burgundy text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedBrands.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-semibold">Your Brand Wishlist</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {selectedBrands.map(brand => (
                  <div
                    key={brand}
                    className="group relative bg-card border-2 border-burgundy rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => DREAM_BRANDS.includes(brand) ? toggleBrand(brand) : removeBrand(brand)}
                  >
                    <p className="text-sm font-medium text-center break-words">{brand}</p>
                    {!DREAM_BRANDS.includes(brand) && (
                      <X className="absolute -top-2 -right-2 w-5 h-5 bg-burgundy text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selection Areas */}
      <div className="space-y-16">
        {/* Style Vibe Section */}
        <Card className="p-8 md:p-12 space-y-8 bg-gradient-to-br from-background to-primary/5">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-semibold">Style Aesthetics</h3>
            </div>
            <p className="text-muted-foreground">
              Select styles that define your aesthetic, or create your own unique descriptors
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {STYLE_TAGS.map(style => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-sm font-medium
                  ${selectedStyles.includes(style)
                    ? 'border-burgundy bg-burgundy/5 text-burgundy scale-105'
                    : 'border-border hover:border-primary/50 hover:scale-105'
                  }
                `}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Add Custom Style */}
          <div className="pt-8 border-t">
            <div className="flex gap-3">
              <Input
                placeholder="Add your own aesthetic (e.g., 'Scandi Minimalist', 'Dark Academia')"
                value={customStyleInput}
                onChange={(e) => setCustomStyleInput(e.target.value)}
                onKeyPress={handleStyleKeyPress}
                className="flex-1 h-12 text-base"
              />
              <Button
                onClick={addCustomStyle}
                size="lg"
                variant="outline"
                type="button"
                className="px-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </Card>

        {/* Dream Brands Section */}
        <Card className="p-8 md:p-12 space-y-8 bg-gradient-to-br from-background to-accent/5">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-accent" />
              <h3 className="text-2xl font-semibold">Brand Universe</h3>
            </div>
            <p className="text-muted-foreground">
              Choose brands you love, or add niche labels you're hunting for
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {DREAM_BRANDS.map(brand => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-sm font-medium
                  ${selectedBrands.includes(brand)
                    ? 'border-burgundy bg-burgundy/5 text-burgundy scale-105'
                    : 'border-border hover:border-accent/50 hover:scale-105'
                  }
                `}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Add Custom Brand */}
          <div className="pt-8 border-t">
            <div className="flex gap-3">
              <Input
                placeholder="Add your dream brand (e.g., 'Lemaire', 'Our Legacy', 'Jil Sander')"
                value={customBrandInput}
                onChange={(e) => setCustomBrandInput(e.target.value)}
                onKeyPress={handleBrandKeyPress}
                className="flex-1 h-12 text-base"
              />
              <Button
                onClick={addCustomBrand}
                size="lg"
                variant="outline"
                type="button"
                className="px-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pb-16">
        <Button 
          onClick={handleSave} 
          size="xl"
          className="min-w-[300px]"
          disabled={saving}
        >
          {saving ? "Saving Your Style..." : "Save My Style Profile"}
        </Button>
      </div>
    </div>
  );
};
