import { Search, Sparkles, Phone } from 'lucide-react';

export const LibrarySidebar = () => {
  return (
    <div className="w-full h-full bg-secondary/30 border-l border-muted p-8">
      <div className="sticky top-8 space-y-8">
        <h3 className="text-xs font-light text-primary uppercase tracking-widest mb-12 text-center opacity-60">
          Your Library
        </h3>
        
        <div className="space-y-8">
          {/* Exact Matches */}
          <div className="relative group cursor-pointer">
            <div className="py-6 border-b border-muted hover:border-burgundy transition-colors">
              <div className="flex items-start gap-3 px-4">
                <Search className="w-4 h-4 text-accent-foreground mt-1 flex-shrink-0" />
                <div className="text-left flex-1">
                  <div className="text-sm font-black text-primary uppercase tracking-wider leading-tight">Your Exact Matches</div>
                  <div className="text-xs font-light text-muted-foreground mt-2 leading-relaxed">Items that match your inspiration</div>
                </div>
              </div>
            </div>
          </div>

          {/* Items You Might Like */}
          <div className="relative group cursor-pointer">
            <div className="py-6 border-b border-muted hover:border-burgundy transition-colors">
              <div className="flex items-start gap-3 px-4">
                <Sparkles className="w-4 h-4 text-accent-foreground mt-1 flex-shrink-0" />
                <div className="text-left flex-1">
                  <div className="text-sm font-black text-primary uppercase tracking-wider leading-tight">Items You Might Like</div>
                  <div className="text-xs font-light text-muted-foreground mt-2 leading-relaxed">Pieces that fit your vibe</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Thrifter Services */}
          <div className="relative group cursor-pointer">
            <div className="py-6 border-b border-muted hover:border-burgundy transition-colors">
              <div className="flex items-start gap-3 px-4">
                <Phone className="w-4 h-4 text-accent-foreground mt-1 flex-shrink-0" />
                <div className="text-left flex-1">
                  <div className="text-sm font-black text-primary uppercase tracking-wider leading-tight">Pro Thrifter Services</div>
                  <div className="text-xs font-light text-muted-foreground mt-2 leading-relaxed">Get help from curators</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-muted">
          <p className="text-xs font-light text-muted-foreground leading-relaxed text-center">
            Upload your style inspiration to begin discovering curated secondhand pieces
          </p>
        </div>
      </div>
    </div>
  );
};