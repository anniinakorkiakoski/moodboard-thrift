import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
            <div className="aspect-[3/4] bg-muted/20 border border-border relative overflow-hidden">
              {/* Dress Form Mannequin SVG - inspired by tailor's dress form */}
              <svg viewBox="0 0 200 300" className="w-full h-full">
                {mannequinType === 'female' ? (
                  // Female dress form - curved silhouette
                  <>
                    {/* Neck/collar area */}
                    <path
                      d="M 85 45 Q 85 35, 100 35 Q 115 35, 115 45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground/30"
                    />
                    {/* Shoulders */}
                    <path
                      d="M 75 50 Q 75 48, 80 48 L 120 48 Q 125 48, 125 50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground/30"
                    />
                    {/* Left side - curved feminine silhouette */}
                    <path
                      d="M 75 50 Q 70 70, 68 85 Q 65 100, 68 120 Q 72 140, 78 155 L 85 175"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground/30"
                    />
                    {/* Right side - curved feminine silhouette */}
                    <path
                      d="M 125 50 Q 130 70, 132 85 Q 135 100, 132 120 Q 128 140, 122 155 L 115 175"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground/30"
                    />
                    {/* Bottom edge */}
                    <path
                      d="M 85 175 Q 90 178, 100 178 Q 110 178, 115 175"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground/30"
                    />
                    {/* Stand pole */}
                    <line
                      x1="100"
                      y1="178"
                      x2="100"
                      y2="260"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground/30"
                    />
                    {/* Stand base - oval */}
                    <ellipse
                      cx="100"
                      cy="265"
                      rx="30"
                      ry="8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground/30"
                    />
                  </>
                ) : (
                  // Male dress form - straighter silhouette
                  <>
                    {/* Neck/collar area */}
                    <path
                      d="M 85 45 Q 85 35, 100 35 Q 115 35, 115 45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground/30"
                    />
                    {/* Shoulders - broader */}
                    <path
                      d="M 70 50 Q 70 48, 75 48 L 125 48 Q 130 48, 130 50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground/30"
                    />
                    {/* Left side - straighter masculine silhouette */}
                    <path
                      d="M 70 50 Q 68 70, 70 90 Q 72 110, 75 130 Q 78 150, 82 170 L 88 175"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground/30"
                    />
                    {/* Right side - straighter masculine silhouette */}
                    <path
                      d="M 130 50 Q 132 70, 130 90 Q 128 110, 125 130 Q 122 150, 118 170 L 112 175"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground/30"
                    />
                    {/* Bottom edge */}
                    <path
                      d="M 88 175 Q 92 178, 100 178 Q 108 178, 112 175"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground/30"
                    />
                    {/* Stand pole */}
                    <line
                      x1="100"
                      y1="178"
                      x2="100"
                      y2="260"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground/30"
                    />
                    {/* Stand base - oval */}
                    <ellipse
                      cx="100"
                      cy="265"
                      rx="30"
                      ry="8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-foreground/30"
                    />
                  </>
                )}
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