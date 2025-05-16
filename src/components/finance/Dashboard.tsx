import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, IndianRupee } from "lucide-react";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import TransactionForm from './TransactionForm';
import { Button } from '@/components/ui/button';
import { Transaction, CategoryTotal, getMonthlyData, getCategoryTotals, calculateTotalIncome, calculateTotalExpense, calculateBalance } from '@/utils/financeUtils';
import { formatCurrency } from '@/utils/formatUtils';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

// Demo data for initial render
const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 25000,
    type: 'income',
    category: 'Salary',
    description: 'Monthly salary',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    amount: 12500,
    type: 'expense',
    category: 'Housing',
    description: 'Rent payment',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    amount: 1200,
    type: 'expense',
    category: 'Food',
    description: 'Grocery shopping',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    amount: 5000,
    type: 'income',
    category: 'Freelance',
    description: 'Side project',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Chart colors
const EXPENSE_COLORS = [
  '#ff4d4f', '#ff7a45', '#fa8c16', '#ffc53d', '#ffec3d',
  '#a0d911', '#52c41a', '#13c2c2', '#1890ff', '#722ed1'
];

const INCOME_COLORS = [
  '#722ed1', '#2f54eb', '#1890ff', '#13c2c2', '#52c41a',
];

const customTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm border p-2 rounded-md shadow-sm">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className={entry.name === 'Income' ? 'text-green-500' : 'text-red-500'}>
            {`${entry.name}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      
      // If user is logged in, fetch from Supabase
      if (user) {
        try {
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id);
            
          if (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
          } else if (data.length > 0) {
            setTransactions(data);
          } else {
            // If no data in Supabase yet for logged in user, initialize with empty array
            setTransactions([]);
          }
        } catch (error) {
          console.error('Error fetching transactions:', error);
          setTransactions([]);
        }
      } else {
        // For non-logged in users, use demo data
        setTransactions([]);
      }
      
      setIsLoading(false);
    };

    fetchTransactions();
  }, [user]);

  const monthlyData = getMonthlyData(transactions);
  const expenseCategoryData = getCategoryTotals(transactions, 'expense');
  const incomeCategoryData = getCategoryTotals(transactions, 'income');
  
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpense = calculateTotalExpense(transactions);
  const balance = calculateBalance(transactions);

  const handleAddTransaction = async (newTransaction: Transaction) => {
    // Add user_id if logged in
    const transactionToAdd = user 
      ? { ...newTransaction, user_id: user.id } 
      : newTransaction;
    
    // If user is logged in, add to Supabase
    if (user) {
      try {
        const { error } = await supabase
          .from('transactions')
          .insert([transactionToAdd]);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error adding transaction:', error);
      }
    }
    
    setTransactions([...transactions, newTransaction]);
    setShowAddTransaction(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-card to-secondary/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-secondary/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpense)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-secondary/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance < 0 ? 'text-destructive' : 'text-foreground'}`}>
              {formatCurrency(balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income vs Expense Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p>Loading chart data...</p>
              </div>
            ) : (
              <ChartContainer 
                config={{
                  income: {
                    label: "Income",
                    theme: {
                      light: "#36A2EB",
                      dark: "#36A2EB"
                    }
                  },
                  expense: {
                    label: "Expense",
                    theme: {
                      light: "#FF6384",
                      dark: "#FF6384"
                    }
                  }
                }}
                className="aspect-[4/3]"
              >
                <ResponsiveContainer>
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                    <Tooltip content={customTooltip} />
                    <Legend />
                    <Bar dataKey="income" fill="var(--color-income)" name="Income" />
                    <Bar dataKey="expense" fill="var(--color-expense)" name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p>Loading chart data...</p>
              </div>
            ) : expenseCategoryData.length > 0 ? (
              <div className="w-full aspect-[4/3]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                      nameKey="category"
                      label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted-foreground text-center my-16">No expense data to display</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8 pb-8 sm:pb-0">
        {showAddTransaction ? (
          <Card className="w-full max-w-md animate-fade-in">
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionForm 
                onSubmit={handleAddTransaction} 
                onCancel={() => setShowAddTransaction(false)} 
              />
            </CardContent>
          </Card>
        ) : (
          <Button 
            onClick={() => setShowAddTransaction(true)} 
            className="animate-fade-in md:mb-0"
            size="lg"
          >
            <IndianRupee className="mr-2 h-4 w-4" />
            Add New Transaction
          </Button>
        )}
      </div>

      {/* Fixed Add Transaction Button for Mobile */}
      <div className="fixed bottom-4 right-4 sm:hidden z-50">
        <Button 
          size="lg" 
          onClick={() => setShowAddTransaction(true)}
          className="rounded-full shadow-lg flex items-center justify-center h-14 w-14"
        >
          <IndianRupee className="h-6 w-6" />
          <span className="sr-only">Add Transaction</span>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
