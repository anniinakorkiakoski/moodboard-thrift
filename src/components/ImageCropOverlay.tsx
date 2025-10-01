import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Search } from 'lucide-react';

interface ImageCropOverlayProps {
  imageUrl: string;
  onConfirm: (cropData: { x: number; y: number; width: number; height: number } | null) => void;
  onCancel: () => void;
}

export const ImageCropOverlay = ({ imageUrl, onConfirm, onCancel }: ImageCropOverlayProps) => {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [cropRect, setCropRect] = useState({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleConfirm = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      const actualCrop = {
        x: cropRect.x * img.naturalWidth,
        y: cropRect.y * img.naturalHeight,
        width: cropRect.width * img.naturalWidth,
        height: cropRect.height * img.naturalHeight
      };
      onConfirm(actualCrop);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Main content */}
        <div className="bg-white rounded-lg overflow-hidden">
          {/* Image with crop overlay */}
          <div className="relative aspect-video bg-muted">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Item to search"
              className="w-full h-full object-contain"
            />
            
            {isAdjusting && (
              <div
                className="absolute border-2 border-burgundy bg-burgundy/10"
                style={{
                  left: `${cropRect.x * 100}%`,
                  top: `${cropRect.y * 100}%`,
                  width: `${cropRect.width * 100}%`,
                  height: `${cropRect.height * 100}%`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-burgundy text-sm font-medium bg-white/90 px-2 py-1 rounded">
                    Search this area
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Confirm search area
              </h3>
              <p className="text-sm text-muted-foreground">
                {isAdjusting
                  ? 'Adjust the selection to focus on the item you want to find'
                  : 'We\'ll search for items matching this entire image'}
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              {!isAdjusting && (
                <Button
                  variant="outline"
                  onClick={() => setIsAdjusting(true)}
                  className="border-burgundy text-burgundy hover:bg-burgundy hover:text-burgundy-foreground"
                >
                  Adjust Area
                </Button>
              )}
              
              <Button
                onClick={handleConfirm}
                className="bg-burgundy text-burgundy-foreground hover:bg-burgundy/90"
              >
                <Search className="w-4 h-4 mr-2" />
                Search for Matches
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
