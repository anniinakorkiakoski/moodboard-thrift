import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Search, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const PLATFORMS = [
  { value: 'vinted', label: 'Vinted' },
  { value: 'depop', label: 'Depop' },
  { value: 'poshmark', label: 'Poshmark' },
  { value: 'etsy', label: 'Etsy (Vintage)' },
  { value: 'grailed', label: 'Grailed' },
];

export default function CatalogScraper() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [platform, setPlatform] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxItems, setMaxItems] = useState('10');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!platform || !searchQuery) {
      toast({
        title: 'Missing Information',
        description: 'Please select a platform and enter a search query',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      console.log('Starting catalog scrape:', { platform, searchQuery, maxItems });

      const { data, error } = await supabase.functions.invoke('catalog-scraper', {
        body: {
          platform,
          searchQuery,
          maxItems: parseInt(maxItems)
        }
      });

      if (error) throw error;

      console.log('Scrape completed:', data);
      setResult(data);

      toast({
        title: 'Scraping Complete!',
        description: `Added ${data.added} items to catalog from ${data.itemsFound} found`,
      });

    } catch (error: any) {
      console.error('Scraping error:', error);
      toast({
        title: 'Scraping Failed',
        description: error.message || 'Failed to scrape catalog items',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/catalog-admin')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Button>
          <h1 className="text-2xl font-bold text-burgundy">AI Catalog Scraper</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Automated Item Discovery
            </CardTitle>
            <CardDescription>
              AI will search fashion platforms and automatically add items to your catalog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScrape} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Search Query</Label>
                <Input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., wide leg linen pants, vintage crop top"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Describe what you're looking for (style, item type, brand, etc.)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxItems">Max Items to Add</Label>
                <Input
                  id="maxItems"
                  type="number"
                  value={maxItems}
                  onChange={(e) => setMaxItems(e.target.value)}
                  min="1"
                  max="50"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  AI will find items and automatically extract details (1-50)
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !platform || !searchQuery}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scraping {platform}...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Start Scraping
                  </>
                )}
              </Button>
            </form>

            {isLoading && (
              <div className="mt-6 space-y-4">
                <div className="text-center text-sm text-muted-foreground">
                  <p>AI is searching and analyzing items...</p>
                  <p className="text-xs mt-1">This may take 1-2 minutes</p>
                </div>
                <Progress value={undefined} className="w-full" />
              </div>
            )}

            {result && (
              <Card className="mt-6 bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-2xl font-bold">{result.itemsFound}</p>
                        <p className="text-xs text-muted-foreground">Items Found</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-green-600">{result.added}</p>
                        <p className="text-xs text-muted-foreground">Added to Catalog</p>
                      </div>
                    </div>
                  </div>

                  {result.failed > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-600">
                        {result.failed} items failed to process
                      </p>
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Platform:</strong> {result.platform}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Query:</strong> {result.searchQuery}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => navigate('/catalog-admin')}
                  >
                    View Catalog
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. <strong>AI searches</strong> the platform for items matching your query</p>
            <p>2. <strong>Extracts details</strong> from each listing (title, price, images, URL)</p>
            <p>3. <strong>Analyzes attributes</strong> using vision AI (fabric, colors, style, era)</p>
            <p>4. <strong>Adds to catalog</strong> with full metadata for matching</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
