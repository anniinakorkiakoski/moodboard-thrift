import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AutocompleteInput } from '@/components/AutocompleteInput';
import { useStyleProfile } from '@/hooks/useStyleProfile';
import { useMeasurements } from '@/hooks/useMeasurements';
import { useToast } from '@/hooks/use-toast';
import demoProfilePic from '@/assets/demo-profile-pic.png';

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

const MATERIALS = [
  'Cotton', 'Linen', 'Silk', 'Wool', 'Cashmere', 'Denim',
  'Leather', 'Suede', 'Velvet', 'Satin', 'Chiffon', 'Tweed'
];

const MEASUREMENT_FIELDS = [
  { key: 'hip_circumference', label: 'Hip' },
  { key: 'waist_circumference', label: 'Waist' },
  { key: 'inseam_length', label: 'Inseam' },
  { key: 'neck_circumference', label: 'Head Circumference' },
  { key: 'shoulder_width', label: 'Shoe Size' },
  { key: 'chest_circumference', label: 'Cup Size' }
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
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
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
      setSelectedMaterials(profile.material_preferences || []);
    }
  }, [profile]);

  useEffect(() => {
    if (measurements) {
      setLocalMeasurements(measurements);
    }
  }, [measurements]);

  const handleSave = async () => {
    await Promise.all([
      updateProfile({ 
        style_tags: selectedStyles, 
        dream_brands: selectedBrands,
        material_preferences: selectedMaterials 
      }),
      updateMeasurements(localMeasurements)
    ]);
  };

  const addStyle = (style: string) => {
    if (!selectedStyles.includes(style)) {
      setSelectedStyles(prev => [...prev, style]);
    }
  };

  const removeStyle = (style: string) => {
    setSelectedStyles(prev => prev.filter(s => s !== style));
  };

  const addBrand = (brand: string) => {
    if (!selectedBrands.includes(brand)) {
      setSelectedBrands(prev => [...prev, brand]);
    }
  };

  const removeBrand = (brand: string) => {
    setSelectedBrands(prev => prev.filter(b => b !== brand));
  };

  const addMaterial = (material: string) => {
    if (!selectedMaterials.includes(material)) {
      setSelectedMaterials(prev => [...prev, material]);
    }
  };

  const removeMaterial = (material: string) => {
    setSelectedMaterials(prev => prev.filter(m => m !== material));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1EB' }}>
      <Navigation />
      
      <div className="container mx-auto px-6 py-16 max-w-6xl pt-32">
        <div className="border border-foreground/20 bg-white p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-2xl tracking-[0.3em] text-foreground uppercase font-light">
              STYLE BIOGRAPHY
            </h1>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2 block font-mono">Name:</label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="font-mono text-sm border-b border-t-0 border-l-0 border-r-0 rounded-none px-0"
                />
              </div>
              
              <div>
                <label className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2 block font-mono">Location:</label>
                <Input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  className="font-mono text-sm border-b border-t-0 border-l-0 border-r-0 rounded-none px-0"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2 block font-mono">Cura Status:</label>
                <Input 
                  value="Active"
                  disabled
                  className="font-mono text-sm border-b border-t-0 border-l-0 border-r-0 rounded-none px-0"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2 block font-mono"># of Curated Items:</label>
                <Input 
                  value="0"
                  disabled
                  className="font-mono text-sm border-b border-t-0 border-l-0 border-r-0 rounded-none px-0"
                />
              </div>

              <AutocompleteInput
                label="Style Description:"
                suggestions={STYLE_TAGS}
                selectedItems={selectedStyles}
                onItemAdd={addStyle}
                onItemRemove={removeStyle}
                placeholder="Start typing..."
              />

              <AutocompleteInput
                label="Dream Brands:"
                suggestions={DREAM_BRANDS}
                selectedItems={selectedBrands}
                onItemAdd={addBrand}
                onItemRemove={removeBrand}
                placeholder="Start typing..."
              />
            </div>

            {/* Center Divider */}
            <div className="w-px bg-foreground/20" />

            {/* Right Column */}
            <div className="space-y-8">
              {/* Profile Picture */}
              <div className="flex justify-center mb-6">
                <div className="w-48 h-48 border border-foreground/20 bg-background flex items-center justify-center overflow-hidden">
                  <img 
                    src={demoProfilePic} 
                    alt="Profile" 
                    className="w-full h-full object-contain p-4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {MEASUREMENT_FIELDS.map(field => (
                  <div key={field.key}>
                    <label className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2 block font-mono">{field.label}:</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={localMeasurements?.[field.key] || ''}
                      onChange={(e) => setLocalMeasurements((prev: any) => ({
                        ...prev,
                        [field.key]: e.target.value ? parseFloat(e.target.value) : null
                      }))}
                      className="font-mono text-sm border-b border-t-0 border-l-0 border-r-0 rounded-none px-0"
                      placeholder="0.0"
                    />
                  </div>
                ))}
              </div>

              <AutocompleteInput
                label="Material Preferences:"
                suggestions={MATERIALS}
                selectedItems={selectedMaterials}
                onItemAdd={addMaterial}
                onItemRemove={removeMaterial}
                placeholder="Start typing..."
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-8 mt-8 border-t border-foreground/10">
            <Button onClick={handleSave} className="px-8">
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
