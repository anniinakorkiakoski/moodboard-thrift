import { ExternalLink, Sparkles } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface VisualSearchResultCardProps {
  result: {
    id: string;
    title: string;
    platform: string;
    price: number;
    currency: string;
    item_url: string;
    image_url?: string | null;
    similarity_score: number;
    match_explanation?: string;
    description?: string;
  };
}

export const VisualSearchResultCard = ({ result }: VisualSearchResultCardProps) => {
  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      vinted: 'bg-orange-500',
      etsy: 'bg-orange-500',
      depop: 'bg-green-500',
      tise: 'bg-blue-500',
      facebook_marketplace: 'bg-blue-500',
      vestiaire_collective: 'bg-black',
      therealreal: 'bg-gray-800',
      thredup: 'bg-blue-600',
      ebay: 'bg-red-600',
      grailed: 'bg-gray-700',
      poshmark: 'bg-pink-600',
    };
    return colors[platform.toLowerCase()] || 'bg-burgundy';
  };

  const formatPlatformName = (platform: string) => {
    return platform
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getSimilarityLabel = (score: number) => {
    if (score >= 0.90) return { label: 'Excellent Match', color: 'bg-green-500' };
    if (score >= 0.80) return { label: 'Great Match', color: 'bg-green-600' };
    if (score >= 0.70) return { label: 'Good Match', color: 'bg-yellow-600' };
    return { label: 'Similar', color: 'bg-gray-500' };
  };

  const similarity = getSimilarityLabel(result.similarity_score);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative aspect-square bg-muted">
          {result.image_url ? (
            <img
              src={result.image_url}
              alt={result.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Sparkles className="w-12 h-12" />
            </div>
          )}
          
          {/* Similarity badge */}
          <div className="absolute top-3 right-3">
            <Badge className={`${similarity.color} text-white text-xs font-bold`}>
              {Math.round(result.similarity_score * 100)}% {similarity.label}
            </Badge>
          </div>

          {/* Platform badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${getPlatformColor(result.platform)} text-white text-xs`}>
              {formatPlatformName(result.platform)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">
            {result.title}
          </h3>

          {/* Match explanation */}
          {result.match_explanation && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">
              <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0 text-burgundy" />
              <span className="leading-relaxed">{result.match_explanation}</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-lg font-bold text-burgundy">
              {result.currency === 'USD' ? '$' : result.currency}
              {result.price.toFixed(2)}
            </span>

            <Button
              size="sm"
              variant="outline"
              asChild
              className="border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground"
            >
              <a href={result.item_url} target="_blank" rel="noopener noreferrer">
                View Item
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
