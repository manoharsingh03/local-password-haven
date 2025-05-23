
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { calculateBalances, calculateSettlements, formatCurrencyINR } from '@/utils/billSplitterUtils';

interface Participant {
  id: string;
  name: string;
  email?: string;
}

interface Expense {
  id: string;
  amount: number;
  paid_by: string;
  splits: Array<{
    participant_id: string;
    amount: number;
  }>;
}

interface BalancesDashboardProps {
  participants: Participant[];
  expenses: Expense[];
  isLoading: boolean;
}

const BalancesDashboard: React.FC<BalancesDashboardProps> = ({ 
  participants, 
  expenses, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!participants || participants.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No balances to show</h3>
        <p className="text-muted-foreground">Add participants and expenses to see balance calculations!</p>
      </div>
    );
  }

  const balances = calculateBalances(participants, expenses || []);
  const settlements = calculateSettlements(balances);

  return (
    <div className="space-y-6">
      {/* Individual Balances */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Individual Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {balances.map((balance) => (
            <Card key={balance.participantId} className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarFallback>
                        {balance.participantName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{balance.participantName}</span>
                  </div>
                  {balance.balance > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : balance.balance < 0 ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    balance.balance > 0 
                      ? 'text-green-600' 
                      : balance.balance < 0 
                      ? 'text-red-600' 
                      : 'text-muted-foreground'
                  }`}>
                    {formatCurrencyINR(Math.abs(balance.balance))}
                  </div>
                  <Badge 
                    variant={balance.balance > 0 ? "default" : balance.balance < 0 ? "destructive" : "secondary"}
                    className="mt-2"
                  >
                    {balance.balance > 0 
                      ? 'Gets back' 
                      : balance.balance < 0 
                      ? 'Owes' 
                      : 'Settled up'
                    }
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Settlement Suggestions */}
      {settlements.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Suggested Settlements</h3>
          <div className="space-y-3">
            {settlements.map((settlement, index) => (
              <Card key={index} className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {settlement.fromName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {settlement.toName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          <span className="text-primary">{settlement.fromName}</span> pays{' '}
                          <span className="text-primary">{settlement.toName}</span>
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrencyINR(settlement.amount)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Mark as Paid
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {settlements.length === 0 && expenses && expenses.length > 0 && (
        <Card className="glass">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-12 w-12 mx-auto text-green-500 mb-3" />
            <h3 className="text-lg font-medium text-green-600 mb-2">All Settled Up!</h3>
            <p className="text-muted-foreground">Everyone is squared away. No outstanding balances.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BalancesDashboard;
