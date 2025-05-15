
import { encryptData, decryptData, hashMasterPassword } from './encryptionUtils';

// Type definitions
export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
}

export interface FinanceVault {
  masterPasswordHash: string;
  transactions: Transaction[];
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

const FINANCE_VAULT_KEY = 'finance_vault';

// Helper functions for finance data
export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalExpense = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateBalance = (transactions: Transaction[]): number => {
  return calculateTotalIncome(transactions) - calculateTotalExpense(transactions);
};

export const getCategoryTotals = (transactions: Transaction[], type: 'income' | 'expense'): CategoryTotal[] => {
  const filteredTransactions = transactions.filter(t => t.type === type);
  const categoryMap = new Map<string, number>();
  
  filteredTransactions.forEach(t => {
    const currentTotal = categoryMap.get(t.category) || 0;
    categoryMap.set(t.category, currentTotal + t.amount);
  });
  
  return Array.from(categoryMap.entries()).map(([category, total]) => ({
    category,
    total
  }));
};

export const getMonthlyData = (transactions: Transaction[], monthsToShow = 6): MonthlyData[] => {
  const today = new Date();
  const monthlyData: MonthlyData[] = [];

  // Create data for the last X months
  for (let i = 0; i < monthsToShow; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Filter transactions for this month
    const monthTransactions = transactions.filter(t => {
      const transDate = new Date(t.date);
      return transDate.getFullYear() === date.getFullYear() && 
             transDate.getMonth() === date.getMonth();
    });
    
    const income = calculateTotalIncome(monthTransactions);
    const expense = calculateTotalExpense(monthTransactions);
    
    monthlyData.push({ month, income, expense });
  }
  
  return monthlyData.reverse(); // Most recent month last
};

// Initialize the finance vault if it doesn't exist
export const initializeFinanceVault = (masterPassword: string): void => {
  // Check if vault already exists
  const storedVault = localStorage.getItem(FINANCE_VAULT_KEY);
  if (storedVault) {
    throw new Error('Finance vault already exists. Please unlock it instead.');
  }

  // Create new empty vault
  const newVault: FinanceVault = {
    masterPasswordHash: hashMasterPassword(masterPassword),
    transactions: [],
  };

  // Encrypt and store the vault
  const encryptedVault = encryptData(newVault, masterPassword);
  localStorage.setItem(FINANCE_VAULT_KEY, encryptedVault);
};

// Get the finance vault using the master password
export const getFinanceVault = (masterPassword: string): FinanceVault => {
  const storedVault = localStorage.getItem(FINANCE_VAULT_KEY);
  if (!storedVault) {
    throw new Error('No finance vault found. Please create one first.');
  }

  try {
    return decryptData(storedVault, masterPassword);
  } catch (error) {
    throw new Error('Failed to unlock finance vault. Incorrect master password?');
  }
};

// Save the finance vault with the master password
export const saveFinanceVault = (vault: FinanceVault, masterPassword: string): void => {
  const encryptedVault = encryptData(vault, masterPassword);
  localStorage.setItem(FINANCE_VAULT_KEY, encryptedVault);
};

// Check if a finance vault already exists
export const financeVaultExists = (): boolean => {
  return localStorage.getItem(FINANCE_VAULT_KEY) !== null;
};

// Add a new transaction entry
export const addTransaction = (
  transaction: Omit<Transaction, 'id'>,
  vault: FinanceVault,
  masterPassword: string
): FinanceVault => {
  const newTransaction: Transaction = {
    ...transaction,
    id: crypto.randomUUID(),
  };

  const updatedVault: FinanceVault = {
    ...vault,
    transactions: [...vault.transactions, newTransaction],
  };

  saveFinanceVault(updatedVault, masterPassword);
  return updatedVault;
};

// Update an existing transaction
export const updateTransaction = (
  updatedTransaction: Transaction,
  vault: FinanceVault,
  masterPassword: string
): FinanceVault => {
  const updatedTransactions = vault.transactions.map((transaction) =>
    transaction.id === updatedTransaction.id ? updatedTransaction : transaction
  );

  const updatedVault: FinanceVault = {
    ...vault,
    transactions: updatedTransactions,
  };

  saveFinanceVault(updatedVault, masterPassword);
  return updatedVault;
};

// Delete a transaction
export const deleteTransaction = (
  transactionId: string,
  vault: FinanceVault,
  masterPassword: string
): FinanceVault => {
  const updatedTransactions = vault.transactions.filter((transaction) => transaction.id !== transactionId);

  const updatedVault: FinanceVault = {
    ...vault,
    transactions: updatedTransactions,
  };

  saveFinanceVault(updatedVault, masterPassword);
  return updatedVault;
};

// Export transactions as JSON
export const exportTransactionsAsJSON = (transactions: Transaction[]): string => {
  return JSON.stringify(transactions, null, 2);
};

// Export transactions as CSV
export const exportTransactionsAsCSV = (transactions: Transaction[]): string => {
  if (transactions.length === 0) return '';
  
  // CSV header
  const headers = ['id', 'amount', 'type', 'category', 'description', 'date'];
  const csvRows = [headers.join(',')];
  
  // Add data rows
  for (const transaction of transactions) {
    const values = headers.map(header => {
      const value = transaction[header as keyof Transaction];
      // Wrap strings in quotes and escape any quotes within
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

// Default categories
export const DEFAULT_INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Gifts',
  'Other Income'
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Housing',
  'Food',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Utilities',
  'Education',
  'Travel',
  'Other'
];
