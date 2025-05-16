
import { Transaction } from './financeUtils';

// Helper function to get month name from date string
export const getMonthName = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
};

// Format currency with currency symbol
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Prepare data for monthly spending chart
export const prepareMonthlyChartData = (transactions: Transaction[]) => {
  const monthlyData: Record<string, { income: number; expense: number }> = {};

  // Initialize last 6 months of data
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(today.getMonth() - i);
    const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[monthYear] = { income: 0, expense: 0 };
  }

  // Aggregate transaction data
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (monthlyData[monthYear]) {
      if (transaction.type === 'income') {
        monthlyData[monthYear].income += transaction.amount;
      } else {
        monthlyData[monthYear].expense += transaction.amount;
      }
    }
  });

  // Format for chart
  return Object.entries(monthlyData).map(([date, data]) => ({
    name: getMonthName(date),
    Income: data.income,
    Expense: data.expense,
  }));
};

// Prepare data for category spending chart
export const prepareCategoryChartData = (transactions: Transaction[], type: 'income' | 'expense') => {
  const expensesByCategory: Record<string, number> = {};
  
  // Get all unique categories
  const categories = Array.from(new Set(transactions
    .filter(t => t.type === type)
    .map(t => t.category)));
    
  // Initialize all categories with zero
  categories.forEach((category) => {
    expensesByCategory[category] = 0;
  });
  
  // Aggregate expense transactions by category
  transactions.forEach((transaction) => {
    if (transaction.type === type && expensesByCategory[transaction.category] !== undefined) {
      expensesByCategory[transaction.category] += transaction.amount;
    }
  });
  
  // Format for pie chart, filtering out zero values
  return Object.entries(expensesByCategory)
    .filter(([_, amount]) => amount > 0)
    .map(([name, value]) => ({ name, value }));
};

// Calculate financial summary
export const calculateFinancialSummary = (transactions: Transaction[]) => {
  const summary = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    recentTransactions: [] as Transaction[],
  };
  
  transactions.forEach((transaction) => {
    if (transaction.type === 'income') {
      summary.totalIncome += transaction.amount;
    } else {
      summary.totalExpenses += transaction.amount;
    }
  });
  
  summary.balance = summary.totalIncome - summary.totalExpenses;
  summary.recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  return summary;
};
