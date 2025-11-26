import { Button } from './ui/button';
import { Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VisualSearchNoResultsProps {
  attributes?: any;
  imageUrl: string;
  suggestions?: string[];
  searchQuery?: string;
}

export const VisualSearchNoResults = ({ attributes, imageUrl, suggestions, searchQuery }: VisualSearchNoResultsProps) => {
  const navigate = useNavigate();

  const handleHireThrifter = () => {
    navigate('/connect', {
      state: {
        prefillImage: imageUrl,
        prefillAttributes: attributes,
      },
    });
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-8 p-8">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-burgundy/10 flex items-center justify-center">
          <Users className="w-10 h-10 text-burgundy" />
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-primary uppercase tracking-[0.2em]">
            No Curated Matches Found
          </h2>
          
          <div className="w-16 h-px bg-primary/40 mx-auto" />

          <p className="text-base text-foreground/70 leading-loose font-lora max-w-lg mx-auto">
            We couldn't find validated matches from secondhand marketplaces. This could be because:
            the items were removed, prices seemed unrealistic, or current inventory doesn't match your search.
          </p>

          {searchQuery && (
            <div className="bg-muted/20 rounded-lg p-3 max-w-md mx-auto">
              <p className="text-xs font-medium text-primary/70 mb-1">Try searching manually:</p>
              <code className="text-sm text-foreground/90 bg-background/50 px-3 py-1 rounded">
                {searchQuery}
              </code>
            </div>
          )}

          {suggestions && suggestions.length > 0 && (
            <div className="bg-accent/10 rounded-lg p-4 max-w-md mx-auto text-left">
              <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">
                Suggestions:
              </p>
              <ul className="space-y-2 text-sm text-foreground/70">
                {suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-burgundy mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {attributes && (
            <div className="bg-muted/30 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
                What we're looking for:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {attributes.fabricType && (
                  <span className="text-xs bg-burgundy/10 text-burgundy px-2 py-1 rounded">
                    {attributes.fabricType}
                  </span>
                )}
                {attributes.primaryColors?.map((color: string, i: number) => (
                  <span key={i} className="text-xs bg-burgundy/10 text-burgundy px-2 py-1 rounded">
                    {color}
                  </span>
                ))}
                {attributes.silhouette && (
                  <span className="text-xs bg-burgundy/10 text-burgundy px-2 py-1 rounded">
                    {attributes.silhouette}
                  </span>
                )}
                {attributes.aesthetic && (
                  <span className="text-xs bg-burgundy/10 text-burgundy px-2 py-1 rounded">
                    {attributes.aesthetic}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Button
            size="lg"
            onClick={handleHireThrifter}
            className="bg-burgundy text-burgundy-foreground hover:bg-burgundy/90 text-base px-8 h-12"
          >
            <Users className="w-5 h-5 mr-2" />
            Hire a Pro Thrifter
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-xs text-muted-foreground font-lora">
            Post your request to verified thrifters who can find and ship this piece to you
          </p>
        </div>
      </div>
    </div>
  );
};
