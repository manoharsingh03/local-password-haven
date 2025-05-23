
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface SettlementData {
  groupId: string;
  groupName: string;
  fromParticipantId: string;
  fromParticipantName: string;
  fromParticipantEmail: string | null;
  toParticipantId: string;
  toParticipantName: string;
  toParticipantEmail: string | null;
  amount: number;
  description?: string;
}

/**
 * Add a new settlement record
 */
export const addSettlement = async (data: SettlementData, userId?: string): Promise<boolean> => {
  try {
    // Create a settlement record
    const { error: settlementError } = await supabase
      .from('settlements')
      .insert({
        group_id: data.groupId,
        from_participant_id: data.fromParticipantId,
        to_participant_id: data.toParticipantId,
        amount: data.amount,
        description: data.description || `${data.fromParticipantName} paid ${data.toParticipantName}`,
        created_by: userId || null,
      });

    if (settlementError) throw settlementError;

    // Check if we should add a finance transaction
    if (userId && data.fromParticipantEmail) {
      await syncSettlementToFinance(data, userId);
    }
    
    return true;
  } catch (error) {
    console.error('Error adding settlement:', error);
    toast({
      title: 'Error',
      description: 'Failed to record settlement.',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Sync settlement to finance tracker
 */
export const syncSettlementToFinance = async (data: SettlementData, userId: string): Promise<boolean> => {
  try {
    // Check if finance integration is enabled for this group
    const { data: integration, error: integrationError } = await supabase
      .from('finance_integrations')
      .select('enabled')
      .eq('user_id', userId)
      .eq('group_id', data.groupId)
      .maybeSingle();
    
    // If integration doesn't exist or is disabled, don't sync
    if (integrationError || !integration || !integration.enabled) return false;

    // Add to transactions table
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: data.amount,
        type: 'expense',
        category: 'Group Expenses',
        description: `Paid to ${data.toParticipantName} for group "${data.groupName}"`,
        date: new Date().toISOString(),
      });

    if (transactionError) throw transactionError;
    
    toast({
      title: 'Transaction Added',
      description: `Payment of ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.amount)} added to your Finance Tracker`,
    });

    return true;
  } catch (error) {
    console.error('Error syncing to finance:', error);
    return false;
  }
};

/**
 * Check if finance integration is enabled for a group
 */
export const getFinanceIntegration = async (groupId: string, userId: string) => {
  const { data, error } = await supabase
    .from('finance_integrations')
    .select('enabled')
    .eq('user_id', userId)
    .eq('group_id', groupId)
    .maybeSingle();
    
  if (error || !data) return false;
  return data.enabled;
};

/**
 * Toggle finance integration for a group
 */
export const toggleFinanceIntegration = async (groupId: string, userId: string, enabled: boolean): Promise<boolean> => {
  try {
    const { data: existing } = await supabase
      .from('finance_integrations')
      .select('id')
      .eq('user_id', userId)
      .eq('group_id', groupId)
      .maybeSingle();
    
    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from('finance_integrations')
        .update({ enabled })
        .eq('id', existing.id);
        
      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase
        .from('finance_integrations')
        .insert({
          user_id: userId,
          group_id: groupId,
          enabled
        });
        
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error toggling finance integration:', error);
    toast({
      title: 'Error',
      description: 'Failed to update finance integration settings.',
      variant: 'destructive',
    });
    return false;
  }
};
