import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Heart, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Match {
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

interface ImageMatchesDialogProps {
  open: boolean;
  onClose: () => void;
  imageId: string;
  imageUrl: string;
}

export const ImageMatchesDialog = ({ open, onClose, imageId, imageUrl }: ImageMatchesDialogProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [savedItemIds, setSavedItemIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open && imageId) {
      fetchMatches();
      fetchSavedItems();
    }
  }, [open, imageId]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      // Get the visual search for this image
      const { data: searches } = await supabase
        .from('visual_searches')
        .select('id')
        .eq('user_image_id', imageId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!searches || searches.length === 0) {
        setMatches([]);
        return;
      }

      // Get matches for this search
      const { data: results } = await supabase
        .from('search_results')
        .select('*')
        .eq('search_id', searches[0].id)
        .order('similarity_score', { ascending: false });

      setMatches(results || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast({
        title: 'Error',
        description: 'Failed to load matches',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedItems = async () => {
    try {
      const { data } = await supabase
        .from('saved_items')
        .select('search_result_id');

      if (data) {
        setSavedItemIds(new Set(data.map(item => item.search_result_id).filter(Boolean)));
      }
    } catch (error) {
      console.error('Error fetching saved items:', error);
    }
  };

  const toggleSaveItem = async (match: Match) => {
    const isSaved = savedItemIds.has(match.id);

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      if (isSaved) {
        // Remove from saved
        await supabase
          .from('saved_items')
          .delete()
          .eq('search_result_id', match.id);

        setSavedItemIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(match.id);
          return newSet;
        });

        toast({
          title: 'Removed from cart',
          description: 'Item removed from your shopping cart',
        });
      } else {
        // Add to saved
        await supabase
          .from('saved_items')
          .insert({
            user_id: user.user.id,
            search_result_id: match.id,
            item_url: match.item_url,
            title: match.title,
            price: match.price,
            currency: match.currency,
            image_url: match.image_url,
            platform: match.platform,
          });

        setSavedItemIds(prev => new Set(prev).add(match.id));

        toast({
          title: 'Saved to cart',
          description: 'Item added to your shopping cart',
        });
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({
        title: 'Error',
        description: 'Failed to update cart',
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (price: number, currency: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'EUR',
      }).format(price);
    } catch {
      return `${currency} ${price}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-primary uppercase tracking-[0.2em]">
            Matches Found
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original image */}
          <div className="flex justify-center">
            <div className="w-48 h-48 rounded-lg overflow-hidden border-2 border-muted">
              <img src={imageUrl} alt="Original inspiration" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Matches */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
            </div>
          ) : matches.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No matches found for this image</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((match) => {
                const isSaved = savedItemIds.has(match.id);
                return (
                  <div key={match.id} className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {match.image_url && (
                      <div className="aspect-square bg-muted">
                        <img src={match.image_url} alt={match.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm line-clamp-2">{match.title}</h3>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-burgundy">
                          {formatPrice(match.price, match.currency)}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase">{match.platform}</span>
                      </div>

                      {match.match_explanation && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {match.match_explanation}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant={isSaved ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSaveItem(match)}
                          className={isSaved ? "bg-burgundy hover:bg-burgundy/90" : "border-burgundy text-burgundy"}
                        >
                          <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                          {isSaved ? 'Saved' : 'Save to Cart'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(match.item_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
