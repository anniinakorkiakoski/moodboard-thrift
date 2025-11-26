import { useState, useCallback, useEffect } from 'react';
import { Upload, ImagePlus, Sparkles, Search, Trash2, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUserImages } from '@/hooks/useUserImages';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ImageMatchesDialog } from './ImageMatchesDialog';
// Force refresh - fixed updateCaption duplicate declaration issue

interface UploadedImage {
  url: string;
  caption: string;
  aspectRatio: number;
  id?: string;
}

interface GalleryUploadProps {
  onUpload: (files: File[]) => void;
  onImageSearch?: (image: UploadedImage) => void;
  isLoading?: boolean;
}

export const GalleryUpload = ({ onUpload, onImageSearch, isLoading = false }: GalleryUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [editingCaptionText, setEditingCaptionText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [pinterestUrl, setPinterestUrl] = useState('');
  const [extractingPinterest, setExtractingPinterest] = useState(false);
  const [imageMatches, setImageMatches] = useState<Map<string, number>>(new Map());
  const [selectedImageForMatches, setSelectedImageForMatches] = useState<{ id: string; url: string } | null>(null);
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [dragOverImageId, setDragOverImageId] = useState<string | null>(null);
  
  const { images, loading, uploadImage, updateCaption: updateImageCaption, deleteImage, updateImageOrder, getImageUrl } = useUserImages();
  const { toast } = useToast();

  // Check authentication status and fetch match counts
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setCheckingAuth(false);
      if (user) {
        fetchMatchCounts();
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session?.user);
      if (session?.user) {
        fetchMatchCounts();
      }
    });

    return () => subscription.unsubscribe();
  }, [images]);

  const fetchMatchCounts = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Get all searches with completed status
      const { data: searches } = await supabase
        .from('visual_searches')
        .select('user_image_id, id')
        .eq('status', 'completed')
        .not('user_image_id', 'is', null);

      if (!searches) return;

      // Get match counts for each search
      const counts = new Map<string, number>();
      for (const search of searches) {
        if (search.user_image_id) {
          const { count } = await supabase
            .from('search_results')
            .select('*', { count: 'exact', head: true })
            .eq('search_id', search.id);

          if (count && count > 0) {
            counts.set(search.user_image_id, count);
          }
        }
      }

      setImageMatches(counts);
    } catch (error) {
      console.error('Error fetching match counts:', error);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
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

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

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

  const handlePinterestExtract = async () => {
    if (!pinterestUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a Pinterest URL.",
        variant: "destructive"
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save images.",
        variant: "destructive"
      });
      return;
    }

    setExtractingPinterest(true);

    try {
      const { data, error } = await supabase.functions.invoke('pinterest-extract', {
        body: { url: pinterestUrl }
      });

      if (error) throw error;

      const images = data.images || [];
      
      if (images.length === 0) {
        toast({
          title: "No Images Found",
          description: "Could not extract images from this Pinterest URL.",
          variant: "destructive"
        });
        return;
      }

      // Download and upload each image with CORS workaround
      let successCount = 0;
      for (const image of images) {
        try {
          // Use fetch with no-cors mode to get the image
          const response = await fetch(image.url, { mode: 'no-cors' });
          
          // If no-cors fails, try loading via Image element
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = image.url;
          });
          
          // Convert image to blob via canvas
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.9);
          });
          
          const file = new File([blob], `pinterest-${Date.now()}.jpg`, { type: 'image/jpeg' });
          const aspectRatio = img.width / img.height;

          await uploadImage(file, image.title, aspectRatio);
          successCount++;
        } catch (imgError) {
          console.error('Failed to upload Pinterest image:', imgError);
        }
      }
      
      if (successCount === 0) {
        throw new Error('Could not download any images from Pinterest');
      }

      toast({
        title: "Images Added",
        description: `Successfully added ${images.length} image(s) from Pinterest.`
      });

      setPinterestUrl('');
    } catch (error) {
      console.error('Pinterest extract error:', error);
      toast({
        title: "Extraction Failed",
        description: "Failed to extract images from Pinterest. Please try again.",
        variant: "destructive"
      });
    } finally {
      setExtractingPinterest(false);
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

  const handleImageDragStart = (e: React.DragEvent, imageId: string) => {
    setDraggedImageId(imageId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleImageDragOver = (e: React.DragEvent, imageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverImageId(imageId);
  };

  const handleImageDragLeave = () => {
    setDragOverImageId(null);
  };

  const handleImageDrop = async (e: React.DragEvent, targetImageId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverImageId(null);
    
    if (!draggedImageId || draggedImageId === targetImageId) {
      setDraggedImageId(null);
      return;
    }

    try {
      const draggedIndex = images.findIndex(img => img.id === draggedImageId);
      const targetIndex = images.findIndex(img => img.id === targetImageId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      // Reorder the images array
      const reorderedImages = [...images];
      const [draggedImage] = reorderedImages.splice(draggedIndex, 1);
      reorderedImages.splice(targetIndex, 0, draggedImage);

      // Update display_order for all affected images
      const updatePromises = reorderedImages.map((img, index) => 
        updateImageOrder(img.id, index)
      );

      await Promise.all(updatePromises);

      toast({
        title: "Order Updated",
        description: "Your images have been reordered."
      });
    } catch (error) {
      console.error('Error reordering images:', error);
      toast({
        title: "Reorder Failed",
        description: "Failed to reorder images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDraggedImageId(null);
    }
  };

  const handleImageDragEnd = () => {
    setDraggedImageId(null);
    setDragOverImageId(null);
  };

  const displayImages = images.map(img => ({
    id: img.id,
    url: getImageUrl(img.file_path),
    caption: img.caption,
    aspectRatio: img.aspect_ratio,
    filePath: img.file_path
  }));

  if (checkingAuth) {
    return (
      <div className="w-full px-4">
        <Card className="border-2 border-muted bg-card min-h-[400px]">
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-2 border-burgundy border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </Card>
      </div>
    );
  }

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
    <div className="w-full">
      <div className="space-y-12">
        {/* Upload Area */}
        {displayImages.length === 0 && (
          <div className="relative max-w-4xl mx-auto px-4 space-y-6">
            <Card 
              className={`relative border-2 transition-all duration-500 min-h-[400px] ${
                dragActive 
                  ? 'border-burgundy bg-burgundy/5 shadow-lg' 
                  : 'border-muted bg-card hover:border-burgundy/50 hover:shadow-md'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleFileDrop}
            >
              <div className="p-16 text-center space-y-8">
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
              </div>
            </Card>

            {/* Pinterest URL Input */}
            <Card className="border-2 border-muted bg-card">
              <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="w-12 h-12 border border-muted-foreground/20 flex items-center justify-center">
                      <Link2 className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-light font-serif text-primary">Import from Pinterest</h3>
                  <p className="text-xs font-light text-muted-foreground">
                    Paste a Pinterest board or pin URL
                  </p>
                </div>
                <div className="flex gap-3 max-w-2xl mx-auto">
                  <Input
                    value={pinterestUrl}
                    onChange={(e) => setPinterestUrl(e.target.value)}
                    placeholder="https://pinterest.com/..."
                    className="font-light"
                    disabled={extractingPinterest}
                  />
                  <Button 
                    onClick={handlePinterestExtract}
                    disabled={extractingPinterest || !pinterestUrl.trim()}
                    className="bg-burgundy hover:bg-burgundy/90 text-burgundy-foreground"
                  >
                    {extractingPinterest ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Extract'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Full Width Gallery */}
        {displayImages.length > 0 && (
          <div 
            className={`relative ${
              dragActive ? 'bg-burgundy/5' : ''
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleFileDrop}
          >
            {/* Masonry Grid - Full Width */}
            <div className="columns-2 md:columns-4 lg:columns-5 gap-3 md:gap-4 space-y-3 md:space-y-4">
              {displayImages.map((image, index) => (
                <div 
                  key={image.id} 
                  className="break-inside-avoid group relative cursor-move"
                  draggable
                  onDragStart={(e) => handleImageDragStart(e, image.id)}
                  onDragOver={(e) => handleImageDragOver(e, image.id)}
                  onDragLeave={handleImageDragLeave}
                  onDrop={(e) => handleImageDrop(e, image.id)}
                  onDragEnd={handleImageDragEnd}
                >
                  <div className={`bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
                    draggedImageId === image.id ? 'opacity-50 scale-95' : ''
                  } ${
                    dragOverImageId === image.id && draggedImageId !== image.id 
                      ? 'ring-2 ring-burgundy scale-105' 
                      : ''
                  }`}>
                    <div className="relative cursor-pointer" onClick={() => {
                      const matchCount = imageMatches.get(image.id);
                      if (matchCount && matchCount > 0) {
                        setSelectedImageForMatches({ id: image.id, url: image.url });
                      }
                    }}>
                      <img 
                        src={image.url} 
                        alt={image.caption || 'Inspiration image'}
                        className="w-full h-auto object-cover"
                      />
                      
                      {/* Match indicator badge */}
                      {imageMatches.get(image.id) && imageMatches.get(image.id)! > 0 && (
                        <div className="absolute top-2 left-2 z-20">
                          <div className="w-8 h-8 bg-burgundy rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                            {imageMatches.get(image.id)}
                          </div>
                        </div>
                      )}
                      
                      {/* Action buttons - top right */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-20">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onImageSearch?.({
                              id: image.id,
                              url: image.url,
                              caption: image.caption,
                              aspectRatio: image.aspectRatio
                            });
                          }}
                        >
                          <Search className="w-3 h-3" />
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
                      
                      {/* Caption overlay - always visible */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 z-10">
                        {editingCaption === image.id ? (
                          <textarea
                            value={editingCaptionText}
                            onChange={(e) => setEditingCaptionText(e.target.value)}
                            onBlur={() => {
                              handleUpdateCaption(image.id, editingCaptionText);
                              setEditingCaption(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.shiftKey) {
                                return; // Allow new line with Shift+Enter
                              }
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleUpdateCaption(image.id, editingCaptionText);
                                setEditingCaption(null);
                              }
                              if (e.key === 'Escape') {
                                setEditingCaption(null);
                              }
                            }}
                            placeholder="what do you love about this?"
                            className="w-full text-sm border-2 border-white/50 p-2 rounded bg-black/40 focus-visible:ring-0 focus-visible:border-white text-white placeholder:text-white/60 font-light font-lora resize-none"
                            autoFocus
                            rows={3}
                          />
                        ) : (
                          <div 
                            className="text-sm text-white font-light leading-relaxed cursor-pointer min-h-[20px] font-lora whitespace-pre-wrap"
                            onClick={() => {
                              setEditingCaption(image.id);
                              setEditingCaptionText(image.caption);
                            }}
                          >
                            {image.caption || 'what do you love about this?'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-8 mt-12">
              {/* Pinterest URL Input - Also available when gallery has images */}
              <Card className="border-2 border-muted bg-card max-w-4xl mx-auto">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                      <Link2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 flex gap-3">
                      <Input
                        value={pinterestUrl}
                        onChange={(e) => setPinterestUrl(e.target.value)}
                        placeholder="Paste Pinterest URL to add more images"
                        className="font-light text-sm"
                        disabled={extractingPinterest}
                      />
                      <Button 
                        onClick={handlePinterestExtract}
                        disabled={extractingPinterest || !pinterestUrl.trim()}
                        variant="outline"
                        className="border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground"
                      >
                        {extractingPinterest ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          'Extract'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Main Action Buttons */}
              <div className="flex items-center justify-center gap-6 px-4">
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
          </div>
        )}

        {/* Matches Dialog */}
        {selectedImageForMatches && (
          <ImageMatchesDialog
            open={!!selectedImageForMatches}
            onClose={() => setSelectedImageForMatches(null)}
            imageId={selectedImageForMatches.id}
            imageUrl={selectedImageForMatches.url}
          />
        )}
      </div>
    </div>
  );
};