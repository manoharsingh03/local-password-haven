
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback initiated");
        
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          toast({
            title: "Authentication Error",
            description: error.message || "There was a problem logging you in",
            variant: "destructive"
          });
          navigate('/', { replace: true });
          return;
        }
        
        console.log("Auth session retrieved:", data);
        
        if (data?.session) {
          toast({
            title: "Login Successful",
            description: "You have been successfully logged in."
          });
        }
        
        // Redirect to home page
        navigate('/', { replace: true });
      } catch (err) {
        console.error("Auth callback error:", err);
        toast({
          title: "Authentication Error",
          description: "There was a problem processing your login",
          variant: "destructive"
        });
        navigate('/', { replace: true });
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
