
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthError, Session, User, AuthResponse, OAuthResponse } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<OAuthResponse>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  isLoggedIn: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signIn: async () => ({} as AuthResponse),
  signInWithGoogle: async () => ({} as OAuthResponse),
  signUp: async () => ({} as AuthResponse),
  signOut: async () => {},
  isLoggedIn: false,
});

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      setLoading(true);
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
        }
        
        setSession(initialSession);
        setUser(initialSession?.user || null);
      } catch (error) {
        console.error('Session fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
      setLoading(false);
    });

    getSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      if (response.error) {
        toast({
          title: "Login failed",
          description: response.error.message,
          variant: "destructive"
        });
      } else if (response.data.user) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${response.data.user.email}!`,
        });
      }
      return response;
    } catch (error) {
      console.error('Sign in error:', error);
      const authError = error as AuthError;
      toast({
        title: "Login error",
        description: authError.message || "An unexpected error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    try {
      const response = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      return response;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        } 
      });
      
      if (response.error) {
        toast({
          title: "Signup failed",
          description: response.error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signup successful",
          description: "Please check your email for verification instructions."
        });
      }
      return response;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    isLoggedIn: !!session
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
