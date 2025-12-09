import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ExternalLink, Sparkles, TrendingUp, RefreshCw } from 'lucide-react';
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

const STYLE_CATEGORIES = [
  { label: 'For You', value: 'foryou' },
  { label: 'Trending', value: 'trending' },
  { label: 'Vintage', value: 'vintage' },
  { label: 'Minimalist', value: 'minimalist' },
  { label: 'Bohemian', value: 'bohemian' },
  { label: 'Streetwear', value: 'streetwear' },
  { label: 'Classic', value: 'classic' },
];

const TRENDING_ITEMS = [
  'vintage blazer', 'linen dress', 'silk scarf', 'leather bag',
  'wool coat', 'cashmere sweater', 'denim jacket', 'maxi skirt',
  'pleated trousers', 'knit cardigan', 'cotton blouse', 'suede boots',
];

export default function Inspiration() {
  const [items, setItems] = useState<InspirationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('foryou');
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const { profile } = useStyleProfile();
  const { toast } = useToast();

  useEffect(() => {
    fetchInspirationItems();
  }, [profile, activeCategory]);

  const buildSearchTerms = () => {
    const styleTags = profile?.style_tags || [];
    const dreamBrands = profile?.dream_brands || [];
    const materials = profile?.material_preferences || [];

    switch (activeCategory) {
      case 'foryou':
        // Personalized based on user profile
        if (styleTags.length > 0 || dreamBrands.length > 0) {
          return [
            ...styleTags.slice(0, 3),
            ...dreamBrands.slice(0, 2),
            ...materials.slice(0, 2),
          ].filter(Boolean);
        }
        return TRENDING_ITEMS.slice(0, 6);
      case 'trending':
        return TRENDING_ITEMS.slice(0, 8);
      case 'vintage':
        return ['vintage dress', 'retro jacket', 'antique jewelry', '80s fashion', 'victorian blouse'];
      case 'minimalist':
        return ['minimalist dress', 'simple linen', 'neutral tones', 'clean lines', 'capsule wardrobe'];
      case 'bohemian':
        return ['boho dress', 'fringe bag', 'embroidered top', 'flowy maxi', 'hippie chic'];
      case 'streetwear':
        return ['oversized hoodie', 'cargo pants', 'sneakers vintage', 'graphic tee', 'bomber jacket'];
      case 'classic':
        return ['tailored blazer', 'silk blouse', 'pearl jewelry', 'trench coat', 'oxford shoes'];
      default:
        return TRENDING_ITEMS.slice(0, 6);
    }
  };

  const fetchInspirationItems = async () => {
    setLoading(true);
    try {
      const searchTerms = buildSearchTerms();
      
      const { data, error } = await supabase.functions.invoke('inspiration-feed', {
        body: { 
          searchTerms,
          styleTags: profile?.style_tags || [],
          dreamBrands: profile?.dream_brands || [],
          materials: profile?.material_preferences || [],
        },
      });

      if (error) throw error;

      const fetchedItems = data?.items || [];
      setItems(fetchedItems.length > 0 ? fetchedItems : generatePlaceholderItems(searchTerms));
    } catch (error) {
      console.error('Error fetching inspiration:', error);
      setItems(generatePlaceholderItems(buildSearchTerms()));
    } finally {
      setLoading(false);
    }
  };

  const generatePlaceholderItems = (terms: string[]): InspirationItem[] => {
    const placeholders: InspirationItem[] = [];
    const heights = [200, 280, 320, 240, 360, 220, 300, 260, 340, 190];
    
    terms.forEach((term, i) => {
      placeholders.push({
        id: `item-${term.replace(/\s/g, '-')}-${i}`,
        title: `${term.charAt(0).toUpperCase() + term.slice(1)} - Curated Find`,
        price: Math.floor(Math.random() * 150) + 25,
        currency: 'USD',
        image_url: `https://picsum.photos/seed/${term.replace(/\s/g, '')}${i}/400/${heights[i % heights.length]}`,
        item_url: '#',
        platform: 'etsy',
        tags: [term.split(' ')[0], activeCategory === 'foryou' ? 'personalized' : activeCategory],
        trending: i < 3 && activeCategory === 'trending',
      });
    });

    // Generate more items for a fuller feed
    for (let i = 0; i < 15; i++) {
      const term = terms[i % terms.length];
      placeholders.push({
        id: `extra-${i}-${Date.now()}`,
        title: `${term} - Style Pick`,
        price: Math.floor(Math.random() * 180) + 30,
        currency: 'USD',
        image_url: `https://picsum.photos/seed/extra${activeCategory}${i}/400/${heights[(i + 4) % heights.length]}`,
        item_url: '#',
        platform: 'etsy',
        tags: [term.split(' ')[0], 'curated'],
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

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleRefresh = () => {
    fetchInspirationItems();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Discover Your Style
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Curated finds based on your taste and what's trending
          </p>
        </div>

        {/* Style Profile Hint */}
        {profile?.style_tags && profile.style_tags.length > 0 && activeCategory === 'foryou' && (
          <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Personalized for: {profile.style_tags.slice(0, 3).join(', ')}</span>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {STYLE_CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange(cat.value)}
              className={`rounded-full px-5 ${
                activeCategory === cat.value 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              {cat.value === 'foryou' && <Sparkles className="w-3 h-3 mr-1.5" />}
              {cat.value === 'trending' && <TrendingUp className="w-3 h-3 mr-1.5" />}
              {cat.label}
            </Button>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="rounded-full px-3"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

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
                const moreItems = generatePlaceholderItems(buildSearchTerms());
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
