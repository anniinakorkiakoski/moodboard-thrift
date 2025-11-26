import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface SearchResult {
  id: string;
  platform: string;
  item_url: string;
  title: string;
  price: number;
  currency: string;
  image_url: string | null;
  similarity_score: number;
  match_explanation: string | null;
}

interface GroupedResults {
  search_id: string;
  inspiration_image: string;
  top_match: SearchResult;
  alternatives: SearchResult[];
}

export default function CuraCart() {
  const [groupedResults, setGroupedResults] = useState<GroupedResults[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCuratedMatches();
  }, []);

  const fetchCuratedMatches = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Get all completed searches
      const { data: searches, error: searchError } = await supabase
        .from('visual_searches')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (searchError) throw searchError;

      // Get results for each search
      const grouped: GroupedResults[] = [];
      
      for (const search of searches || []) {
        const { data: results, error: resultsError } = await supabase
          .from('search_results')
          .select('*')
          .eq('search_id', search.id)
          .order('similarity_score', { ascending: false })
          .limit(5);

        if (resultsError) throw resultsError;
        
        if (results && results.length > 0) {
          grouped.push({
            search_id: search.id,
            inspiration_image: search.image_url,
            top_match: results[0],
            alternatives: results.slice(1)
          });
        }
      }

      setGroupedResults(grouped);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast({
        title: "Error loading matches",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (searchId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(searchId)) {
        newSet.delete(searchId);
      } else {
        newSet.add(searchId);
      }
      return newSet;
    });
  };

  const formatPrice = (price: number, currency: string) => {
    // Normalize currency code to valid ISO format
    const validCurrency = (() => {
      if (!currency) return 'EUR';
      const curr = currency.toUpperCase().trim();
      // Map common symbols/abbreviations to ISO codes
      if (curr === '€' || curr === 'EUR') return 'EUR';
      if (curr === '$' || curr === 'USD') return 'USD';
      if (curr === '£' || curr === 'GBP') return 'GBP';
      if (curr === 'KR' || curr === 'SEK') return 'SEK';
      if (curr === 'DKK') return 'DKK';
      if (curr === 'NOK') return 'NOK';
      // Default to EUR if unrecognized
      return 'EUR';
    })();
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: validCurrency,
      }).format(price || 0);
    } catch {
      return `${price || 0} ${validCurrency}`;
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      vinted: 'bg-orange-500',
      depop: 'bg-green-500',
      tise: 'bg-blue-500',
      etsy: 'bg-orange-600',
      grailed: 'bg-gray-700',
      poshmark: 'bg-pink-600'
    };
    return colors[platform] || 'bg-burgundy';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-16">
          <div className="text-center">
            <p className="text-muted-foreground font-light">Loading your curated matches...</p>
          </div>
        </div>
      </div>
    );
  }

  if (groupedResults.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-16">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-light font-serif text-primary">Your Cura Cart</h1>
            <p className="text-muted-foreground font-light">No curated matches yet. Start by searching from your gallery.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-light font-serif text-primary mb-3">Your Cura Cart</h1>
          <p className="text-muted-foreground font-light">AI-curated secondhand matches for your inspiration</p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {groupedResults.map((group) => {
            const isExpanded = expandedItems.has(group.search_id);
            const hasAlternatives = group.alternatives.length > 0;

            return (
              <div key={group.search_id} className="break-inside-avoid">
                <Card className="border-2 border-muted bg-card overflow-hidden">
                  {/* Inspiration Image */}
                  <div className="relative">
                    <img 
                      src={group.inspiration_image} 
                      alt="Inspiration"
                      className="w-full h-auto object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-burgundy text-burgundy-foreground">
                      Inspiration
                    </Badge>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Top Match */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={`${getPlatformColor(group.top_match.platform)} text-white`}>
                          {group.top_match.platform}
                        </Badge>
                        <Badge variant="outline" className="border-burgundy text-burgundy">
                          {Math.round(group.top_match.similarity_score * 100)}% match
                        </Badge>
                      </div>

                      {group.top_match.image_url && (
                        <img 
                          src={group.top_match.image_url}
                          alt={group.top_match.title}
                          className="w-full h-auto object-cover rounded"
                        />
                      )}

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium line-clamp-2">{group.top_match.title}</h3>
                        <p className="text-lg font-serif text-burgundy">
                          {formatPrice(group.top_match.price, group.top_match.currency)}
                        </p>
                        {group.top_match.match_explanation && (
                          <p className="text-xs text-muted-foreground font-light">
                            {group.top_match.match_explanation}
                          </p>
                        )}
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground"
                        onClick={() => window.open(group.top_match.item_url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        View on {group.top_match.platform}
                      </Button>

                      {/* Alternatives Toggle */}
                      {hasAlternatives && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => toggleExpanded(group.search_id)}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-2" />
                              Hide alternatives
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-2" />
                              {group.alternatives.length} more option{group.alternatives.length !== 1 ? 's' : ''}
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Alternative Matches */}
                    {isExpanded && hasAlternatives && (
                      <div className="space-y-4 pt-4 border-t border-muted">
                        {group.alternatives.map((alt) => (
                          <div key={alt.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge className={`${getPlatformColor(alt.platform)} text-white text-xs`}>
                                {alt.platform}
                              </Badge>
                              <Badge variant="outline" className="border-muted-foreground/30 text-xs">
                                {Math.round(alt.similarity_score * 100)}% match
                              </Badge>
                            </div>

                            {alt.image_url && (
                              <img 
                                src={alt.image_url}
                                alt={alt.title}
                                className="w-full h-auto object-cover rounded"
                              />
                            )}

                            <h4 className="text-xs font-medium line-clamp-2">{alt.title}</h4>
                            <p className="text-sm font-serif text-burgundy">
                              {formatPrice(alt.price, alt.currency)}
                            </p>

                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-xs"
                              onClick={() => window.open(alt.item_url, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
