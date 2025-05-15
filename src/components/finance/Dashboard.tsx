
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import TransactionForm from './TransactionForm';
import { Button } from '@/components/ui/button';
import { Transaction, CategoryTotal, getMonthlyData, getCategoryTotals, calculateTotalIncome, calculateTotalExpense, calculateBalance } from '@/utils/financeUtils';

// Demo data for initial render (when no data exists)
const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 2500,
    type: 'income',
    category: 'Salary',
    description: 'Monthly salary',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    amount: 500,
    type: 'expense',
    category: 'Housing',
    description: 'Rent payment',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    amount: 120,
    type: 'expense',
    category: 'Food',
    description: 'Grocery shopping',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    amount: 200,
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

const Dashboard: React.FC = () => {
  // In a real app, this would be loaded from storage
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [loadedData, setLoadedData] = useState(false);

  useEffect(() => {
    // For demo purposes, we'll use this sample data
    // In a real implementation, this would load data from IndexedDB or localStorage
    if (!loadedData) {
      setTransactions(DEMO_TRANSACTIONS);
      setLoadedData(true);
    }
  }, [loadedData]);

  const monthlyData = getMonthlyData(transactions);
  const expenseCategoryData = getCategoryTotals(transactions, 'expense');
  const incomeCategoryData = getCategoryTotals(transactions, 'income');
  
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpense = calculateTotalExpense(transactions);
  const balance = calculateBalance(transactions);

  const handleAddTransaction = (newTransaction: Transaction) => {
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
            <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-secondary/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpense.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-secondary/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance < 0 ? 'text-destructive' : 'text-foreground'}`}>
              ${balance.toFixed(2)}
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
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip 
                  content={(props) => 
                    <ChartTooltipContent {...props} />
                  }
                />
                <Bar dataKey="income" fill="var(--color-income)" name="Income" />
                <Bar dataKey="expense" fill="var(--color-expense)" name="Expense" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
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
                  <Tooltip formatter={(value) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {expenseCategoryData.length === 0 && (
              <p className="text-muted-foreground text-center mt-4">No expense data to display</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
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
          <Button onClick={() => setShowAddTransaction(true)} className="animate-fade-in">
            Add New Transaction
          </Button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
