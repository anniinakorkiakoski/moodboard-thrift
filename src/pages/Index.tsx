import { useState } from 'react';
import { GalleryUpload } from '@/components/GalleryUpload';
import { StylerFinds } from '@/components/StylerFinds';
import { BundleDisplay } from '@/components/BundleDisplay';

const Index = () => {
  const [currentView, setCurrentView] = useState<'upload' | 'searching' | 'results'>('upload');
  const [searchedImage, setSearchedImage] = useState<{ url: string; caption: string } | null>(null);

  const handleUpload = (files: File[]) => {
    console.log('Uploaded files:', files);
    setCurrentView('searching');
    setSearchedImage(null);
    
    // Simulate AI processing time
    setTimeout(() => {
      setCurrentView('results');
    }, 3000);
  };

  const handleImageSearch = (image: { url: string; caption: string }) => {
    setSearchedImage(image);
    setCurrentView('searching');
    // Simulate AI processing time for visual search
    setTimeout(() => {
      setCurrentView('results');
    }, 2500);
  };

  const handleStartOver = () => {
    setCurrentView('upload');
    setSearchedImage(null);
  };

  if (currentView === 'searching') {
    return <BundleDisplay isSearching={true} />;
  }

  if (currentView === 'results') {
    return <StylerFinds searchedImage={searchedImage} onStartOver={handleStartOver} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center relative">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-16 mb-32">
            <div className="mt-16 flex justify-center">
              <div className="flex items-center w-full">
                {/* Left burgundy extension */}
                <div className="flex-1 h-80 bg-accent-foreground"></div>
                
                {/* Center transparent square */}
                <div className="w-80 h-80 bg-transparent flex items-center justify-center flex-shrink-0">
                  <h1 className="text-8xl md:text-9xl font-black text-accent-foreground leading-none text-center tracking-tighter">
                    CURA
                  </h1>
                </div>
                
                {/* Right burgundy extension */}
                <div className="flex-1 h-80 bg-accent-foreground"></div>
              </div>
            </div>
            <p className="text-lg font-light text-primary max-w-2xl mx-auto leading-relaxed mt-20 font-serif">
              Upload your style inspiration, and let Al find the perfect secondhand pieces from across multiple platforms.
              <br /><br />
              <span className="text-base">Sustainable fashion, curated for you.</span>
            </p>
          </div>

          <GalleryUpload 
            onUpload={handleUpload}
            onImageSearch={handleImageSearch}
            isLoading={false} 
          />
        </div>
      </section>

      {/* Gallery Process Section */}
      <section className="py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Section title */}
            <div className="text-center mb-24">
              <h2 className="text-2xl font-light font-serif text-primary mb-4">The Process</h2>
              <p className="text-sm font-light text-muted-foreground tracking-wide">
                Three moments in your curation journey
              </p>
            </div>

            {/* Gallery-style grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
              
              {/* Step 1 - Large frame */}
              <div className="md:col-span-5 space-y-6">
                <div className="bg-white border-2 border-muted p-12 shadow-sm">
                  <div className="space-y-4">
                    <div className="w-8 h-8 bg-burgundy flex items-center justify-center">
                      <span className="text-sm font-medium text-burgundy-foreground">01</span>
                    </div>
                    <h3 className="text-lg font-light font-serif text-primary">Share</h3>
                    <p className="text-sm font-light text-muted-foreground leading-relaxed">
                      Upload your style inspiration — mood boards, outfit photos, or curated imagery that speaks to your aesthetic vision.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 - Medium frame, offset */}
              <div className="md:col-span-4 md:col-start-7 space-y-6 md:mt-16">
                <div className="bg-white border border-muted p-8 shadow-sm">
                  <div className="space-y-4">
                    <div className="w-6 h-6 bg-burgundy flex items-center justify-center">
                      <span className="text-xs font-medium text-burgundy-foreground">02</span>
                    </div>
                    <h3 className="text-base font-light font-serif text-primary">Discover</h3>
                    <p className="text-xs font-light text-muted-foreground leading-relaxed">
                      Our AI carefully searches through premium secondhand platforms to find pieces that match your vision.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 - Small frame, positioned uniquely */}
              <div className="md:col-span-3 md:col-start-4 space-y-6 md:-mt-8">
                <div className="bg-white border border-muted p-6 shadow-sm">
                  <div className="space-y-3">
                    <div className="w-5 h-5 bg-burgundy flex items-center justify-center">
                      <span className="text-xs font-medium text-burgundy-foreground">03</span>
                    </div>
                    <h3 className="text-sm font-light font-serif text-primary">Curate</h3>
                    <p className="text-xs font-light text-muted-foreground leading-relaxed">
                      Review your personalized collection and make thoughtful additions to your wardrobe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;