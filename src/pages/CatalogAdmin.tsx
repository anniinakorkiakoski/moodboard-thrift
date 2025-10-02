import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Database, Plus, Upload, Link as LinkIcon, FileUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CatalogAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Manual upload state
  const [manualForm, setManualForm] = useState({
    itemUrl: '',
    imageUrl: '',
    platform: 'vinted'
  });

  // CSV upload state
  const [csvFile, setCsvFile] = useState<File | null>(null);

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

  const handleManualUpload = async () => {
    if (!manualForm.itemUrl) {
      toast({
        title: 'Missing information',
        description: 'Please provide at least an item URL',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('catalog-ingest', {
        body: {
          action: 'add_manual',
          ...manualForm
        }
      });

      if (error) throw error;

      toast({
        title: 'Item added!',
        description: 'The item has been extracted and added to the catalog',
      });

      setManualForm({ itemUrl: '', imageUrl: '', platform: 'vinted' });
      fetchStats();
    } catch (error) {
      console.error('Error adding manual item:', error);
      toast({
        title: 'Failed to add item',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a CSV file to upload',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const csvData = await csvFile.text();
      
      const { data, error } = await supabase.functions.invoke('catalog-ingest', {
        body: {
          action: 'import_csv',
          csvData
        }
      });

      if (error) throw error;

      toast({
        title: 'CSV imported!',
        description: `Added ${data.added} items, skipped ${data.skipped} duplicates`,
      });

      setCsvFile(null);
      fetchStats();
    } catch (error) {
      console.error('Error importing CSV:', error);
      toast({
        title: 'Failed to import CSV',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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

          {/* Ingestion Methods */}
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manual">Manual Upload</TabsTrigger>
              <TabsTrigger value="csv">CSV Import</TabsTrigger>
              <TabsTrigger value="api">API Sync</TabsTrigger>
            </TabsList>

            {/* Manual Upload Tab */}
            <TabsContent value="manual">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    Manual Item Upload
                  </CardTitle>
                  <CardDescription>
                    Add individual items by providing a URL. AI will extract attributes automatically.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemUrl">Item URL *</Label>
                    <Input
                      id="itemUrl"
                      placeholder="https://vinted.com/items/..."
                      value={manualForm.itemUrl}
                      onChange={(e) => setManualForm({ ...manualForm, itemUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL (optional)</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://..."
                      value={manualForm.imageUrl}
                      onChange={(e) => setManualForm({ ...manualForm, imageUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                      value={manualForm.platform}
                      onValueChange={(value) => setManualForm({ ...manualForm, platform: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vinted">Vinted</SelectItem>
                        <SelectItem value="depop">Depop</SelectItem>
                        <SelectItem value="etsy">Etsy</SelectItem>
                        <SelectItem value="poshmark">Poshmark</SelectItem>
                        <SelectItem value="therealreal">The RealReal</SelectItem>
                        <SelectItem value="vestiaire_collective">Vestiaire Collective</SelectItem>
                        <SelectItem value="grailed">Grailed</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleManualUpload}
                    disabled={loading}
                    className="w-full bg-burgundy text-burgundy-foreground hover:bg-burgundy/90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Extracting & Adding...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Add Item
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CSV Import Tab */}
            <TabsContent value="csv">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileUp className="w-5 h-5" />
                    Bulk CSV Import
                  </CardTitle>
                  <CardDescription>
                    Upload a CSV file with multiple items. Required columns: platform, external_id, title, item_url
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="csvFile">CSV File</Label>
                    <Input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    />
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="font-medium">CSV Format:</p>
                    <code className="text-xs block bg-muted p-2 rounded">
                      platform,external_id,title,description,price,currency,item_url,image_url,size,condition,attributes
                    </code>
                  </div>

                  <Button
                    onClick={handleCSVUpload}
                    disabled={loading || !csvFile}
                    className="w-full bg-burgundy text-burgundy-foreground hover:bg-burgundy/90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <FileUp className="w-4 h-4 mr-2" />
                        Import CSV
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Sync Tab */}
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Marketplace API Integration
                  </CardTitle>
                  <CardDescription>
                    Connect to marketplace APIs for automated catalog syncing (implementation required)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium">🔧 Integration Framework Ready</p>
                    <p>To enable API syncing, you'll need to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Obtain API credentials from each marketplace</li>
                      <li>Implement marketplace-specific API calls in the edge function</li>
                      <li>Add API keys as Supabase secrets</li>
                      <li>Set up automated cron jobs for periodic syncing</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {['Vinted', 'Depop', 'Etsy', 'Poshmark', 'The RealReal', 'Vestiaire'].map(marketplace => (
                      <Button key={marketplace} variant="outline" disabled>
                        {marketplace}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Test Data */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-muted-foreground">
                <Database className="w-5 h-5" />
                Quick Test Data
              </CardTitle>
              <CardDescription>
                Add 10 sample items for testing (useful for development)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={addSampleData}
                disabled={loading}
                variant="outline"
                className="border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Sample Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

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
