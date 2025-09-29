import { useState, useCallback } from 'react';
import { Upload, ImagePlus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MoodboardUploadProps {
  onUpload: (files: File[]) => void;
  isLoading?: boolean;
}

export const MoodboardUpload = ({ onUpload, isLoading = false }: MoodboardUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    // Preview images
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    onUpload(imageFiles);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Sparkles className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Create Your Style Moodboard</h2>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Upload outfit inspiration, style photos, or Pinterest-style collages. Our AI will find similar thrifted pieces across multiple platforms.
        </p>
      </div>

      <Card 
        className={`relative border-2 border-dashed transition-all duration-300 ${
          dragActive 
            ? 'border-accent bg-accent/5 scale-105 shadow-glow' 
            : 'border-border bg-card hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-12 text-center space-y-6">
          {uploadedImages.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-soft">
                    <img 
                      src={image} 
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button variant="secondary" size="lg" disabled={isLoading}>
                  <ImagePlus className="w-5 h-5" />
                  Add More Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
                <Button variant="cta" size="xl" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Finding Matches...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Find My Style
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-12 h-12 text-primary" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Drop your style inspiration here</h3>
                <p className="text-muted-foreground">
                  Or click to browse your files
                </p>
              </div>
              <Button variant="secondary" size="lg" className="relative">
                <ImagePlus className="w-5 h-5" />
                Choose Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};