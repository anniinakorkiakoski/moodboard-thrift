import { useState } from 'react';
import { Heart, Trash2, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductCard } from './ProductCard';

// Mock data for demonstration
const mockFinds = [
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
  },
  {
    id: '5',
    title: 'Black Silk Midi Dress',
    price: '$68',
    originalPrice: '$180',
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'],
    seller: {
      name: 'Luxury_Finds',
      rating: 4.9,
      location: 'Berlin'
    },
    platform: 'The RealReal',
    condition: 'Like New',
    size: 'S',
    matchPercentage: 91
  },
  {
    id: '6',
    title: 'Camel Wool Coat',
    price: '$95',
    originalPrice: '$280',
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400'],
    seller: {
      name: 'Classic_Style',
      rating: 4.8,
      location: 'Paris'
    },
    platform: 'Depop',
    condition: 'Very Good',
    size: 'M',
    matchPercentage: 88
  }
];

interface StylerFindsProps {
  searchedImage?: { url: string; caption: string } | null;
  onStartOver: () => void;
}

export const StylerFinds = ({ searchedImage, onStartOver }: StylerFindsProps) => {
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleLike = (id: string) => {
    setLikedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleRemove = (id: string) => {
    // In a real app, this would remove the item from the finds
    console.log('Remove item:', id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Header Section */}
        <div className="mb-16 space-y-8">
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-light font-serif text-primary tracking-tight">
              Your Stylist's Finds
            </h1>
            <p className="text-lg font-light text-text-refined max-w-2xl mx-auto leading-relaxed">
              Curated secondhand pieces that match your aesthetic
            </p>
          </div>

          {/* Search context */}
          {searchedImage && (
            <Card className="max-w-md mx-auto bg-card/50 border-muted">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-24 h-24 mx-auto overflow-hidden border border-muted">
                  <img 
                    src={searchedImage.url} 
                    alt="Search inspiration"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-light text-text-refined uppercase tracking-wider">
                    Finding pieces inspired by
                  </p>
                  {searchedImage.caption && (
                    <p className="text-sm font-light text-primary italic">
                      "{searchedImage.caption}"
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <span className="text-sm font-light text-text-refined">
                {mockFinds.length} pieces found
              </span>
              <div className="h-4 w-px bg-muted" />
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-muted' : ''}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-muted' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={onStartOver}
              className="border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground"
            >
              New Search
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
            : 'space-y-6'
        }`}>
          {mockFinds.map((product, index) => (
            <div 
              key={product.id}
              className={`${
                viewMode === 'grid' 
                  ? `${index % 7 === 1 ? 'mt-8' : ''} ${index % 7 === 3 ? '-mt-6' : ''} ${index % 7 === 5 ? 'mt-12' : ''}` 
                  : ''
              }`}
            >
              {viewMode === 'grid' ? (
                <ProductCard
                  {...product}
                  isLiked={likedItems.includes(product.id)}
                  onLike={handleLike}
                  onAddToBundle={() => {}}
                />
              ) : (
                <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
                  <div className="flex">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-6 flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="font-medium text-primary line-clamp-1">{product.title}</h3>
                        <p className="text-lg font-bold text-burgundy">{product.price}</p>
                        <div className="flex items-center gap-4 text-sm text-text-refined">
                          <span>{product.platform}</span>
                          <span>{product.condition}</span>
                          <span>{product.matchPercentage}% match</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(product.id)}
                          className={likedItems.includes(product.id) ? 'text-burgundy' : ''}
                        >
                          <Heart className={`w-4 h-4 ${likedItems.includes(product.id) ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )}
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-16">
          <Button variant="outline" size="lg" className="border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground">
            Load More Finds
          </Button>
        </div>
      </div>
    </div>
  );
};