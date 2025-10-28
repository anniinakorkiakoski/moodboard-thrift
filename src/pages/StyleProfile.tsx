import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useStyleProfile } from '@/hooks/useStyleProfile';
import { useMeasurements } from '@/hooks/useMeasurements';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

const STYLE_TAGS = [
  'Minimalist', 'Streetwear', 'Vintage', 'Bohemian', 'Classic', 'Avant-Garde',
  'Preppy', 'Grunge', 'Romantic', 'Sporty', 'Gothic', 'Cottagecore',
  'Y2K', 'Normcore', 'Techwear', 'Academia', 'Coastal', 'Maximalist'
];

const DREAM_BRANDS = [
  'Prada', 'Gucci', 'Dior', 'Chanel', 'Saint Laurent', 'Balenciaga',
  'Versace', 'Valentino', 'Givenchy', 'Bottega Veneta', 'Loewe', 'Celine',
  'The Row', 'Margiela', 'Rick Owens', 'Acne Studios', 'Comme des Garçons'
];

const MEASUREMENT_FIELDS = [
  { key: 'neck_circumference', label: 'Neck' },
  { key: 'shoulder_width', label: 'Shoulder Width' },
  { key: 'chest_circumference', label: 'Chest' },
  { key: 'waist_circumference', label: 'Waist' },
  { key: 'hip_circumference', label: 'Hip' },
  { key: 'arm_length', label: 'Arm Length' },
  { key: 'bicep_circumference', label: 'Bicep' },
  { key: 'torso_length', label: 'Torso Length' },
  { key: 'inseam_length', label: 'Inseam' },
  { key: 'thigh_circumference', label: 'Thigh' }
];

export const StyleProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { profile, updateProfile } = useStyleProfile();
  const { measurements, updateMeasurements } = useMeasurements();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [localMeasurements, setLocalMeasurements] = useState<any>({});

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      } else {
        setUser(user);
        setName(user.email?.split('@')[0] || '');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (profile) {
      setSelectedStyles(profile.style_tags || []);
      setSelectedBrands(profile.dream_brands || []);
    }
  }, [profile]);

  useEffect(() => {
    if (measurements) {
      setLocalMeasurements(measurements);
    }
  }, [measurements]);

  const handleSave = async () => {
    await Promise.all([
      updateProfile({ style_tags: selectedStyles, dream_brands: selectedBrands }),
      updateMeasurements(localMeasurements)
    ]);
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1EB' }}>
      <Navigation />
      
      <div className="container mx-auto px-6 py-16 max-w-5xl pt-32">
        <div className="border border-foreground/20 bg-white p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-2xl tracking-[0.3em] text-foreground uppercase font-light">
              STYLE BIOGRAPHY
            </h1>
          </div>

          {/* Form Grid */}
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2 block">Name</label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2 block">Location</label>
                <Input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  className="font-mono text-sm"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Style Description */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2 block">Style Description</label>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="min-h-[100px] w-full rounded-md border border-input bg-background p-3 text-sm cursor-pointer hover:bg-accent/50 transition-colors">
                    {selectedStyles.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedStyles.map(style => (
                          <span key={style} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-foreground/10 text-xs font-mono">
                            {style}
                            <button onClick={(e) => { e.stopPropagation(); toggleStyle(style); }}>
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Click to select style tags...</span>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-96">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-wider text-foreground/60">Select Style Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {STYLE_TAGS.map(style => (
                        <button
                          key={style}
                          onClick={() => toggleStyle(style)}
                          className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                            selectedStyles.includes(style)
                              ? 'bg-foreground text-background'
                              : 'bg-foreground/10 hover:bg-foreground/20'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Dream Brands */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2 block">Dream Brands</label>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="min-h-[100px] w-full rounded-md border border-input bg-background p-3 text-sm cursor-pointer hover:bg-accent/50 transition-colors">
                    {selectedBrands.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedBrands.map(brand => (
                          <span key={brand} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-foreground/10 text-xs font-mono">
                            {brand}
                            <button onClick={(e) => { e.stopPropagation(); toggleBrand(brand); }}>
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Click to select dream brands...</span>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-96">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-wider text-foreground/60">Select Dream Brands</p>
                    <div className="flex flex-wrap gap-2">
                      {DREAM_BRANDS.map(brand => (
                        <button
                          key={brand}
                          onClick={() => toggleBrand(brand)}
                          className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                            selectedBrands.includes(brand)
                              ? 'bg-foreground text-background'
                              : 'bg-foreground/10 hover:bg-foreground/20'
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Body Measurements */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-foreground/60 mb-4 block">Body Measurements ({localMeasurements?.unit_preference || 'cm'})</label>
              <div className="grid grid-cols-2 gap-4">
                {MEASUREMENT_FIELDS.map(field => (
                  <div key={field.key}>
                    <label className="text-xs text-foreground/70 mb-1 block">{field.label}</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={localMeasurements?.[field.key] || ''}
                      onChange={(e) => setLocalMeasurements((prev: any) => ({
                        ...prev,
                        [field.key]: e.target.value ? parseFloat(e.target.value) : null
                      }))}
                      className="font-mono text-sm"
                      placeholder="0.0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Member Info (Read-only) */}
            <div className="pt-6 border-t border-foreground/10">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-foreground/60 uppercase tracking-wider">Member Since:</span>
                  <span className="ml-2 font-mono">
                    {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-foreground/60 uppercase tracking-wider">Contact:</span>
                  <span className="ml-2 font-mono text-foreground/70">{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} className="px-8">
                Save Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
