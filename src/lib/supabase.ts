
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { Database } from './database.types';

// Export the configured client
export const supabase = supabaseClient;

// Re-export the Database type
export type { Database };
