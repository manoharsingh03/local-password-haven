
/**
 * Utility functions for bill splitting calculations
 */

export interface Balance {
  participantId: string;
  participantName: string;
  balance: number; // positive = owed money, negative = owes money
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
  fromName: string;
  toName: string;
}

/**
 * Calculate balances for each participant in a group
 */
export const calculateBalances = (
  participants: Array<{ id: string; name: string }>,
  expenses: Array<{
    id: string;
    amount: number;
    paid_by: string;
    splits: Array<{ participant_id: string; amount: number }>;
  }>
): Balance[] => {
  const balances: Record<string, number> = {};
  
  // Initialize balances
  participants.forEach(p => {
    balances[p.id] = 0;
  });

  // Calculate balances
  expenses.forEach(expense => {
    // Add amount paid
    balances[expense.paid_by] += expense.amount;
    
    // Subtract amounts owed
    expense.splits.forEach(split => {
      balances[split.participant_id] -= split.amount;
    });
  });

  return participants.map(p => ({
    participantId: p.id,
    participantName: p.name,
    balance: balances[p.id] || 0
  }));
};

/**
 * Calculate optimal settlements to minimize transactions
 */
export const calculateSettlements = (balances: Balance[]): Settlement[] => {
  const settlements: Settlement[] = [];
  const debtors = balances.filter(b => b.balance < 0).map(b => ({ ...b }));
  const creditors = balances.filter(b => b.balance > 0).map(b => ({ ...b }));

  while (debtors.length > 0 && creditors.length > 0) {
    const debtor = debtors[0];
    const creditor = creditors[0];

    const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

    settlements.push({
      from: debtor.participantId,
      to: creditor.participantId,
      amount,
      fromName: debtor.participantName,
      toName: creditor.participantName
    });

    debtor.balance += amount;
    creditor.balance -= amount;

    if (debtor.balance === 0) {
      debtors.shift();
    }
    if (creditor.balance === 0) {
      creditors.shift();
    }
  }

  return settlements;
};

/**
 * Split amount equally among participants
 */
export const splitEqually = (amount: number, participantIds: string[]): Record<string, number> => {
  const splitAmount = amount / participantIds.length;
  const splits: Record<string, number> = {};
  
  participantIds.forEach(id => {
    splits[id] = splitAmount;
  });
  
  return splits;
};

/**
 * Format currency in Indian Rupees
 */
export const formatCurrencyINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
