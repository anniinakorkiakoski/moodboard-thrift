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
            <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-4 border border-border/50">
              <p className="text-xs font-medium text-primary uppercase tracking-wider">
                AI Analysis
              </p>
              
              {/* Text description */}
              {currentSearch.attributes.textDescription && (
                <p className="text-sm text-foreground/80 font-lora italic">
                  "{currentSearch.attributes.textDescription}"
                </p>
              )}
              
              {/* Key attributes grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {currentSearch.attributes.category && (
                  <div>
                    <span className="text-muted-foreground">Category:</span>{' '}
                    <span className="font-medium">{currentSearch.attributes.category}</span>
                  </div>
                )}
                {currentSearch.attributes.colors?.primary && (
                  <div>
                    <span className="text-muted-foreground">Color:</span>{' '}
                    <span className="font-medium">{currentSearch.attributes.colors.primary}</span>
                  </div>
                )}
                {currentSearch.attributes.material?.fabric && (
                  <div>
                    <span className="text-muted-foreground">Material:</span>{' '}
                    <span className="font-medium">{currentSearch.attributes.material.fabric}</span>
                  </div>
                )}
                {currentSearch.attributes.construction?.silhouette && (
                  <div>
                    <span className="text-muted-foreground">Silhouette:</span>{' '}
                    <span className="font-medium">{currentSearch.attributes.construction.silhouette}</span>
                  </div>
                )}
                {currentSearch.attributes.pattern?.type && (
                  <div>
                    <span className="text-muted-foreground">Pattern:</span>{' '}
                    <span className="font-medium">{currentSearch.attributes.pattern.type}</span>
                  </div>
                )}
                {currentSearch.attributes.style?.aesthetic && (
                  <div>
                    <span className="text-muted-foreground">Style:</span>{' '}
                    <span className="font-medium">{currentSearch.attributes.style.aesthetic}</span>
                  </div>
                )}
              </div>
              
              {/* Distinctive features */}
              {currentSearch.attributes.distinctiveFeatures?.length > 0 && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Notable details:</span>{' '}
                  <span className="font-medium">
                    {currentSearch.attributes.distinctiveFeatures.join(', ')}
                  </span>
                </div>
              )}
              
              {/* Search queries used */}
              {currentSearch.attributes.searchQueries && (
                <div className="pt-2 border-t border-border/30">
                  <p className="text-xs text-muted-foreground mb-2">Search terms used:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      currentSearch.attributes.searchQueries.primary,
                      currentSearch.attributes.searchQueries.fallback,
                      ...(currentSearch.attributes.searchQueries.keywords || []).slice(0, 3)
                    ].filter(Boolean).map((query: string, i: number) => (
                      <span 
                        key={i} 
                        className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {query}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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