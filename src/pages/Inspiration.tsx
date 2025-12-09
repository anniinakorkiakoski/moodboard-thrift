import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ExternalLink, Search, Sparkles, TrendingUp } from 'lucide-react';
import { useStyleProfile } from '@/hooks/useStyleProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InspirationItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  image_url: string;
  item_url: string;
  platform: string;
  tags: string[];
  trending?: boolean;
}

const TRENDING_SEARCHES = [
  'vintage blazer',
  'linen dress',
  'silk scarf',
  'leather bag',
  'wool coat',
  'cashmere sweater',
  'denim jacket',
  'maxi skirt',
];

export default function Inspiration() {
  const [items, setItems] = useState<InspirationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const { profile } = useStyleProfile();
  const { toast } = useToast();

  useEffect(() => {
    fetchInspirationItems();
  }, [profile]);

  const fetchInspirationItems = async () => {
    setLoading(true);
    try {
      // Build search queries based on user's style profile
      const styleTags = profile?.style_tags || [];
      const dreamBrands = profile?.dream_brands || [];
      const materials = profile?.material_preferences || [];
      
      // Combine user preferences with trending searches
      const searchTerms = [
        ...styleTags.slice(0, 2),
        ...dreamBrands.slice(0, 2),
        ...materials.slice(0, 1),
        ...TRENDING_SEARCHES.slice(0, 3),
      ].filter(Boolean);

      if (searchTerms.length === 0) {
        searchTerms.push(...TRENDING_SEARCHES.slice(0, 5));
      }

      // Fetch items from Etsy based on style preferences
      const { data, error } = await supabase.functions.invoke('inspiration-feed', {
        body: { 
          searchTerms,
          styleTags,
          dreamBrands,
          materials,
        },
      });

      if (error) throw error;

      setItems(data?.items || generatePlaceholderItems(searchTerms));
    } catch (error) {
      console.error('Error fetching inspiration:', error);
      // Show placeholder items for demo
      setItems(generatePlaceholderItems(TRENDING_SEARCHES));
    } finally {
      setLoading(false);
    }
  };

  const generatePlaceholderItems = (terms: string[]): InspirationItem[] => {
    const placeholders: InspirationItem[] = [];
    const heights = [200, 280, 320, 240, 360, 220, 300, 260];
    
    terms.forEach((term, i) => {
      placeholders.push({
        id: `placeholder-${i}`,
        title: `${term.charAt(0).toUpperCase() + term.slice(1)} - Vintage Find`,
        price: Math.floor(Math.random() * 150) + 20,
        currency: 'USD',
        image_url: `https://picsum.photos/seed/${term.replace(/\s/g, '')}${i}/400/${heights[i % heights.length]}`,
        item_url: '#',
        platform: 'etsy',
        tags: [term, 'vintage', 'sustainable'],
        trending: i < 3,
      });
    });

    // Generate more items for a fuller feed
    for (let i = 0; i < 12; i++) {
      const term = terms[i % terms.length];
      placeholders.push({
        id: `placeholder-extra-${i}`,
        title: `Curated ${term} piece`,
        price: Math.floor(Math.random() * 200) + 30,
        currency: 'USD',
        image_url: `https://picsum.photos/seed/extra${i}/400/${heights[(i + 3) % heights.length]}`,
        item_url: '#',
        platform: 'etsy',
        tags: [term, 'curated'],
        trending: false,
      });
    }

    return placeholders.sort(() => Math.random() - 0.5);
  };

  const toggleSaveItem = async (item: InspirationItem) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save items to your cart.',
        variant: 'destructive',
      });
      return;
    }

    const isSaved = savedItems.has(item.id);

    if (isSaved) {
      setSavedItems(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      toast({ title: 'Removed from cart' });
    } else {
      // Save to database
      const { error } = await supabase.from('saved_items').insert({
        user_id: user.user.id,
        title: item.title,
        price: item.price,
        currency: item.currency,
        image_url: item.image_url,
        item_url: item.item_url,
        platform: item.platform,
      });

      if (!error) {
        setSavedItems(prev => new Set(prev).add(item.id));
        toast({ title: 'Saved to cart' });
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLoading(true);
      // Filter or fetch based on search
      const filtered = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setItems(filtered.length > 0 ? filtered : generatePlaceholderItems([searchQuery]));
      setLoading(false);
    }
  };

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term);
    setLoading(true);
    setItems(generatePlaceholderItems([term, ...TRENDING_SEARCHES.filter(t => t !== term)]));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Discover Your Style
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Curated finds based on your taste and current trends
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for vintage blazers, silk scarves, leather bags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-full border-border focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </form>

        {/* Trending Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <div className="flex items-center gap-2 text-muted-foreground mr-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Trending:</span>
          </div>
          {TRENDING_SEARCHES.map((term) => (
            <Badge
              key={term}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-1.5"
              onClick={() => handleTrendingClick(term)}
            >
              {term}
            </Badge>
          ))}
        </div>

        {/* Style Profile Hint */}
        {profile?.style_tags && profile.style_tags.length > 0 && (
          <div className="flex items-center justify-center gap-2 mb-8 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Personalized for your style: {profile.style_tags.slice(0, 3).join(', ')}</span>
          </div>
        )}

        {/* Masonry Grid */}
        {loading ? (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <Skeleton 
                  className="w-full rounded-xl" 
                  style={{ height: `${[200, 280, 320, 240, 360][i % 5]}px` }} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="break-inside-avoid mb-4 overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-card"
              >
                <div className="relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="gap-1 bg-background/90 hover:bg-background"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(item.item_url, '_blank');
                          }}
                        >
                          <ExternalLink className="w-3 h-3" />
                          View
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`rounded-full ${savedItems.has(item.id) ? 'bg-primary text-primary-foreground' : 'bg-background/90'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveItem(item);
                          }}
                        >
                          <Heart className={`w-4 h-4 ${savedItems.has(item.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Trending badge */}
                  {item.trending && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>

                {/* Item info */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-foreground">
                      ${item.price}
                    </span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {item.platform}
                    </Badge>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && items.length > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const moreItems = generatePlaceholderItems(TRENDING_SEARCHES);
                setItems(prev => [...prev, ...moreItems]);
              }}
              className="px-8"
            >
              Load More Inspiration
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
