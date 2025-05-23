
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Balance, Settlement, calculateBalances, calculateSettlements, formatCurrencyINR } from '@/utils/billSplitterUtils';
import { ArrowRight, Calculator, CircleDollarSign, LucideChevronsUpDown } from "lucide-react";
import SettlementForm from './SettlementForm';

interface Participant {
  id: string;
  name: string;
  email?: string | null;
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
  groupId: string;
  groupName: string;
  onSettlementAdded?: () => void;
}

const BalancesDashboard: React.FC<BalancesDashboardProps> = ({ 
  participants, 
  expenses, 
  isLoading,
  groupId,
  groupName,
  onSettlementAdded
}) => {
  const [activeSettlement, setActiveSettlement] = useState<Settlement | null>(null);
  const [showSettlementForm, setShowSettlementForm] = useState(false);

  const balances = useMemo(() => {
    return calculateBalances(participants, expenses);
  }, [participants, expenses]);

  const settlements = useMemo(() => {
    return calculateSettlements(balances);
  }, [balances]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
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
    );
  }

  if (!participants || participants.length === 0 || !expenses || expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <Calculator className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No balances yet</h3>
        <p className="text-muted-foreground">Add at least two participants and some expenses to see balances.</p>
      </div>
    );
  }

  const handleSettlementRecord = (settlement: Settlement) => {
    setActiveSettlement(settlement);
    setShowSettlementForm(true);
  };

  const handleSettlementSuccess = () => {
    if (onSettlementAdded) {
      onSettlementAdded();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <CircleDollarSign className="h-5 w-5 mr-2" />
            Current Balances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {balances.map((balance) => (
              <div key={balance.participantId} className="flex items-center justify-between py-2">
                <span className="font-medium">{balance.participantName}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={balance.balance > 0 ? "default" : balance.balance < 0 ? "destructive" : "secondary"}>
                    {balance.balance > 0
                      ? `Gets back ${formatCurrencyINR(balance.balance)}`
                      : balance.balance < 0
                      ? `Owes ${formatCurrencyINR(Math.abs(balance.balance))}`
                      : 'All settled'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <LucideChevronsUpDown className="h-5 w-5 mr-2" />
            Suggested Settlements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {settlements.length > 0 ? (
            <div className="space-y-4">
              {settlements.map((settlement, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{settlement.fromName}</p>
                    </div>
                    <div className="mx-2 flex items-center">
                      <ArrowRight className="h-4 w-4 mx-1 text-muted-foreground" />
                      <span className="font-bold text-primary">{formatCurrencyINR(settlement.amount)}</span>
                      <ArrowRight className="h-4 w-4 mx-1 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                      <p className="truncate font-medium">{settlement.toName}</p>
                    </div>
                  </div>
                  <div className="flex justify-center mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleSettlementRecord(settlement)}
                    >
                      Record Payment
                    </Button>
                  </div>
                  {index < settlements.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">All balances are settled! 🎉</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settlement Form Dialog */}
      {activeSettlement && (
        <SettlementForm
          open={showSettlementForm}
          onOpenChange={setShowSettlementForm}
          settlement={activeSettlement}
          group={{ id: groupId, name: groupName }}
          participants={participants}
          onSuccess={handleSettlementSuccess}
        />
      )}
    </div>
  );
};

export default BalancesDashboard;
