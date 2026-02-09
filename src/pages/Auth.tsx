import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [userRole, setUserRole] = useState<'customer' | 'thrifter'>('customer');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`
        });
        
        if (error) throw error;
        
        toast({
          title: "Password Reset Email Sent",
          description: "Check your email for a password reset link."
        });
        
        setIsForgotPassword(false);
      } else if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        
        if (error) throw error;
        
        if (data.user && userRole === 'thrifter') {
          // Thrifters need to accept terms — role will be created on the terms page
          toast({
            title: "Account Created",
            description: "Please review and accept our thrifter terms."
          });
          navigate('/thrifter-terms');
          return;
        }
        // For customers, the database trigger auto-creates the role on signup
        
        toast({
          title: "Account Created — Check Your Email! 📧",
          description: "We've sent a confirmation link to your email. Please check your inbox (and spam folder) and click the link to activate your account before signing in.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          localStorage.setItem('sessionExpiry', expiryDate.toISOString());
        } else {
          localStorage.setItem('rememberMe', 'false');
          const expiryDate = new Date();
          expiryDate.setHours(expiryDate.getHours() + 24);
          localStorage.setItem('sessionExpiry', expiryDate.toISOString());
        }
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in."
        });
        
        navigate('/');
      }
    } catch (error: any) {
      const message = error.message?.includes('security purposes')
        ? "Please wait a moment before trying again. If you already signed up, check your email for the confirmation link."
        : error.message;
      toast({
        title: "Authentication Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-light text-primary mb-2">CURA</h1>
          <p className="text-muted-foreground">
            {isForgotPassword ? 'Reset your password' : isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && !isForgotPassword && (
              <div className="space-y-3">
                <Label className="text-base font-medium">I want to join as a:</Label>
                <RadioGroup value={userRole} onValueChange={(value) => setUserRole(value as 'customer' | 'thrifter')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="customer" />
                    <Label htmlFor="customer" className="font-normal cursor-pointer">
                      Customer - I want to find unique thrifted items
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="thrifter" id="thrifter" />
                    <Label htmlFor="thrifter" className="font-normal cursor-pointer">
                      Thrifter - I want to help others find great items
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            {!isForgotPassword && (
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                  minLength={6}
                />
              </div>
            )}

            {!isSignUp && !isForgotPassword && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm font-normal cursor-pointer text-muted-foreground"
                >
                  Remember me for 30 days
                </Label>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-burgundy hover:bg-burgundy/90 text-burgundy-foreground"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              {isForgotPassword ? 'Send Reset Email' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(!isForgotPassword);
                setIsSignUp(false);
              }}
              className="text-sm text-muted-foreground hover:text-primary block w-full"
            >
              {isForgotPassword ? 'Back to sign in' : 'Forgot password?'}
            </button>
            
            {!isForgotPassword && (
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-primary block w-full"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};