import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Users, Clock, CheckCircle } from 'lucide-react';

interface ThrifterProfile {
  id: string;
  max_active_customers: number;
  current_active_customers: number;
  display_name: string;
}

interface Connection {
  id: string;
  customer_id: string;
  status: string;
  message: string | null;
  waitlist_notes: string | null;
  priority: number;
  created_at: string;
}

export const ThrifterDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ThrifterProfile | null>(null);
  const [maxCustomers, setMaxCustomers] = useState(5);
  const [waitlist, setWaitlist] = useState<Connection[]>([]);
  const [activeCustomers, setActiveCustomers] = useState<Connection[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadThrifterData();
  }, []);

  const loadThrifterData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: thrifterData, error: profileError } = await supabase
        .from('thrifters')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!thrifterData) {
        toast({
          title: "Not a Thrifter",
          description: "You need to create a thrifter profile first.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setProfile(thrifterData);
      setMaxCustomers(thrifterData.max_active_customers);

      const { data: waitlistData, error: waitlistError } = await supabase
        .from('connections')
        .select('*')
        .eq('thrifter_id', thrifterData.id)
        .eq('status', 'waitlist')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (waitlistError) throw waitlistError;
      setWaitlist(waitlistData || []);

      const { data: activeData, error: activeError } = await supabase
        .from('connections')
        .select('*')
        .eq('thrifter_id', thrifterData.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;
      setActiveCustomers(activeData || []);

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
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('thrifters')
        .update({ max_active_customers: maxCustomers })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Updated",
        description: "Customer capacity updated successfully."
      });

      setProfile({ ...profile, max_active_customers: maxCustomers });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const acceptFromWaitlist = async (connectionId: string) => {
    if (!profile) return;

    if (profile.current_active_customers >= profile.max_active_customers) {
      toast({
        title: "Capacity Full",
        description: "You've reached your maximum active customers. Complete or remove some customers first.",
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
        description: "Customer moved from waitlist to active."
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

  const completeCustomer = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'completed' })
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Marked Complete",
        description: "Customer marked as completed."
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const spotsAvailable = profile ? profile.max_active_customers - profile.current_active_customers : 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-serif font-light text-primary">Thrifter Dashboard</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>

        {profile && (
          <Card>
            <CardHeader>
              <CardTitle>Customer Capacity</CardTitle>
              <CardDescription>
                Manage how many customers you can help at once
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">{profile.current_active_customers}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Available Spots</p>
                    <p className="text-2xl font-bold text-green-600">{spotsAvailable}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Waitlist</p>
                    <p className="text-2xl font-bold">{waitlist.length}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-end gap-4 pt-4">
                <div className="flex-1">
                  <Label htmlFor="maxCustomers">Maximum Active Customers</Label>
                  <Input
                    id="maxCustomers"
                    type="number"
                    min="1"
                    max="50"
                    value={maxCustomers}
                    onChange={(e) => setMaxCustomers(parseInt(e.target.value) || 1)}
                    className="mt-2"
                  />
                </div>
                <Button onClick={updateMaxCustomers}>
                  Update Capacity
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="waitlist" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="waitlist">
              Waitlist ({waitlist.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active Customers ({activeCustomers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="waitlist" className="space-y-4">
            {waitlist.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No customers in waitlist</p>
                </CardContent>
              </Card>
            ) : (
              waitlist.map((connection) => (
                <Card key={connection.id}>
                  <CardContent className="py-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Waitlist</Badge>
                          {connection.priority > 0 && (
                            <Badge variant="outline">Priority: {connection.priority}</Badge>
                          )}
                        </div>
                        {connection.message && (
                          <p className="text-sm text-foreground">{connection.message}</p>
                        )}
                        {connection.waitlist_notes && (
                          <p className="text-sm text-muted-foreground italic">{connection.waitlist_notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Requested: {new Date(connection.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => acceptFromWaitlist(connection.id)}
                        disabled={spotsAvailable <= 0}
                        className="bg-burgundy hover:bg-burgundy/90"
                      >
                        Accept Customer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeCustomers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No active customers</p>
                </CardContent>
              </Card>
            ) : (
              activeCustomers.map((connection) => (
                <Card key={connection.id}>
                  <CardContent className="py-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <Badge>Active</Badge>
                        {connection.message && (
                          <p className="text-sm text-foreground">{connection.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Started: {new Date(connection.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => completeCustomer(connection.id)}
                        variant="outline"
                      >
                        Mark Complete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
