import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMeasurements } from '@/hooks/useMeasurements';
import { Ruler } from 'lucide-react';
import mannequinsImage from '@/assets/mannequins.webp';

const MEASUREMENT_POINTS = [
  { id: 'neck_circumference', label: 'Neck', position: { top: '15%', left: '50%' } },
  { id: 'shoulder_width', label: 'Shoulders', position: { top: '18%', left: '50%' } },
  { id: 'chest_circumference', label: 'Chest', position: { top: '28%', left: '50%' } },
  { id: 'waist_circumference', label: 'Waist', position: { top: '42%', left: '50%' } },
  { id: 'hip_circumference', label: 'Hips', position: { top: '52%', left: '50%' } },
  { id: 'arm_length', label: 'Arm Length', position: { top: '35%', left: '20%' } },
  { id: 'bicep_circumference', label: 'Bicep', position: { top: '30%', left: '25%' } },
  { id: 'torso_length', label: 'Torso', position: { top: '35%', left: '50%' } },
  { id: 'inseam_length', label: 'Inseam', position: { top: '70%', left: '50%' } },
  { id: 'thigh_circumference', label: 'Thigh', position: { top: '60%', left: '50%' } },
];

export const MeasurementsSection = () => {
  const { measurements, loading, saving, updateMeasurements } = useMeasurements();
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [localMeasurements, setLocalMeasurements] = useState<Record<string, number>>({});
  const [mannequinType, setMannequinType] = useState<'male' | 'female'>('female');

  useEffect(() => {
    if (measurements) {
      setLocalMeasurements(measurements as Record<string, number>);
    }
  }, [measurements]);

  const handleInputChange = (id: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setLocalMeasurements(prev => ({ ...prev, [id]: numValue }));
    } else if (value === '') {
      setLocalMeasurements(prev => {
        const newMeasurements = { ...prev };
        delete newMeasurements[id];
        return newMeasurements;
      });
    }
  };

  const handleSave = () => {
    updateMeasurements(localMeasurements);
  };

  if (loading) {
    return <div className="text-center py-8 text-sm font-mono">Loading measurements...</div>;
  }

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="text-xs font-bold text-burgundy uppercase tracking-[0.3em]">
          Your Measurements
        </div>
        <div className="w-16 h-px bg-burgundy/40 mx-auto"></div>
        <p className="text-sm font-light text-foreground/60 font-mono max-w-xl mx-auto">
          Click on the mannequin or enter your measurements below for personalized fit recommendations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Visual Mannequin */}
        <div className="space-y-6">
          {/* Mannequin Type Selector */}
          <div className="flex items-center justify-center gap-6 pb-4">
            <Label className="text-xs font-mono uppercase tracking-wide">Mannequin Type:</Label>
            <RadioGroup
              value={mannequinType}
              onValueChange={(value) => setMannequinType(value as 'male' | 'female')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="text-sm font-mono cursor-pointer">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="text-sm font-mono cursor-pointer">Male</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="relative">
            <div className="aspect-[2/3] bg-muted/20 border border-border relative overflow-hidden flex items-center justify-center">
              {/* Mannequin Image with crop based on selection */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={mannequinsImage}
                  alt={`${mannequinType} mannequin`}
                  className="h-full object-contain"
                  style={{
                    objectPosition: mannequinType === 'male' ? '35% center' : '65% center',
                    transform: mannequinType === 'male' ? 'scale(2.5) translateX(10%)' : 'scale(2.5) translateX(-10%)'
                  }}
                />
              </div>

              {/* Measurement Points */}
              {MEASUREMENT_POINTS.map((point) => (
                <button
                  key={point.id}
                  onClick={() => setSelectedPoint(point.id)}
                  style={{ top: point.position.top, left: point.position.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedPoint === point.id
                      ? 'bg-burgundy border-burgundy text-white scale-125'
                      : 'bg-white border-burgundy text-burgundy hover:scale-110'
                  }`}
                >
                  <Ruler className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Measurement Inputs */}
        <div className="space-y-6">
          <div className="grid gap-4">
            {MEASUREMENT_POINTS.map((point) => (
              <div
                key={point.id}
                className={`p-4 border transition-all ${
                  selectedPoint === point.id
                    ? 'border-burgundy bg-burgundy/5'
                    : 'border-border'
                }`}
              >
                <Label htmlFor={point.id} className="text-xs font-mono uppercase tracking-wide mb-2 block">
                  {point.label}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={point.id}
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                    value={localMeasurements[point.id] || ''}
                    onChange={(e) => handleInputChange(point.id, e.target.value)}
                    className="h-10 text-sm font-mono"
                    onFocus={() => setSelectedPoint(point.id)}
                  />
                  <span className="flex items-center text-sm font-mono text-foreground/60 w-12">
                    {measurements?.unit_preference || 'cm'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-foreground/50 font-mono space-y-1 p-4 bg-muted/20 border border-border">
            <p className="font-bold">Fit recommendations:</p>
            <p>• Items matching your exact size will be prioritized</p>
            <p>• Alternative sizes with similar measurements will be shown</p>
            <p>• Oversized or adjustable items will be suggested with fit notes</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-8">
        <Button
          onClick={handleSave}
          variant="cta"
          size="xl"
          className="uppercase tracking-wider font-mono"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Measurements"}
        </Button>
      </div>
    </div>
  );
};