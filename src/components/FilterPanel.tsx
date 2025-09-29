import { useState } from 'react';
import { SlidersHorizontal, MapPin, DollarSign, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FilterPanelProps {
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export interface FilterState {
  priceRange: [number, number];
  sizes: string[];
  location: string;
  condition: string[];
  platforms: string[];
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CONDITIONS = ['Like New', 'Very Good', 'Good', 'Fair'];
const PLATFORMS = ['Vinted', 'Tise', 'Emmy', 'Etsy', 'Facebook Marketplace', 'Depop'];

export const FilterPanel = ({ onFiltersChange, isOpen, onToggle }: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 200],
    sizes: [],
    location: '',
    condition: [],
    platforms: []
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const toggleArrayFilter = (key: 'sizes' | 'condition' | 'platforms', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilters({ [key]: newArray });
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      priceRange: [0, 200],
      sizes: [],
      location: '',
      condition: [],
      platforms: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  if (!isOpen) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <Button 
          variant="secondary" 
          size="lg"
          onClick={onToggle}
          className="shadow-glow bg-card/90 backdrop-blur-sm"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed top-6 right-6 w-96 max-h-[90vh] overflow-y-auto">
        <Card className="shadow-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Refine Your Search
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              ✕
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <DollarSign className="w-4 h-4" />
                Price Range
              </Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                min={0}
                max={500}
                step={5}
                className="py-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <Input
                placeholder="Enter city or postal code"
                value={filters.location}
                onChange={(e) => updateFilters({ location: e.target.value })}
              />
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <Ruler className="w-4 h-4" />
                Sizes
              </Label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(size => (
                  <Badge
                    key={size}
                    variant={filters.sizes.includes(size) ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary/20"
                    onClick={() => toggleArrayFilter('sizes', size)}
                  >
                    {size}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div className="space-y-3">
              <Label className="font-semibold">Condition</Label>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map(condition => (
                  <Badge
                    key={condition}
                    variant={filters.condition.includes(condition) ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary/20"
                    onClick={() => toggleArrayFilter('condition', condition)}
                  >
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div className="space-y-3">
              <Label className="font-semibold">Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(platform => (
                  <Badge
                    key={platform}
                    variant={filters.platforms.includes(platform) ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary/20 text-xs"
                    onClick={() => toggleArrayFilter('platforms', platform)}
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={clearFilters} className="flex-1">
                Clear All
              </Button>
              <Button variant="cta" onClick={onToggle} className="flex-1">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};