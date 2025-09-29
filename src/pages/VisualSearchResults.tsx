import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchResults } from '@/components/SearchResults';
import { ThrifterMarketplace } from '@/components/ThrifterMarketplace';
import { useVisualSearch } from '@/hooks/useVisualSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const VisualSearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageUrl } = location.state || {};
  const { currentSearch, results, loading, startSearch } = useVisualSearch();
  const [activeTab, setActiveTab] = useState<'results' | 'marketplace'>('results');

  useEffect(() => {
    if (imageUrl && !currentSearch) {
      startSearch(imageUrl);
    }
  }, [imageUrl]);

  useEffect(() => {
    // If no matches found, switch to marketplace tab
    if (currentSearch?.status === 'no_matches') {
      setActiveTab('marketplace');
    }
  }, [currentSearch]);

  if (!imageUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No image selected for search.</p>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Button>
          <h1 className="text-2xl font-serif font-bold">CURA</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Search Image */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mb-8">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden border-2 border-muted">
            <img 
              src={imageUrl} 
              alt="Search query"
              className="w-full h-full object-cover"
            />
          </div>
          {currentSearch?.analysis_data?.description && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>AI Analysis:</strong> {currentSearch.analysis_data.description}
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading || currentSearch?.status === 'analyzing' || currentSearch?.status === 'searching' ? (
          <div className="text-center py-16 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                {currentSearch?.status === 'analyzing' && 'Analyzing your image...'}
                {currentSearch?.status === 'searching' && 'Searching curated platforms...'}
                {!currentSearch && 'Starting search...'}
              </p>
              <p className="text-sm text-muted-foreground">
                This may take a moment as we search across multiple vintage platforms
              </p>
            </div>
          </div>
        ) : (
          /* Results Tabs */
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="results">
                Search Results {results.length > 0 && `(${results.length})`}
              </TabsTrigger>
              <TabsTrigger value="marketplace">
                Thrift Service
              </TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-6">
              <SearchResults 
                results={results}
                onRequestThrifter={() => setActiveTab('marketplace')}
              />
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-6">
              {currentSearch && (
                <ThrifterMarketplace 
                  searchId={currentSearch.id}
                  imageUrl={imageUrl}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};