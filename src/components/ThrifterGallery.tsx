import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ThrifterProfileDialog } from './ThrifterProfileDialog';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Thrifter {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  rating: number;
  total_orders: number;
  specialties: string[];
  style_tags?: string[];
  match_score?: number;
}

interface ThrifterGalleryProps {
  userStyleTags: string[];
  userId: string;
}

export const ThrifterGallery = ({ userStyleTags, userId }: ThrifterGalleryProps) => {
  const [thrifters, setThrifters] = useState<Thrifter[]>([]);
  const [selectedThrifter, setSelectedThrifter] = useState<Thrifter | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMatchedThrifters();
  }, [userStyleTags]);

  const fetchMatchedThrifters = async () => {
    try {
      // Fetch all verified thrifters
      const { data: thriftersData, error } = await supabase
        .from('thrifters')
        .select('*')
        .eq('is_verified', true)
        .order('rating', { ascending: false });

      if (error) throw error;

      // Calculate match scores based on overlapping specialties with user's style tags
      const thriftersWithScores = thriftersData?.map((thrifter: any) => {
        const thrifterTags = thrifter.specialties || [];
        const matchingTags = userStyleTags.filter(tag => 
          thrifterTags.includes(tag)
        );
        const matchScore = userStyleTags.length > 0 
          ? (matchingTags.length / userStyleTags.length) * 100 
          : 0;

        return {
          ...thrifter,
          style_tags: thrifterTags,
          match_score: matchScore,
        };
      }) || [];

      // Map known display names to local trendy office portraits (cache-busted)
      const nameToFile: Record<string, string> = {
        'Maya Chen': '/thrifters/maya-chen.jpg',
        'Alex Rivers': '/thrifters/alex-rivers.jpg',
        'Jordan Blake': '/thrifters/jordan-blake.jpg',
        'Sam Morrison': '/thrifters/sam-morrison.jpg',
        'Riley Park': '/thrifters/riley-park.jpg',
        'Casey Taylor': '/thrifters/casey-taylor.jpg',
        'Drew Martinez': '/thrifters/drew-martinez.jpg',
        'Avery Kim': '/thrifters/avery-kim.jpg',
        'Morgan Lee': '/thrifters/morgan-lee.jpg',
        'Sage Williams': '/thrifters/sage-williams.jpg',
      };

      const withLocalAvatars = thriftersWithScores.map((t) => ({
        ...t,
        avatar_url: nameToFile[t.display_name]
          ? `${nameToFile[t.display_name]}?v=5`
          : t.avatar_url,
      }));

      setThrifters(withLocalAvatars);
    } catch (error) {
      console.error('Error fetching thrifters:', error);
      toast({
        title: "Error",
        description: "Failed to load stylists. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-sm font-light text-foreground/60 font-lora">Loading stylists...</p>
      </div>
    );
  }

  if (thrifters.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-sm font-light text-foreground/60 font-lora">
          No stylists available at the moment. Check back soon!
        </p>
      </div>
    );
  }

  // Gallery layout with varying sizes for depth
  const getGridClass = (index: number) => {
    const pattern = index % 6;
    switch (pattern) {
      case 0:
      case 3:
        return "col-span-2 row-span-2"; // Large
      case 1:
      case 4:
        return "col-span-1 row-span-2"; // Tall
      case 2:
      case 5:
        return "col-span-1 row-span-1"; // Small
      default:
        return "col-span-1 row-span-1";
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px]">
        {thrifters.map((thrifter, index) => (
          <div
            key={thrifter.id}
            className={`${getGridClass(index)} relative group cursor-pointer overflow-hidden hover-scale`}
            onClick={() => setSelectedThrifter(thrifter)}
          >
            <div className="w-full h-full bg-muted relative">
              {thrifter.avatar_url ? (
                <img
                  src={thrifter.avatar_url}
                  alt={thrifter.display_name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <span className="text-4xl font-light text-primary/40">
                    {thrifter.display_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              {/* Overlay with info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white text-sm font-medium mb-1">{thrifter.display_name}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-xs">{thrifter.rating.toFixed(1)}</span>
                </div>
                {thrifter.match_score && thrifter.match_score > 0 && (
                  <span className="text-xs text-accent mt-1">
                    {Math.round(thrifter.match_score)}% match
                  </span>
                )}
              </div>
            </div>
            
            {/* Bottom info (always visible) */}
            <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm p-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <p className="text-xs font-medium text-foreground truncate">{thrifter.display_name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-foreground/70">{thrifter.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedThrifter && (
        <ThrifterProfileDialog
          thrifter={selectedThrifter}
          open={!!selectedThrifter}
          onOpenChange={(open) => !open && setSelectedThrifter(null)}
          userId={userId}
        />
      )}
    </>
  );
};