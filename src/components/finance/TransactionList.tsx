
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Download, FileJson, FileText, IndianRupee } from "lucide-react";
import TransactionForm from './TransactionForm';
import { Transaction, exportTransactionsAsCSV, exportTransactionsAsJSON } from '@/utils/financeUtils';
import { toast } from "@/components/ui/use-toast";
import { formatCurrency, formatDate } from '@/utils/formatUtils';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

// Using the same demo data for initial render
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

const TransactionList: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadedData, setLoadedData] = useState(false);
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
            .eq('user_id', user.id)
            .order('date', { ascending: false });
            
          if (error) {
            console.error('Error fetching transactions:', error);
            // Fall back to demo data
            if (!loadedData) {
              setTransactions(DEMO_TRANSACTIONS);
              setLoadedData(true);
            }
          } else if (data.length > 0) {
            setTransactions(data);
            setLoadedData(true);
          } else if (!loadedData) {
            // If no data in Supabase yet, use demo data
            setTransactions(DEMO_TRANSACTIONS);
            setLoadedData(true);
          }
        } catch (error) {
          console.error('Error fetching transactions:', error);
          if (!loadedData) {
            setTransactions(DEMO_TRANSACTIONS);
            setLoadedData(true);
          }
        }
      } else if (!loadedData) {
        // For non-logged in users, use demo data
        setTransactions(DEMO_TRANSACTIONS);
        setLoadedData(true);
      }
      
      setIsLoading(false);
    };

    fetchTransactions();
  }, [user, loadedData]);
  
  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort transactions by date (most recent first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
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
        toast({
          title: "Error",
          description: "Failed to add transaction to database.",
          variant: "destructive",
        });
      }
    }
    
    // Update local state
    setTransactions([...transactions, newTransaction]);
    setShowAddTransaction(false);
    toast({
      title: "Transaction added",
      description: "Your transaction has been added successfully.",
    });
  };
  
  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    // If user is logged in, update in Supabase
    if (user) {
      try {
        const { error } = await supabase
          .from('transactions')
          .update(updatedTransaction)
          .eq('id', updatedTransaction.id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error updating transaction:', error);
        toast({
          title: "Error",
          description: "Failed to update transaction in database.",
          variant: "destructive",
        });
      }
    }
    
    // Update local state
    setTransactions(
      transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    setEditingTransaction(null);
    toast({
      title: "Transaction updated",
      description: "Your transaction has been updated successfully.",
    });
  };
  
  const handleDeleteTransaction = async (id: string) => {
    // If user is logged in, delete from Supabase
    if (user) {
      try {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting transaction:', error);
        toast({
          title: "Error",
          description: "Failed to delete transaction from database.",
          variant: "destructive",
        });
      }
    }
    
    // Update local state
    setTransactions(transactions.filter(t => t.id !== id));
    toast({
      title: "Transaction deleted",
      description: "Your transaction has been deleted.",
      variant: "destructive",
    });
  };
  
  const exportData = (format: 'json' | 'csv') => {
    try {
      let data, filename, type;
      
      if (format === 'json') {
        data = exportTransactionsAsJSON(transactions);
        filename = 'finance-transactions.json';
        type = 'application/json';
      } else {
        data = exportTransactionsAsCSV(transactions);
        filename = 'finance-transactions.csv';
        type = 'text/csv';
      }
      
      // Create download link
      const blob = new Blob([data], { type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: `Your data has been exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was a problem exporting your data.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>All Transactions</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => exportData('json')}
              className="flex items-center"
            >
              <FileJson className="mr-1 h-4 w-4" />
              Export JSON
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => exportData('csv')}
              className="flex items-center"
            >
              <FileText className="mr-1 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={() => setShowAddTransaction(true)}>Add Transaction</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : sortedTransactions.length > 0 ? (
                  sortedTransactions.map(transaction => (
                    <TableRow key={transaction.id} className="animate-fade-in">
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setEditingTransaction(transaction)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No transactions found matching your search.' : 'No transactions yet. Add your first transaction using the button above.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Transaction Dialog */}
      <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm 
            onSubmit={handleAddTransaction} 
            onCancel={() => setShowAddTransaction(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Transaction Dialog */}
      <Dialog 
        open={!!editingTransaction} 
        onOpenChange={(open) => !open && setEditingTransaction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm 
              transaction={editingTransaction}
              onSubmit={handleUpdateTransaction} 
              onCancel={() => setEditingTransaction(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
      
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

export default TransactionList;
