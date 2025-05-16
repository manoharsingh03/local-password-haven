
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import { Database } from './database.types';

// Supabase client configuration
// We're using Vite environment variables format
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Export a dummy client that shows an error when needed
const createDummyClient = () => {
  console.error('Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  
  // Show toast error only in browser environment (not during SSR)
  if (typeof window !== 'undefined') {
    toast({
      title: 'Supabase Connection Error',
      description: 'Missing Supabase configuration. The app will work in offline mode only.',
      variant: 'destructive',
      duration: 6000,
    });
  }
  
  // Return a dummy client that won't throw but won't work with the backend
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signInWithOAuth: async () => ({ data: { url: '#', provider: 'google' }, error: null }),
      signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ data: [], error: null }) }),
      insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
    }),
  } as unknown as ReturnType<typeof createClient>;
};

// Create a single supabase client for the entire app - fallback to dummy client if config is missing
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : createDummyClient();

// Re-export existing Database type
export type { Database };
