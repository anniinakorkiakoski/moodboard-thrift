import { useState } from 'react';
import { ShoppingBag, Heart, Share2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductCard } from './ProductCard';
import { FilterPanel, FilterState } from './FilterPanel';

// Mock data for demonstration
const mockProducts = [
  {
    id: '1',
    title: 'Vintage Oversized Denim Jacket with Distressed Details',
    price: '$45',
    originalPrice: '$120',
    images: ['https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400'],
    seller: {
      name: 'Emma_Vintage',
      rating: 4.8,
      location: 'Copenhagen'
    },
    platform: 'Vinted',
    condition: 'Very Good',
    size: 'L',
    matchPercentage: 94
  },
  {
    id: '2',
    title: 'Sage Green Linen Wide-Leg Trousers',
    price: '$32',
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'],
    seller: {
      name: 'Nordic_Style',
      rating: 4.9,
      location: 'Stockholm'
    },
    platform: 'Tise',
    condition: 'Like New',
    size: 'M',
    matchPercentage: 89
  },
  {
    id: '3',
    title: 'Cream Wool Blend Oversized Sweater',
    price: '$38',
    originalPrice: '$85',
    images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'],
    seller: {
      name: 'Scandi_Finds',
      rating: 4.7,
      location: 'Oslo'
    },
    platform: 'Emmy',
    condition: 'Good',
    size: 'L',
    matchPercentage: 87
  },
  {
    id: '4',
    title: 'Vintage Leather Crossbody Bag',
    price: '$55',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
    seller: {
      name: 'Vintage_Hunter',
      rating: 4.6,
      location: 'Helsinki'
    },
    platform: 'Etsy',
    condition: 'Very Good',
    matchPercentage: 92
  }
];

interface BundleDisplayProps {
  isSearching?: boolean;
}

export const BundleDisplay = ({ isSearching = false }: BundleDisplayProps) => {
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [bundleItems, setBundleItems] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 200],
    sizes: [],
    location: '',
    condition: [],
    platforms: []
  });

  const handleLike = (id: string) => {
    setLikedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleAddToBundle = (id: string) => {
    setBundleItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const bundleTotal = mockProducts
    .filter(product => bundleItems.includes(product.id))
    .reduce((total, product) => total + parseInt(product.price.replace('$', '')), 0);

  if (isSearching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center space-y-6 shadow-glow max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Finding Your Perfect Matches</h3>
            <p className="text-muted-foreground">
              Our AI is scanning thousands of secondhand items across multiple platforms...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-ocean relative">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Your Curated Thrift Bundle</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We found {mockProducts.length} items that match your style inspiration. 
            Mix and match to create your perfect sustainable wardrobe.
          </p>
        </div>

        {/* Bundle Summary */}
        {bundleItems.length > 0 && (
          <Card className="shadow-glow border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Your Bundle ({bundleItems.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-2xl font-bold text-accent">
                Total: ${bundleTotal}
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Share2 className="w-4 h-4" />
                  Share Bundle
                </Button>
                <Button variant="cta" size="lg">
                  <ShoppingBag className="w-5 h-5" />
                  Order Bundle
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockProducts.map(product => (
            <ProductCard
              key={product.id}
              {...product}
              isLiked={likedItems.includes(product.id)}
              onLike={handleLike}
              onAddToBundle={handleAddToBundle}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="secondary" size="lg">
            Load More Results
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel 
        isOpen={filtersOpen}
        onToggle={() => setFiltersOpen(!filtersOpen)}
        onFiltersChange={setFilters}
      />
    </div>
  );
};