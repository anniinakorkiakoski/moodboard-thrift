import { useState, useEffect, KeyboardEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  // Separate predefined tags from custom ones
  const customStyles = selectedStyles.filter(s => !STYLE_TAGS.includes(s));
  const customBrands = selectedBrands.filter(b => !DREAM_BRANDS.includes(b));

  if (loading) {
    return <div className="text-center py-8">Loading your style profile...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Define Your Style</h2>
        <p className="text-muted-foreground">
          Help us understand your fashion preferences to find the perfect pieces for you
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Your Style Vibe</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Select styles that resonate with you, or add your own custom descriptors
          </p>
          <div className="flex flex-wrap gap-2">
            {STYLE_TAGS.map(style => (
              <Badge
                key={style}
                variant={selectedStyles.includes(style) ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => toggleStyle(style)}
              >
                {style}
              </Badge>
            ))}
          </div>
          
          {/* Custom styles display */}
          {customStyles.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {customStyles.map(style => (
                <Badge
                  key={style}
                  variant="default"
                  className="cursor-pointer hover:scale-105 transition-transform gap-1"
                >
                  {style}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeStyle(style)}
                  />
                </Badge>
              ))}
            </div>
          )}

          {/* Add custom style input */}
          <div className="flex gap-2">
            <Input
              placeholder="Add your own style descriptor (e.g., 'French Riviera', 'Dark Minimalist')"
              value={customStyleInput}
              onChange={(e) => setCustomStyleInput(e.target.value)}
              onKeyPress={handleStyleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={addCustomStyle}
              size="icon"
              variant="outline"
              type="button"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-semibold">Dream Brands</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Pick your favorite brands, or add brands you're hunting for
          </p>
          <div className="flex flex-wrap gap-2">
            {DREAM_BRANDS.map(brand => (
              <Badge
                key={brand}
                variant={selectedBrands.includes(brand) ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => toggleBrand(brand)}
              >
                {brand}
              </Badge>
            ))}
          </div>

          {/* Custom brands display */}
          {customBrands.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {customBrands.map(brand => (
                <Badge
                  key={brand}
                  variant="default"
                  className="cursor-pointer hover:scale-105 transition-transform gap-1"
                >
                  {brand}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeBrand(brand)}
                  />
                </Badge>
              ))}
            </div>
          )}

          {/* Add custom brand input */}
          <div className="flex gap-2">
            <Input
              placeholder="Add your own dream brand (e.g., 'Lemaire', 'Our Legacy')"
              value={customBrandInput}
              onChange={(e) => setCustomBrandInput(e.target.value)}
              onKeyPress={handleBrandKeyPress}
              className="flex-1"
            />
            <Button
              onClick={addCustomBrand}
              size="icon"
              variant="outline"
              type="button"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full"
          size="lg"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save My Style Profile"}
        </Button>
      </Card>
    </div>
  );
};
