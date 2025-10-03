import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Thrifter {
  id: string;
  max_active_customers: number;
  current_active_customers: number;
}

interface Connection {
  id: string;
  customer_id: string;
  status: string;
  message: string;
  priority: number;
  waitlist_notes: string;
  created_at: string;
}

export const ThrifterDashboard = () => {
  const [thrifter, setThrifter] = useState<Thrifter | null>(null);
  const [activeConnections, setActiveConnections] = useState<Connection[]>([]);
  const [waitlist, setWaitlist] = useState<Connection[]>([]);
  const [maxCustomers, setMaxCustomers] = useState(5);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadThrifterData();
  }, []);

  const loadThrifterData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get thrifter profile
      const { data: thrifterData, error: thrifterError } = await supabase
        .from('thrifters')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (thrifterError) throw thrifterError;
      
      setThrifter(thrifterData);
      setMaxCustomers(thrifterData.max_active_customers);

      // Get active connections
      const { data: activeData, error: activeError } = await supabase
        .from('connections')
        .select('*')
        .eq('thrifter_id', thrifterData.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;
      setActiveConnections(activeData || []);

      // Get waitlist
      const { data: waitlistData, error: waitlistError } = await supabase
        .from('connections')
        .select('*')
        .eq('thrifter_id', thrifterData.id)
        .eq('status', 'waitlist')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (waitlistError) throw waitlistError;
      setWaitlist(waitlistData || []);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMaxCustomers = async () => {
    if (!thrifter) return;

    try {
      const { error } = await supabase
        .from('thrifters')
        .update({ max_active_customers: maxCustomers })
        .eq('id', thrifter.id);

      if (error) throw error;

      toast({
        title: "Updated",
        description: "Customer capacity limit updated successfully."
      });

      loadThrifterData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const acceptFromWaitlist = async (connectionId: string) => {
    if (!thrifter) return;

    if (thrifter.current_active_customers >= thrifter.max_active_customers) {
      toast({
        title: "Capacity Full",
        description: "You've reached your maximum active customers limit.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'active' })
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Customer Accepted",
        description: "Customer has been moved to your active list."
      });

      loadThrifterData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const rejectFromWaitlist = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'rejected' })
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Request Declined",
        description: "Customer request has been declined."
      });

      loadThrifterData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updatePriority = async (connectionId: string, newPriority: number) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ priority: newPriority })
        .eq('id', connectionId);

      if (error) throw error;

      loadThrifterData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!thrifter) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <p>You need to create a thrifter profile first.</p>
        </Card>
      </div>
    );
  }

  const spotsAvailable = thrifter.max_active_customers - thrifter.current_active_customers;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-serif font-light text-primary">Thrifter Dashboard</h1>
          <Badge variant={spotsAvailable > 0 ? "default" : "destructive"}>
            {spotsAvailable} spots available
          </Badge>
        </div>

        {/* Capacity Settings */}
        <Card className="p-6">
          <h2 className="text-2xl font-serif text-primary mb-4">Capacity Settings</h2>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="maxCustomers">Maximum Active Customers</Label>
              <Input
                id="maxCustomers"
                type="number"
                min="1"
                max="50"
                value={maxCustomers}
                onChange={(e) => setMaxCustomers(parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
            <Button onClick={updateMaxCustomers}>
              Update Limit
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Currently serving {thrifter.current_active_customers} of {thrifter.max_active_customers} customers
          </p>
        </Card>

        {/* Active Customers */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-serif text-primary">Active Customers</h2>
            <Badge>{activeConnections.length}</Badge>
          </div>
          {activeConnections.length === 0 ? (
            <p className="text-muted-foreground">No active customers yet.</p>
          ) : (
            <div className="space-y-3">
              {activeConnections.map((connection) => (
                <Card key={connection.id} className="p-4 bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">Customer: {connection.customer_id.slice(0, 8)}...</p>
                      {connection.message && (
                        <p className="text-sm text-muted-foreground mt-1">{connection.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Started: {new Date(connection.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Waitlist */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-serif text-primary">Waitlist</h2>
            <Badge variant="outline">{waitlist.length}</Badge>
          </div>
          {waitlist.length === 0 ? (
            <p className="text-muted-foreground">No customers waiting.</p>
          ) : (
            <div className="space-y-4">
              {waitlist.map((connection) => (
                <Card key={connection.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">Customer: {connection.customer_id.slice(0, 8)}...</p>
                        {connection.message && (
                          <p className="text-sm mt-1">{connection.message}</p>
                        )}
                        {connection.waitlist_notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Notes: {connection.waitlist_notes}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Requested: {new Date(connection.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary">Priority: {connection.priority}</Badge>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => acceptFromWaitlist(connection.id)}
                        disabled={spotsAvailable <= 0}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectFromWaitlist(connection.id)}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Input
                        type="number"
                        placeholder="Priority"
                        value={connection.priority}
                        onChange={(e) => updatePriority(connection.id, parseInt(e.target.value) || 0)}
                        className="w-24"
                        min="0"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
