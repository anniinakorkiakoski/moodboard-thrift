import { Heart, MapPin, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  images: string[];
  seller: {
    name: string;
    rating: number;
    location: string;
  };
  platform: string;
  condition: string;
  size?: string;
  matchPercentage?: number;
  onLike?: (id: string) => void;
  onAddToBundle?: (id: string) => void;
  isLiked?: boolean;
}

export const ProductCard = ({
  id,
  title,
  price,
  originalPrice,
  images,
  seller,
  platform,
  condition,
  size,
  matchPercentage,
  onLike,
  onAddToBundle,
  isLiked = false
}: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-glow hover:scale-105 bg-card">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Match percentage badge */}
        {matchPercentage && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-bold">
            {matchPercentage}% Match
          </Badge>
        )}
        
        {/* Like button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background/90 ${
            isLiked ? 'text-accent' : 'text-muted-foreground'
          }`}
          onClick={() => onLike?.(id)}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </Button>

        {/* Platform badge */}
        <Badge variant="secondary" className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm">
          {platform}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">{price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-current text-yellow-500" />
            <span>{seller.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-20">{seller.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {condition}
            </Badge>
            {size && (
              <Badge variant="outline" className="text-xs">
                Size {size}
              </Badge>
            )}
          </div>
        </div>

        <Button 
          variant="cta" 
          size="sm" 
          className="w-full mt-3"
          onClick={() => onAddToBundle?.(id)}
        >
          Add to Bundle
        </Button>
      </CardContent>
    </Card>
  );
};