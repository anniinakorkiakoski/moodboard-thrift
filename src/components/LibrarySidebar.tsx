import { Search, Sparkles, Phone } from 'lucide-react';

export const LibrarySidebar = () => {
  return (
    <div className="w-full h-full bg-secondary/30 border-l border-muted p-8">
      <div className="sticky top-8 space-y-8">
        <h3 className="text-xs font-light text-primary uppercase tracking-widest mb-12 text-center opacity-60">
          Your Library
        </h3>
        
        <div className="space-y-6">
          {/* Exact Matches */}
          <div className="relative group cursor-pointer">
            <div className="flex items-center w-full">
              <div className="h-20 bg-accent-foreground flex-shrink-0 w-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-15">
                  <svg className="w-full h-full" viewBox="0 0 80 80" preserveAspectRatio="none">
                    <path d="M0,55 C10,50 20,45 30,48 C40,51 50,45 60,48 C70,51 75,48 80,46" 
                          stroke="hsl(330 60% 75%)" strokeWidth="0.8" fill="none" opacity="0.7"/>
                    <path d="M0,65 C12,62 24,58 36,61 C48,64 60,58 72,61 C76,62 78,61 80,60" 
                          stroke="hsl(330 60% 75%)" strokeWidth="0.6" fill="none" opacity="0.6"/>
                  </svg>
                </div>
              </div>
              
              <div className="flex-1 bg-transparent px-6 py-6">
                <div className="flex items-start gap-3">
                  <Search className="w-3.5 h-3.5 text-accent-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <div className="text-xs font-light text-primary uppercase tracking-wider">Your Exact Matches</div>
                    <div className="text-[10px] font-light text-muted-foreground mt-1.5 leading-relaxed">Items that match your inspiration</div>
                  </div>
                </div>
              </div>
              
              <div className="h-20 bg-accent-foreground flex-shrink-0 w-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-15" style={{ transform: 'scaleX(-1)' }}>
                  <svg className="w-full h-full" viewBox="0 0 80 80" preserveAspectRatio="none">
                    <path d="M0,55 C10,50 20,45 30,48 C40,51 50,45 60,48 C70,51 75,48 80,46" 
                          stroke="hsl(330 60% 75%)" strokeWidth="0.8" fill="none" opacity="0.7"/>
                    <path d="M0,65 C12,62 24,58 36,61 C48,64 60,58 72,61 C76,62 78,61 80,60" 
                          stroke="hsl(330 60% 75%)" strokeWidth="0.6" fill="none" opacity="0.6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Items You Might Like */}
          <div className="relative group cursor-pointer">
            <div className="flex items-center w-full">
              <div className="h-20 bg-accent-foreground flex-shrink-0 w-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-15">
                  <svg className="w-full h-full" viewBox="0 0 80 80" preserveAspectRatio="none">
                    <path d="M0,55 C10,50 20,45 30,48 C40,51 50,45 60,48 C70,51 75,48 80,46" 
                          stroke="hsl(330 60% 75%)" strokeWidth="0.8" fill="none" opacity="0.7"/>
                    <path d="M0,65 C12,62 24,58 36,61 C48,64 60,58 72,61 C76,62 78,61 80,60" 
                          stroke="hsl(330 60% 75%)" strokeWidth="0.6" fill="none" opacity="0.6"/>
                  </svg>
                </div>
              </div>
              
              <div className="flex-1 bg-transparent px-6 py-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-3.5 h-3.5 text-accent-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <div className="text-xs font-light text-primary uppercase tracking-wider">Items You Might Like</div>
                    <div className="text-[10px] font-light text-muted-foreground mt-1.5 leading-relaxed">Pieces that fit your vibe</div>
                  </div>
                </div>
              </div>
              
              <div className="h-20 bg-accent-foreground flex-shrink-0 w-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-15" style={{ transform: 'scaleX(-1)' }}>
                  <svg className="w-full h-full" viewBox="0 0 80 80" preserveAspectRatio="none">
                    <path d="M0,55 C10,50 20,45 30,48 C40,51 50,45 60,48 C70,51 75,48 80,46" 
                          stroke="hsl(330 60% 75%)" strokeWidth="0.8" fill="none" opacity="0.7"/>
                    <path d="M0,65 C12,62 24,58 36,61 C48,64 60,58 72,61 C76,62 78,61 80,60" 
                          stroke="hsl(330 60% 75%)" strokeWidth="0.6" fill="none" opacity="0.6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Thrifter Services */}
          <div className="relative group cursor-pointer">
            <div className="flex items-center w-full">
              <div className="h-20 bg-accent-foreground flex-shrink-0 w-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-15">
                  <svg className="w-full h-full" viewBox="0 0 80 80" preserveAspectRatio="none">
                    <path d="M0,55 C10,50 20,45 30,48 C40,51 50,45 60,48 C70,51 75,48 80,46" 
                          stroke="hsl(330 60% 75%)" strokeWidth="0.8" fill="none" opacity="0.7"/>
                    <path d="M0,65 C12,62 24,58 36,61 C48,64 60,58 72,61 C76,62 78,61 80,60" 
                          stroke="hsl(330 60% 75%)" strokeWidth="0.6" fill="none" opacity="0.6"/>
                  </svg>
                </div>
              </div>
              
              <div className="flex-1 bg-transparent px-6 py-6">
                <div className="flex items-start gap-3">
                  <Phone className="w-3.5 h-3.5 text-accent-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <div className="text-xs font-light text-primary uppercase tracking-wider">Pro Thrifter Services</div>
                    <div className="text-[10px] font-light text-muted-foreground mt-1.5 leading-relaxed">Get help from curators</div>
                  </div>
                </div>
              </div>
              
              <div className="h-20 bg-accent-foreground flex-shrink-0 w-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-15" style={{ transform: 'scaleX(-1)' }}>
                  <svg className="w-full h-full" viewBox="0 0 80 80" preserveAspectRatio="none">
                    <path d="M0,55 C10,50 20,45 30,48 C40,51 50,45 60,48 C70,51 75,48 80,46" 
                          stroke="hsl(330 60% 75%)" strokeWidth="0.8" fill="none" opacity="0.7"/>
                    <path d="M0,65 C12,62 24,58 36,61 C48,64 60,58 72,61 C76,62 78,61 80,60" 
                          stroke="hsl(330 60% 75%)" strokeWidth="0.6" fill="none" opacity="0.6"/>
                  </svg>
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