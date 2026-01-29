import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Thrifter {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  rating: number | null;
  specialties: string[] | null;
  pricing_info: string | null;
  is_verified: boolean | null;
  has_availability: boolean;
  style_tags?: string[];
}

interface ThrifterProfileDialogProps {
  thrifter: Thrifter;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export const ThrifterProfileDialog = ({
  thrifter,
  open,
  onOpenChange,
  userId,
}: ThrifterProfileDialogProps) => {
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      checkExistingConnection();
    }
  }, [open, thrifter.id]);

  const checkExistingConnection = async () => {
    try {
      const { data } = await supabase
        .from('connections')
        .select('status')
        .eq('customer_id', userId)
        .eq('thrifter_id', thrifter.id)
        .maybeSingle();

      setConnectionStatus(data?.status || null);
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleConnect = async () => {
    if (!customMessage.trim()) {
      toast({
        title: "Message required",
        description: "Please add a message to introduce yourself.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const defaultMessage = "Hey! I'd love to get curated by you.";
      const finalMessage = customMessage.trim() || defaultMessage;
      
      // Use has_availability flag from secure RPC
      const hasCapacity = thrifter.has_availability;
      const status = hasCapacity ? 'pending' : 'waitlist';

      const { error } = await supabase
        .from('connections')
        .insert({
          customer_id: userId,
          thrifter_id: thrifter.id,
          initiated_by: 'customer',
          message: finalMessage,
          status: status,
        });

      if (error) throw error;

      toast({
        title: hasCapacity ? "Request sent!" : "Added to waitlist",
        description: hasCapacity 
          ? `Your connection request has been sent to ${thrifter.display_name}.`
          : `${thrifter.display_name} is at capacity. You've been added to their waitlist.`,
      });
      
      setConnectionStatus(status);
      setCustomMessage('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating connection:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light font-lora">Stylist Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {thrifter.avatar_url ? (
                <img
                  src={thrifter.avatar_url}
                  alt={thrifter.display_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <span className="text-5xl font-light text-primary/40">
                    {thrifter.display_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-xl font-medium">{thrifter.display_name}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{(thrifter.rating || 5).toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {thrifter.specialties && thrifter.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {thrifter.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {thrifter.bio && (
            <div>
              <h3 className="text-sm font-medium text-foreground/80 mb-2">About</h3>
              <p className="text-sm font-light leading-relaxed text-foreground/70 font-lora">
                {thrifter.bio}
              </p>
            </div>
          )}

          {/* Style Tags */}
          {thrifter.style_tags && thrifter.style_tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-foreground/80 mb-2">Style Aesthetics</h3>
              <div className="flex flex-wrap gap-2">
                {thrifter.style_tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Info */}
          {thrifter.pricing_info && (
            <div>
              <h3 className="text-sm font-medium text-foreground/80 mb-2">Pricing</h3>
              <p className="text-sm font-light text-foreground/70 font-lora">
                {thrifter.pricing_info}
              </p>
            </div>
          )}

          {/* Availability Status */}
          <div className="bg-accent/10 p-3 rounded-lg mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/70">Availability:</span>
              <span className="font-medium">
                {thrifter.has_availability ? 'Spots available' : 'At capacity'}
              </span>
            </div>
            {!thrifter.has_availability && (
              <p className="text-xs text-muted-foreground mt-1">
                At capacity - new requests will be added to waitlist
              </p>
            )}
          </div>

          {connectionStatus ? (
            <div className="bg-accent/10 p-4 rounded-lg">
              <p className="text-sm font-medium text-center">
                {connectionStatus === 'pending' && 'Request pending - waiting for response'}
                {connectionStatus === 'waitlist' && 'You\'re on the waitlist - thrifter will reach out when available'}
                {connectionStatus === 'active' && 'Connected! You\'re working together'}
                {connectionStatus === 'accepted' && 'Request accepted!'}
                {connectionStatus === 'rejected' && 'Request was declined'}
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium text-foreground/80 mb-2 block">
                  Introduce yourself
                </label>
                <Textarea
                  placeholder="Hey! I'd love to get curated by you. I'm looking for..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleConnect}
                disabled={sending}
                className="w-full"
                variant="cta"
              >
                {sending ? 'Sending...' : 
                  !thrifter.has_availability 
                    ? 'Join Waitlist' 
                    : 'Send Connection Request'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};