import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStyleProfile } from '@/hooks/useStyleProfile';
import { Sparkles, Heart } from 'lucide-react';

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
            Select the styles that resonate with you
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-semibold">Dream Brands</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Pick your favorite brands to help us find similar pieces
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
