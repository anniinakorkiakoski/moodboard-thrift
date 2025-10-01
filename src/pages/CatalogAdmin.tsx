import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Database, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CatalogAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const addSampleData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('catalog-ingest', {
        body: { action: 'add_samples' }
      });

      if (error) throw error;

      toast({
        title: 'Sample data added!',
        description: `Added ${data.itemsAdded} catalog items across multiple platforms`,
      });

      // Fetch updated stats
      fetchStats();
    } catch (error) {
      console.error('Error adding samples:', error);
      toast({
        title: 'Failed to add sample data',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('catalog_items')
        .select('platform, is_active')
        .eq('is_active', true);

      if (error) throw error;

      const platformCounts = data.reduce((acc: any, item) => {
        acc[item.platform] = (acc[item.platform] || 0) + 1;
        return acc;
      }, {});

      setStats({
        total: data.length,
        byPlatform: platformCounts
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4 text-burgundy hover:bg-burgundy/10"
            >
              ← Back to Home
            </Button>
            
            <h1 className="text-3xl font-black text-primary uppercase tracking-[0.2em]">
              Catalog Admin
            </h1>
            <div className="w-16 h-px bg-primary/40" />
            <p className="text-sm text-muted-foreground font-lora">
              Manage the visual search catalog
            </p>
          </div>

          {/* Stats Card */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle>Catalog Statistics</CardTitle>
                <CardDescription>Current catalog size and distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-burgundy">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Active Items</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                    {Object.entries(stats.byPlatform).map(([platform, count]: [string, any]) => (
                      <div key={platform} className="space-y-1">
                        <p className="text-lg font-semibold">{count}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {platform.replace('_', ' ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Add Sample Data
                </CardTitle>
                <CardDescription>
                  Add 10 sample catalog items for testing the visual search feature.
                  These items include various clothing types with detailed attributes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={addSampleData}
                  disabled={loading}
                  className="bg-burgundy text-burgundy-foreground hover:bg-burgundy/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding Sample Data...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add 10 Sample Items
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-muted">
              <CardHeader>
                <CardTitle className="text-muted-foreground">
                  Production Integration (Coming Soon)
                </CardTitle>
                <CardDescription>
                  Connect to marketplace APIs to automatically index items from Vinted, Depop, Etsy, and more.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>📋 Planned features:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Automated daily/hourly syncing from marketplace APIs</li>
                  <li>Manual item upload with attribute extraction</li>
                  <li>Bulk CSV import</li>
                  <li>Item deactivation when sold</li>
                  <li>Duplicate detection</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Info */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <p className="font-medium text-primary">💡 How it works:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Visual search analyzes uploaded images and extracts detailed attributes</li>
                  <li>• System matches against catalog items using similarity scoring</li>
                  <li>• High-quality matches (≥80% similarity) are shown to users</li>
                  <li>• If no matches found, users can hire pro thrifters to source manually</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Load Stats Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={fetchStats}
              className="border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground"
            >
              Refresh Statistics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
