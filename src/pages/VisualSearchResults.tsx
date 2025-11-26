import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVisualSearch } from '@/hooks/useVisualSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VisualSearchResultCard } from '@/components/VisualSearchResultCard';
import { VisualSearchNoResults } from '@/components/VisualSearchNoResults';
import { ThrifterMarketplace } from '@/components/ThrifterMarketplace';
import { ImageCropOverlay } from '@/components/ImageCropOverlay';
import { Navigation } from '@/components/Navigation';

export const VisualSearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageUrl, imageId } = location.state || {};
  const { currentSearch, results, loading, startSearch } = useVisualSearch();
  const [activeTab, setActiveTab] = useState<'results' | 'marketplace'>('results');
  const [showCropOverlay, setShowCropOverlay] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);

  // Show crop overlay on initial load
  useEffect(() => {
    if (imageUrl && !searchInitiated) {
      setShowCropOverlay(true);
    }
  }, [imageUrl, searchInitiated]);

  const handleConfirmCrop = async (cropData: any, budget?: { min: number; max: number }) => {
    setShowCropOverlay(false);
    setSearchInitiated(true);
    await startSearch(imageUrl, cropData, budget, imageId);
  };

  const handleCancelCrop = () => {
    navigate('/');
  };

  useEffect(() => {
    // If no matches found, switch to marketplace tab
    if (currentSearch?.status === 'no_matches') {
      setActiveTab('marketplace');
    }
  }, [currentSearch]);

  if (!imageUrl) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center pt-32">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground font-mono">no image selected for search.</p>
            <Button onClick={() => navigate('/')} className="font-mono">go back</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Crop overlay */}
      {showCropOverlay && imageUrl && (
        <ImageCropOverlay
          imageUrl={imageUrl}
          onConfirm={handleConfirmCrop}
          onCancel={handleCancelCrop}
        />
      )}

      {/* Search Image & Attributes */}
      <div className="container mx-auto px-4 py-8 pt-32">
        <div className="max-w-md mx-auto mb-8">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden border-2 border-muted">
            <img 
              src={imageUrl} 
              alt="Search query"
              className="w-full h-full object-cover"
            />
          </div>
          
          {currentSearch?.attributes && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-3">
              <p className="text-xs font-medium text-primary uppercase tracking-wider">
                Detected Attributes:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {currentSearch.attributes.itemType && (
                  <div>
                    <span className="text-muted-foreground">Type:</span>{' '}
                    <span className="font-medium">{currentSearch.attributes.itemType}</span>
                  </div>
                )}
                {currentSearch.attributes.fabricType && (
                  <div>
                    <span className="text-muted-foreground">Fabric:</span>{' '}
                    <span className="font-medium">{currentSearch.attributes.fabricType}</span>
                  </div>
                )}
                {currentSearch.attributes.primaryColors && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Colors:</span>{' '}
                    <span className="font-medium">{currentSearch.attributes.primaryColors.join(', ')}</span>
                  </div>
                )}
                {currentSearch.attributes.silhouette && (
                  <div>
                    <span className="text-muted-foreground">Silhouette:</span>{' '}
                    <span className="font-medium">{currentSearch.attributes.silhouette}</span>
                  </div>
                )}
                {currentSearch.attributes.aesthetic && (
                  <div>
                    <span className="text-muted-foreground">Aesthetic:</span>{' '}
                    <span className="font-medium">{currentSearch.attributes.aesthetic}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading || currentSearch?.status === 'analyzing' || currentSearch?.status === 'searching' ? (
          <div className="text-center py-16 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-burgundy" />
            <div className="space-y-2">
              <p className="text-lg font-semibold text-primary">
                {currentSearch?.status === 'analyzing' && 'Analyzing your image...'}
                {currentSearch?.status === 'searching' && 'Searching curated platforms...'}
                {!currentSearch && 'Starting search...'}
              </p>
              <p className="text-sm text-muted-foreground font-lora">
                Extracting attributes and matching against vintage marketplaces
              </p>
            </div>
          </div>
        ) : currentSearch?.status === 'no_matches' ? (
          /* No Results */
          <VisualSearchNoResults 
            attributes={currentSearch.attributes}
            imageUrl={imageUrl}
          />
        ) : (
          /* Results Tabs */
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="results" className="data-[state=active]:bg-burgundy data-[state=active]:text-burgundy-foreground">
                Search Results {results.length > 0 && `(${results.length})`}
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="data-[state=active]:bg-burgundy data-[state=active]:text-burgundy-foreground">
                Hire a Thrifter
              </TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-6">
              {results.length > 0 ? (
                <div className="space-y-6">
                  {/* Results header */}
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-primary uppercase tracking-[0.2em]">
                      Curated Matches
                    </h2>
                    <div className="w-16 h-px bg-primary/40 mx-auto" />
                    <p className="text-sm text-muted-foreground font-lora max-w-lg mx-auto">
                      {currentSearch?.status === 'tentative_matches' 
                        ? 'Found similar items - please verify if they match your needs'
                        : 'High-quality matches from verified secondhand platforms'}
                    </p>
                  </div>

                  {/* Results grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((result) => (
                      <VisualSearchResultCard key={result.id} result={result} />
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="text-center pt-8">
                    <p className="text-sm text-muted-foreground mb-4 font-lora">
                      Need help finding the perfect match?
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('marketplace')}
                      className="border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground"
                    >
                      Hire a Pro Thrifter
                    </Button>
                  </div>
                </div>
              ) : (
                <VisualSearchNoResults 
                  attributes={currentSearch?.attributes}
                  imageUrl={imageUrl}
                  suggestions={currentSearch?.analysis_data?.suggestions}
                  searchQuery={currentSearch?.analysis_data?.searchQuery}
                />
              )}
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