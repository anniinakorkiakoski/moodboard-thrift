import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useMeasurements } from '@/hooks/useMeasurements';
import { Ruler } from 'lucide-react';

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
        <div className="relative">
          <div className="aspect-[3/4] bg-muted/20 border border-border relative overflow-hidden">
            {/* Simple Mannequin SVG */}
            <svg viewBox="0 0 200 300" className="w-full h-full">
              {/* Head */}
              <circle cx="100" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/30" />
              
              {/* Neck */}
              <line x1="100" y1="48" x2="100" y2="58" stroke="currentColor" strokeWidth="2" className="text-foreground/30" />
              
              {/* Shoulders */}
              <line x1="65" y1="58" x2="135" y2="58" stroke="currentColor" strokeWidth="2" className="text-foreground/30" />
              
              {/* Torso */}
              <line x1="100" y1="58" x2="100" y2="160" stroke="currentColor" strokeWidth="2" className="text-foreground/30" />
              <ellipse cx="100" cy="85" rx="28" ry="20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/30" />
              <ellipse cx="100" cy="125" rx="25" ry="18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/30" />
              <ellipse cx="100" cy="155" rx="28" ry="15" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/30" />
              
              {/* Arms */}
              <line x1="65" y1="58" x2="45" y2="135" stroke="currentColor" strokeWidth="2" className="text-foreground/30" />
              <line x1="135" y1="58" x2="155" y2="135" stroke="currentColor" strokeWidth="2" className="text-foreground/30" />
              
              {/* Legs */}
              <line x1="85" y1="160" x2="80" y2="260" stroke="currentColor" strokeWidth="2" className="text-foreground/30" />
              <line x1="115" y1="160" x2="120" y2="260" stroke="currentColor" strokeWidth="2" className="text-foreground/30" />
            </svg>

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