import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryUpload } from '@/components/GalleryUpload';
import { StylerFinds } from '@/components/StylerFinds';
import { BundleDisplay } from '@/components/BundleDisplay';
import { Navigation } from '@/components/Navigation';
import { useVisualSearch } from '@/hooks/useVisualSearch';
import { useToast } from '@/hooks/use-toast';

const Gallery = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchedImage, setSearchedImage] = useState<{ url: string; caption: string } | null>(null);
  const { startSearch, loading } = useVisualSearch();
  const { toast } = useToast();

  const handleUpload = (files: File[]) => {
    console.log('Uploaded files:', files);
    setIsSearching(true);
    setSearchedImage(null);
    
    // Simulate AI processing time
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 3000);
  };

  const handleImageSearch = async (image: { url: string; caption: string; aspectRatio: number; id?: string }) => {
    setIsSearching(true);
    try {
      // startSearch now navigates to visual-search-results with imageUrl in state
      navigate('/visual-search-results', { state: { imageUrl: image.url, imageId: image.id } });
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search failed",
        description: "Please try again or check your connection",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartOver = () => {
    setShowResults(false);
    setSearchedImage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Gallery Section */}
      <section className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-8">
          <div className="text-center mb-24 space-y-6">
            <h1 className="text-2xl md:text-3xl font-black text-primary uppercase tracking-[0.3em]">CURA GALLERY</h1>
            <div className="w-16 h-px bg-primary/40 mx-auto"></div>
            <p className="text-sm md:text-base font-light text-foreground/70 leading-loose max-w-xl mx-auto font-lora">
              Share your style inspiration and discover premium secondhand pieces curated specifically for your aesthetic
            </p>
          </div>
          
          <GalleryUpload 
            onUpload={handleUpload}
            onImageSearch={handleImageSearch}
            isLoading={isSearching} 
          />
        </div>
      </section>

      {/* Loading State */}
      {isSearching && (
        <section className="py-16">
          <BundleDisplay isSearching={true} />
        </section>
      )}

      {/* Results Section */}
      {showResults && (
        <section className="py-16 bg-secondary/30">
          <StylerFinds searchedImage={searchedImage} onStartOver={handleStartOver} />
        </section>
      )}
    </div>
  );
};

export default Gallery;
