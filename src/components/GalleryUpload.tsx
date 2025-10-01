import { useState, useCallback, useEffect } from 'react';
import { Upload, ImagePlus, Sparkles, Edit2, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUserImages } from '@/hooks/useUserImages';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
// Force refresh - fixed updateCaption duplicate declaration issue

interface UploadedImage {
  url: string;
  caption: string;
  aspectRatio: number;
}

interface GalleryUploadProps {
  onUpload: (files: File[]) => void;
  onImageSearch?: (image: UploadedImage) => void;
  isLoading?: boolean;
}

export const GalleryUpload = ({ onUpload, onImageSearch, isLoading = false }: GalleryUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { images, loading, uploadImage, updateCaption: updateImageCaption, deleteImage, getImageUrl } = useUserImages();
  const { toast } = useToast();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const handleFiles = async (files: FileList) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your images.",
        variant: "destructive"
      });
      return;
    }

    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    // Upload each image to Supabase
    for (const file of imageFiles) {
      try {
        // Calculate aspect ratio
        const img = new Image();
        const aspectRatio = await new Promise<number>((resolve) => {
          img.onload = () => resolve(img.width / img.height);
          img.src = URL.createObjectURL(file);
        });

        await uploadImage(file, '', aspectRatio);
        
        toast({
          title: "Image Uploaded",
          description: `${file.name} has been saved to your collection.`
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}. Please try again.`,
          variant: "destructive"
        });
      }
    }

    onUpload(imageFiles);
  };

  const handleUpdateCaption = async (imageId: string, caption: string) => {
    try {
      await updateImageCaption(imageId, caption);
      setEditingCaption(null);
      toast({
        title: "Caption Updated",
        description: "Your image caption has been saved."
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update caption. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteImage = async (imageId: string, filePath: string) => {
    try {
      await deleteImage(imageId, filePath);
      toast({
        title: "Image Deleted",
        description: "Image has been removed from your collection."
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const platforms = [
    { name: 'Vinted', initial: 'V', color: 'bg-orange-500' },
    { name: 'Depop', initial: 'D', color: 'bg-green-500' },
    { name: 'Vestiaire Collective', initial: 'VC', color: 'bg-black' },
    { name: 'The RealReal', initial: 'TRR', color: 'bg-gray-800' },
    { name: 'thredUP', initial: 'TU', color: 'bg-blue-600' },
    { name: 'eBay', initial: 'E', color: 'bg-red-600' },
    { name: 'Facebook Marketplace', initial: 'FB', color: 'bg-blue-500' },
    { name: 'Shpock', initial: 'S', color: 'bg-purple-600' },
    { name: 'Grailed', initial: 'G', color: 'bg-gray-700' },
    { name: 'Poshmark', initial: 'P', color: 'bg-pink-600' },
    { name: 'ASOS Marketplace', initial: 'AM', color: 'bg-green-600' },
    { name: 'Hardly Ever Worn It', initial: 'HEWI', color: 'bg-burgundy' },
    { name: 'Marrkt', initial: 'M', color: 'bg-indigo-600' },
    { name: 'True Vintage', initial: 'TV', color: 'bg-amber-700' },
    { name: 'FINDS', initial: 'F', color: 'bg-teal-600' },
    { name: 'Zalando Pre-Owned', initial: 'Z', color: 'bg-orange-600' },
    { name: 'Etsy', initial: 'Et', color: 'bg-orange-500' },
    { name: 'Tise', initial: 'T', color: 'bg-blue-500' },
    { name: 'Selpy', initial: 'Se', color: 'bg-purple-500' },
    { name: 'Emmy', initial: 'Em', color: 'bg-pink-500' }
  ];

  const displayImages = images.map(img => ({
    id: img.id,
    url: getImageUrl(img.file_path),
    caption: img.caption,
    aspectRatio: img.aspect_ratio,
    filePath: img.file_path
  }));

  if (!isAuthenticated) {
    return (
      <div className="w-full px-4">
        <Card className="border-2 border-muted bg-card min-h-[400px]">
          <div className="p-16 text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 border-2 border-muted-foreground/20 flex items-center justify-center">
                <Upload className="w-10 h-10 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-light font-serif text-primary">Sign in to save your inspiration</h3>
              <p className="text-sm font-light text-foreground/90 leading-relaxed max-w-md mx-auto font-serif">
                Create an account to save and manage your image collections permanently
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-4">
      <div className="space-y-16">
        <div className="relative max-w-none">
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
              {displayImages.length > 0 ? (
                <div className="space-y-8">
                  {/* Editorial picture wall with varied sizes */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 auto-rows-[200px]">
                    {displayImages.map((image, index) => {
                      // Create varied sizes for editorial effect
                      const sizeVariants = [
                        'col-span-2 row-span-2', // Large square
                        'col-span-1 row-span-2', // Tall portrait
                        'col-span-2 row-span-1', // Wide landscape
                        'col-span-1 row-span-1', // Small square
                        'col-span-2 row-span-2', // Large square
                        'col-span-1 row-span-1', // Small square
                      ];
                      
                      const sizeClass = sizeVariants[index % sizeVariants.length];
                      
                      return (
                        <div key={image.id} className={`${sizeClass} group relative`}>
                          <div className="bg-white border border-muted shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden h-full">
                            <div className="relative h-full">
                              <img 
                                src={image.url} 
                                alt={image.caption || 'Inspiration image'}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white h-7 w-7 p-0"
                                  onClick={() => onImageSearch?.({
                                    url: image.url,
                                    caption: image.caption,
                                    aspectRatio: image.aspectRatio
                                  })}
                                >
                                  <Search className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white h-7 w-7 p-0"
                                  onClick={() => setEditingCaption(editingCaption === image.id ? null : image.id)}
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white h-7 w-7 p-0"
                                  onClick={() => handleDeleteImage(image.id, image.filePath)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                              
                              {/* Caption overlay on hover */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                {editingCaption === image.id ? (
                                  <Input
                                    value={image.caption}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      displayImages.find(img => img.id === image.id)!.caption = newValue;
                                    }}
                                    onBlur={(e) => handleUpdateCaption(image.id, e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleUpdateCaption(image.id, (e.target as HTMLInputElement).value);
                                      }
                                    }}
                                    placeholder="What do you love about this?"
                                    className="text-xs border-none p-1 h-auto focus-visible:ring-0 text-white bg-transparent font-light font-lora"
                                    autoFocus
                                  />
                                ) : (
                                  <p 
                                    className="text-xs text-white font-light leading-relaxed cursor-pointer min-h-[16px] font-lora"
                                    onClick={() => setEditingCaption(image.id)}
                                  >
                                    {image.caption || 'Add a note...'}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <Button variant="outline" size="lg" disabled={isLoading || loading} className="relative border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground">
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
                    <Button size="lg" disabled={isLoading || displayImages.length === 0} className="bg-burgundy hover:bg-burgundy/90 text-burgundy-foreground font-medium px-8">
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
                  <Button variant="outline" size="lg" className="relative border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground font-medium" disabled={loading}>
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
        
        <div className="text-center space-y-8">
          <p className="text-xs font-light tracking-wider text-muted-foreground uppercase">
            Sourcing from
          </p>
          
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {platforms.map((platform, index) => (
              <div 
                key={platform.name}
                className="group cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="bg-white border border-muted shadow-sm p-4 hover:shadow-md transition-all duration-300 group-hover:scale-105 min-w-[120px]">
                  <div className="flex items-center justify-center gap-3">
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
  );
};