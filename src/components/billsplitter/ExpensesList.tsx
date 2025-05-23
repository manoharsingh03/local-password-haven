
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, User, Calendar } from "lucide-react";
import { formatCurrencyINR } from '@/utils/billSplitterUtils';

interface Expense {
  id: string;
  title: string;
  amount: number;
  split_type: string;
  created_at: string;
  paid_by_participant: {
    id: string;
    name: string;
  };
  splits: Array<{
    amount: number;
    participant: {
      id: string;
      name: string;
    };
  }>;
}

interface ExpensesListProps {
  expenses: Expense[];
  participants: any[];
  isLoading: boolean;
}

const ExpensesList: React.FC<ExpensesListProps> = ({ expenses, participants, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <Receipt className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No expenses yet</h3>
        <p className="text-muted-foreground">Add your first expense to start tracking group spending!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <Card key={expense.id} className="glass glass-hover transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <Receipt className="h-5 w-5 mr-2" />
                {expense.title}
              </CardTitle>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrencyINR(expense.amount)}
                </div>
                <Badge variant="secondary" className="capitalize">
                  {expense.split_type}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                Paid by <span className="font-medium ml-1">{expense.paid_by_participant.name}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(expense.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>

              <div className="border-t pt-3">
                <h4 className="text-sm font-medium mb-2">Split among:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {expense.splits.map((split) => (
                    <div key={split.participant.id} className="flex justify-between text-sm">
                      <span>{split.participant.name}</span>
                      <span className="font-medium">{formatCurrencyINR(split.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExpensesList;
