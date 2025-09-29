import { Button } from '@/components/ui/button';
import { Search, Sparkles, Phone } from 'lucide-react';

export const LibrarySidebar = () => {
  return (
    <div className="w-full h-full bg-secondary/30 border-l border-muted p-8">
      <div className="sticky top-8 space-y-6">
        <h3 className="text-sm font-light font-serif text-primary uppercase tracking-wider mb-8">
          Your Library
        </h3>
        
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start border-accent text-accent hover:bg-accent hover:text-accent-foreground h-auto py-4 px-6"
          >
            <Search className="w-4 h-4 mr-3 flex-shrink-0" />
            <div className="text-left">
              <div className="text-sm font-medium">Your Exact Matches</div>
              <div className="text-xs font-light opacity-80 mt-1">Items that match your inspiration</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-accent text-accent hover:bg-accent hover:text-accent-foreground h-auto py-4 px-6"
          >
            <Sparkles className="w-4 h-4 mr-3 flex-shrink-0" />
            <div className="text-left">
              <div className="text-sm font-medium">Items You Might Like</div>
              <div className="text-xs font-light opacity-80 mt-1">Pieces that fit your vibe</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-accent text-accent hover:bg-accent hover:text-accent-foreground h-auto py-4 px-6"
          >
            <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
            <div className="text-left">
              <div className="text-sm font-medium">Pro Thrifter Services</div>
              <div className="text-xs font-light opacity-80 mt-1">Get help from curators</div>
            </div>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-muted">
          <p className="text-xs font-light text-muted-foreground leading-relaxed">
            Upload your style inspiration to begin discovering curated secondhand pieces
          </p>
        </div>
      </div>
    </div>
  );
};