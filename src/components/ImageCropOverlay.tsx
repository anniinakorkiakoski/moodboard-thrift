import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Search } from 'lucide-react';

interface ImageCropOverlayProps {
  imageUrl: string;
  onConfirm: (cropData: { x: number; y: number; width: number; height: number } | null, budget?: { min: number; max: number }) => void;
  onCancel: () => void;
}

export const ImageCropOverlay = ({ imageUrl, onConfirm, onCancel }: ImageCropOverlayProps) => {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [cropRect, setCropRect] = useState({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
  const [minBudget, setMinBudget] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const imageRef = useRef<HTMLImageElement>(null);

  const handleConfirm = () => {
    if (imageRef.current) {
      // Validate budget inputs
      const minValue = minBudget ? parseFloat(minBudget) : undefined;
      const maxValue = maxBudget ? parseFloat(maxBudget) : undefined;
      
      // Check if min is greater than max
      if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
        alert('Minimum price cannot be greater than maximum price');
        return;
      }
      
      // Check for negative values
      if ((minValue !== undefined && minValue < 0) || (maxValue !== undefined && maxValue < 0)) {
        alert('Prices cannot be negative');
        return;
      }
      
      const img = imageRef.current;
      const actualCrop = {
        x: cropRect.x * img.naturalWidth,
        y: cropRect.y * img.naturalHeight,
        width: cropRect.width * img.naturalWidth,
        height: cropRect.height * img.naturalHeight
      };
      
      // Parse budget values
      const budget = (minValue !== undefined || maxValue !== undefined) ? {
        min: minValue || 0,
        max: maxValue || 9999
      } : undefined;
      
      onConfirm(actualCrop, budget);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto">
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

            {/* Budget inputs */}
            <div className="max-w-md mx-auto space-y-3">
              <p className="text-xs font-medium text-primary uppercase tracking-wider text-center">
                Set Budget (Optional)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Min Price (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Max Price (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="No limit"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Leave empty to see all price ranges
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
