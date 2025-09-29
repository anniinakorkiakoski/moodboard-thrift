import { useState } from 'react';
import { MoodboardUpload } from '@/components/MoodboardUpload';
import { BundleDisplay } from '@/components/BundleDisplay';
import heroBackground from '@/assets/hero-background.jpg';
import sectionBackground from '@/assets/section-background.jpg';

const Index = () => {
  const [currentView, setCurrentView] = useState<'upload' | 'searching' | 'results'>('upload');

  const handleUpload = (files: File[]) => {
    console.log('Uploaded files:', files);
    setCurrentView('searching');
    
    // Simulate AI processing time
    setTimeout(() => {
      setCurrentView('results');
    }, 3000);
  };

  const handleStartOver = () => {
    setCurrentView('upload');
  };

  if (currentView === 'searching') {
    return <BundleDisplay isSearching={true} />;
  }

  if (currentView === 'results') {
    return (
      <div>
        <BundleDisplay />
        <div className="fixed bottom-6 left-6">
          <button
            onClick={handleStartOver}
            className="bg-card/90 backdrop-blur-sm hover:bg-card text-foreground px-4 py-2 rounded-lg shadow-soft transition-all duration-300 hover:shadow-glow border"
          >
            ← New Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center space-y-8 mb-12">
            <div className="mt-16 flex justify-center">
              <div className="w-80 h-80 bg-accent shadow-glow flex items-center justify-center">
                <h1 className="text-3xl md:text-4xl font-black text-accent-foreground leading-tight text-center px-2">
                  <span className="block">Find your</span>
                  <span className="block">perfect</span>
                  <span className="block whitespace-nowrap">thrift bundle.</span>
                </h1>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Upload your style inspiration and let AI find the perfect secondhand pieces 
              across multiple platforms. Sustainable fashion made effortless.
            </p>
          </div>

          <MoodboardUpload 
            onUpload={handleUpload} 
            isLoading={false} 
          />
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: `url(${sectionBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center space-y-8 mb-16">
            <h2 className="text-4xl font-bold">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From inspiration to outfit in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-accent">1</span>
              </div>
              <h3 className="text-xl font-semibold">Upload Inspiration</h3>
              <p className="text-muted-foreground">
                Share your style moodboard, outfit photos, or Pinterest-style collages
              </p>
            </div>

            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold">AI Finds Matches</h3>
              <p className="text-muted-foreground">
                Our smart system scans Vinted, Tise, Emmy, Etsy, and more for similar pieces
              </p>
            </div>

            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-earth/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-earth-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold">Curate & Purchase</h3>
              <p className="text-muted-foreground">
                Review your personalized bundle, filter by size and location, then purchase
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;