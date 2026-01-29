import { useState, useEffect } from 'react';
import { Star, ShoppingBag, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Thrifter {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  rating: number;
  specialties: string[] | null;
  pricing_info: string | null;
  is_verified: boolean;
  has_availability: boolean;
}

interface ThrifterMarketplaceProps {
  searchId: string;
  imageUrl: string;
}

export const ThrifterMarketplace = ({ searchId, imageUrl }: ThrifterMarketplaceProps) => {
  const [thrifters, setThrifters] = useState<Thrifter[]>([]);
  const [selectedThrifter, setSelectedThrifter] = useState<Thrifter | null>(null);
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchThrifters();
  }, []);

  const fetchThrifters = async () => {
    // Use secure RPC function that hides sensitive business data
    const { data, error } = await supabase.rpc('get_public_thrifters');
    
    if (error) {
      console.error('Error fetching thrifters:', error);
      return;
    }

    if (data) {
      // Sort by rating descending
      const sorted = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setThrifters(sorted);
    }
  };

  const submitRequest = async () => {
    if (!selectedThrifter) return;

    setIsSubmitting(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('thrift_requests')
        .insert({
          search_id: searchId,
          customer_id: user.user.id,
          thrifter_id: selectedThrifter.id,
          budget: parseFloat(budget) || null,
          notes,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: 'Request sent!',
        description: `${selectedThrifter.display_name} will review your request soon.`,
      });

      setSelectedThrifter(null);
      setBudget('');
      setNotes('');
    } catch (error) {
      console.error('Request error:', error);
      toast({
        title: 'Failed to send request',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Professional Thrift Service</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Let our verified thrifters find this exact piece for you. They'll search local stores 
          and online vintage shops to source items that perfectly match your style.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {thrifters.map((thrifter) => (
          <Card key={thrifter.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  {thrifter.avatar_url ? (
                    <img 
                      src={thrifter.avatar_url} 
                      alt={thrifter.display_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <ShoppingBag className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{thrifter.display_name}</CardTitle>
                    {thrifter.is_verified && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{thrifter.rating?.toFixed(1) || '5.0'}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="line-clamp-3">
                {thrifter.bio || 'Experienced thrifter ready to find your perfect pieces.'}
              </CardDescription>

              {thrifter.specialties && thrifter.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {thrifter.specialties.slice(0, 3).map((specialty, i) => (
                    <span 
                      key={i}
                      className="text-xs bg-muted px-2 py-1 rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    onClick={() => setSelectedThrifter(thrifter)}
                  >
                    Request Service
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request from {thrifter.display_name}</DialogTitle>
                    <DialogDescription>
                      Share details about the item you're looking for and your budget.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt="Searched item"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget (optional)</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="Enter your budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any specific requirements or preferences..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button 
                      onClick={submitRequest} 
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Request'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {thrifters.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              No verified thrifters available at the moment. Check back soon!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};