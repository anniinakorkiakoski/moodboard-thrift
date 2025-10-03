import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

export const ThrifterTerms = () => {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleAccept = async () => {
    if (!agreed) {
      toast({
        title: "Agreement Required",
        description: "You must agree to the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Insert thrifter role with terms acceptance
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'thrifter',
          terms_accepted_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Welcome, Thrifter!",
        description: "You can now start offering your thrifting services."
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif font-light text-primary">CURA Thrifter Agreement</h1>
          <p className="text-muted-foreground">Please review and accept our terms to continue</p>
        </div>

        <Card className="p-6 md:p-8 space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-primary">Platform Rules & Responsibilities</h2>
            <div className="prose prose-sm max-w-none space-y-4 text-foreground">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">1. Trustworthiness & Authenticity</h3>
                <p>As a CURA Thrifter, you promise to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Source authentic, accurately described items</li>
                  <li>Provide honest condition assessments and measurements</li>
                  <li>Communicate transparently with customers about timelines and availability</li>
                  <li>Handle customer funds and purchases with integrity</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">2. Commission Structure</h3>
                <p>CURA operates on a transparent commission model:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>You charge customers: <strong>Item Cost + Your Commission (typically 10%)</strong></li>
                  <li>CURA platform fee: <strong>5% of your total commission</strong></li>
                  <li>Example: Item costs $100, you add $10 commission → CURA receives $0.50 (5% of $10)</li>
                  <li>Payments must be processed through CURA's payment system</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">3. Payment & Legal Compliance</h3>
                <p className="font-semibold text-destructive">CRITICAL REQUIREMENT:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>CURA's 5% platform fee MUST be paid for each completed transaction</li>
                  <li>Non-payment of platform fees constitutes breach of contract</li>
                  <li>Violations may result in account suspension and legal action</li>
                  <li>All transactions must go through official CURA payment channels</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">4. Code of Conduct</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Respond to customer inquiries within 24 hours</li>
                  <li>Complete agreed-upon thrifting assignments within stated timeframes</li>
                  <li>Maintain professional communication at all times</li>
                  <li>Report any issues or disputes promptly to CURA support</li>
                  <li>Refrain from conducting transactions outside the CURA platform</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">5. Consequences of Violations</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>First violation: Warning and account review</li>
                  <li>Repeated violations: Account suspension</li>
                  <li>Fraud or non-payment: Account termination and legal action</li>
                  <li>CURA reserves the right to pursue all unpaid fees through legal means</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm leading-relaxed cursor-pointer"
            >
              I have read and agree to all terms and conditions outlined above. I understand that I am responsible for maintaining trustworthiness, paying the 5% platform fee on all commissions, and that violations may result in legal action and account termination.
            </label>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/auth')}
              className="flex-1"
            >
              Decline & Go Back
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!agreed || loading}
              className="flex-1 bg-burgundy hover:bg-burgundy/90"
            >
              {loading ? "Processing..." : "Accept & Continue"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
