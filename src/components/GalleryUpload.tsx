import { useState, useCallback } from 'react';
import { Upload, ImagePlus, Sparkles, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface UploadedImage {
  url: string;
  caption: string;
  aspectRatio: number;
}

interface GalleryUploadProps {
  onUpload: (files: File[]) => void;
  isLoading?: boolean;
}

export const GalleryUpload = ({ onUpload, isLoading = false }: GalleryUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [editingCaption, setEditingCaption] = useState<number | null>(null);

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
          const img = new Image();
          img.onload = () => {
            const aspectRatio = img.width / img.height;
            setUploadedImages(prev => [...prev, {
              url: e.target!.result as string,
              caption: '',
              aspectRatio
            }]);
          };
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    });

    onUpload(imageFiles);
  };

  const updateCaption = (index: number, caption: string) => {
    setUploadedImages(prev => prev.map((img, i) => 
      i === index ? { ...img, caption } : img
    ));
  };

  const platforms = [
    { name: 'Pinterest', initial: 'P', color: 'bg-red-500', position: 'translate-x-4 -translate-y-2' },
    { name: 'Vinted', initial: 'V', color: 'bg-orange-500', position: '-translate-x-8 translate-y-4' },
    { name: 'Tise', initial: 'T', color: 'bg-blue-500', position: 'translate-x-12 translate-y-8' },
    { name: 'Emmy', initial: 'E', color: 'bg-pink-500', position: '-translate-x-6 -translate-y-6' },
    { name: 'The RealReal', initial: 'R', color: 'bg-black', position: 'translate-x-8 -translate-y-4' },
    { name: 'Depop', initial: 'D', color: 'bg-green-500', position: '-translate-x-4 translate-y-12' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Gallery-style layout with asymmetric positioning */}
      <div className="grid grid-cols-12 gap-8 items-start min-h-[80vh]">
        
        {/* Left column - Upload Area */}
        <div className="col-span-12 md:col-span-7 lg:col-span-8">
          <div className="space-y-16">
            
            {/* Upload frame */}
            <div className="relative">
              <Card 
                className={`relative border-2 transition-all duration-500 min-h-[400px] ${
                  dragActive 
                    ? 'border-burgundy bg-burgundy/5 shadow-lg' 
                    : 'border-muted bg-card hover:border-burgundy/50 hover:shadow-md'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="p-16 text-center space-y-8">
                  {uploadedImages.length > 0 ? (
                  <div className="space-y-8">
                      {/* Masonry Gallery Layout */}
                      <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="break-inside-avoid mb-6 group">
                            <div className="bg-white border border-muted shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                              <div className="relative">
                                <img 
                                  src={image.url} 
                                  alt={`Inspiration ${index + 1}`}
                                  className="w-full h-auto object-cover"
                                  style={{ aspectRatio: image.aspectRatio }}
                                />
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white"
                                    onClick={() => setEditingCaption(editingCaption === index ? null : index)}
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="p-3">
                                {editingCaption === index ? (
                                  <Input
                                    value={image.caption}
                                    onChange={(e) => updateCaption(index, e.target.value)}
                                    onBlur={() => setEditingCaption(null)}
                                    onKeyDown={(e) => e.key === 'Enter' && setEditingCaption(null)}
                                    placeholder="What do you love about this?"
                                    className="text-xs border-none p-0 h-auto focus-visible:ring-0 text-text-refined font-light"
                                    autoFocus
                                  />
                                ) : (
                                  <p 
                                    className="text-xs text-text-refined font-light leading-relaxed cursor-pointer min-h-[16px]"
                                    onClick={() => setEditingCaption(index)}
                                  >
                                    {image.caption || 'Click to add a note...'}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-6">
                        <Button variant="outline" size="lg" disabled={isLoading} className="relative border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground">
                          <ImagePlus className="w-4 h-4 mr-2" />
                          Add More
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </Button>
                        <Button size="lg" disabled={isLoading} className="bg-burgundy hover:bg-burgundy/90 text-burgundy-foreground font-medium px-8">
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                              Curating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Begin Curation
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center">
                        <div className="w-20 h-20 border-2 border-muted-foreground/20 flex items-center justify-center">
                          <Upload className="w-10 h-10 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-light font-serif text-primary">Share your inspiration</h3>
                        <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md mx-auto">
                          Drag images here, or select from your collection
                        </p>
                      </div>
                      <Button variant="outline" size="lg" className="relative border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground font-medium">
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Browse Images
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
          </div>
        </div>

        {/* Right column - Platform Gallery */}
        <div className="col-span-12 md:col-span-5 lg:col-span-4">
          <div className="space-y-12">
            <div className="text-left">
              <p className="text-xs font-light tracking-wider text-muted-foreground uppercase mb-8">
                Sourcing from
              </p>
              
              {/* Gallery wall of platforms */}
              <div className="relative min-h-[300px]">
                {platforms.map((platform, index) => (
                  <div 
                    key={platform.name}
                    className={`absolute ${platform.position} group cursor-pointer`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="bg-white border border-muted shadow-sm p-4 hover:shadow-md transition-all duration-300 group-hover:scale-105">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${platform.color} flex items-center justify-center`}>
                          <span className="text-white text-xs font-bold">{platform.initial}</span>
                        </div>
                        <span className="text-xs font-light text-primary">{platform.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};