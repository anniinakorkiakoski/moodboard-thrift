import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SourceLogo } from './SourceLogo';

const allPlatforms = [
  'Vinted',
  'Depop',
  'Vestiaire Collective',
  'The RealReal',
  'Bought',
  'thredUP',
  'eBay',
  'Facebook Marketplace',
  'Shpock',
  'Grailed',
  'Poshmark',
  'ASOS Marketplace',
  'Hardly Ever Worn It',
  'Marrkt',
  'True Vintage',
  'FINDS',
  'Zalando Pre-Owned',
  'Etsy',
  'Tise',
  'Selpy',
  'Emmy'
];

interface AllPlatformsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AllPlatformsDialog = ({ open, onOpenChange }: AllPlatformsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-primary uppercase tracking-[0.2em]">
            All Platforms
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {allPlatforms.map((platform) => (
            <div 
              key={platform}
              className="group flex items-center justify-center p-6 bg-background border-2 border-foreground/20 hover:border-foreground transition-all duration-300 hover:scale-105"
            >
              <div className="text-foreground">
                <SourceLogo name={platform} />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
