
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback initiated");
        
        // Get the auth parameters from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error');
        
        if (error) {
          console.error('Auth error from provider:', error);
          toast({
            title: "Authentication Error",
            description: error || "There was a problem logging you in",
            variant: "destructive"
          });
          navigate('/login', { replace: true });
          return;
        }
        
        // Get the session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error during auth callback:', sessionError);
          toast({
            title: "Authentication Error",
            description: sessionError.message || "There was a problem logging you in",
            variant: "destructive"
          });
          navigate('/login', { replace: true });
          return;
        }
        
        console.log("Auth session retrieved:", data);
        
        if (data?.session) {
          toast({
            title: "Login Successful",
            description: "You have been successfully logged in."
          });
          // Redirect to home page
          navigate('/', { replace: true });
        } else {
          // If no session, something went wrong
          console.error("No session found after auth callback");
          toast({
            title: "Authentication Error",
            description: "Failed to create a session. Please try again.",
            variant: "destructive"
          });
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        toast({
          title: "Authentication Error",
          description: "There was a problem processing your login",
          variant: "destructive"
        });
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center animate-fade-in space-y-4">
        <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
        <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
        <p className="text-muted-foreground">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
