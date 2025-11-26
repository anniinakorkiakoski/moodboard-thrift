import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ExternalLink, Trash2, ShoppingBag } from 'lucide-react';

interface SavedItem {
  id: string;
  item_url: string;
  title: string;
  price: number;
  currency: string;
  image_url: string | null;
  platform: string;
  notes: string | null;
  created_at: string;
}

export default function CuraCart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const fetchSavedItems = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedItems(data || []);
    } catch (error) {
      console.error('Error fetching saved items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your saved items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setSavedItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: 'Removed',
        description: 'Item removed from your cart',
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateNotes = async (itemId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('saved_items')
        .update({ notes })
        .eq('id', itemId);

      if (error) throw error;

      setSavedItems(prev =>
        prev.map(item => (item.id === itemId ? { ...item, notes } : item))
      );
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    const validCurrency = (() => {
      if (!currency) return 'EUR';
      const curr = currency.toUpperCase().trim();
      if (curr === '€' || curr === 'EUR') return 'EUR';
      if (curr === '$' || curr === 'USD') return 'USD';
      if (curr === '£' || curr === 'GBP') return 'GBP';
      if (curr === 'KR' || curr === 'SEK') return 'SEK';
      if (curr === 'DKK') return 'DKK';
      if (curr === 'NOK') return 'NOK';
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

  const totalPrice = savedItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 pt-32">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-black text-primary uppercase tracking-[0.3em]">
              Your Cart
            </h1>
            <div className="w-16 h-px bg-primary/40 mx-auto" />
            <p className="text-sm text-muted-foreground font-lora">
              Items you've saved to purchase
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-burgundy border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}

          {/* Empty State */}
          {!loading && savedItems.length === 0 && (
            <div className="text-center py-16 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-primary">Your cart is empty</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Start searching your inspiration images in the gallery to find items you love
                </p>
              </div>
              <Button
                onClick={() => navigate('/gallery')}
                className="bg-burgundy hover:bg-burgundy/90 text-burgundy-foreground"
              >
                Go to Gallery
              </Button>
            </div>
          )}

          {/* Cart Items */}
          {!loading && savedItems.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {item.image_url && (
                      <div className="aspect-square bg-muted relative">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="p-4 space-y-4">
                      <h3 className="font-semibold line-clamp-2">{item.title}</h3>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-burgundy">
                          {formatPrice(item.price, item.currency)}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase">
                          {item.platform}
                        </span>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">
                          Notes (optional):
                        </label>
                        <textarea
                          value={item.notes || ''}
                          onChange={(e) => handleUpdateNotes(item.id, e.target.value)}
                          placeholder="Size notes, questions, etc..."
                          className="w-full px-3 py-2 text-sm border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-burgundy"
                          rows={2}
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-burgundy hover:bg-burgundy/90 text-burgundy-foreground"
                          onClick={() => window.open(item.item_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on {item.platform}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-border pt-6 mt-8">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Total ({savedItems.length} items):</span>
                    <span className="text-2xl font-bold text-burgundy">
                      {formatPrice(totalPrice, 'EUR')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Approximate total. Final prices may vary by seller.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/gallery')}
                  className="border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground"
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
