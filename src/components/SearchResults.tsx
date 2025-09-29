import { ExternalLink, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchResult } from '@/hooks/useVisualSearch';

interface SearchResultsProps {
  results: SearchResult[];
  onRequestThrifter?: () => void;
}

export const SearchResults = ({ results, onRequestThrifter }: SearchResultsProps) => {
  if (results.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            No Curated Matches Found
          </CardTitle>
          <CardDescription>
            We couldn't find items that meet our precision standards for this piece.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            But don't worry! Our professional thrifters can source this exact item for you.
          </p>
          <Button onClick={onRequestThrifter} className="w-full">
            Request Personal Thrift Service
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      vinted: 'bg-teal-500',
      etsy: 'bg-orange-500',
      depop: 'bg-red-500',
      tise: 'bg-blue-500',
      facebook_marketplace: 'bg-blue-600',
      emmy: 'bg-purple-500',
      other_vintage: 'bg-gray-500',
    };
    return colors[platform] || 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Curated Matches</h2>
        <p className="text-muted-foreground">
          {results.length} precise {results.length === 1 ? 'match' : 'matches'} found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result) => (
          <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {result.image_url && (
              <div className="aspect-square bg-muted">
                <img 
                  src={result.image_url} 
                  alt={result.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg line-clamp-2">{result.title}</CardTitle>
                <Badge className={getPlatformColor(result.platform)}>
                  {result.platform.replace('_', ' ')}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {result.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {result.currency} {result.price.toFixed(2)}
                </span>
                <Badge variant="outline">
                  {(result.similarity_score * 100).toFixed(0)}% match
                </Badge>
              </div>
              <Button asChild className="w-full">
                <a 
                  href={result.item_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  View Item <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground mb-4">
            Can't find exactly what you're looking for?
          </p>
          <Button onClick={onRequestThrifter} variant="outline" className="w-full">
            Request Personal Thrift Service
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};