
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Receipt, Calculator } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpensesList from './ExpensesList';
import ParticipantsList from './ParticipantsList';
import BalancesDashboard from './BalancesDashboard';
import AddExpenseDialog from './AddExpenseDialog';
import AddParticipantDialog from './AddParticipantDialog';
import FinanceIntegrationSettings from './FinanceIntegrationSettings';

interface GroupDetailContainerProps {
  groupId: string;
}

const GroupDetailContainer: React.FC<GroupDetailContainerProps> = ({ groupId }) => {
  const { user } = useAuth();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");

  const { data: group, isLoading: groupLoading, error: groupError } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });

  const { data: participants, isLoading: participantsLoading, refetch: refetchParticipants } = useQuery({
    queryKey: ['participants', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!groupId,
  });

  const { data: expenses, isLoading: expensesLoading, refetch: refetchExpenses } = useQuery({
    queryKey: ['expenses', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          paid_by_participant:participants!expenses_paid_by_fkey(*),
          splits(
            *,
            participant:participants(*)
          )
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!groupId,
  });

  const { data: settlements, refetch: refetchSettlements } = useQuery({
    queryKey: ['settlements', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settlements')
        .select('*')
        .eq('group_id', groupId)
        .order('settled_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!groupId,
  });

  const handleSettlementAdded = () => {
    // Refetch data after settlement is added
    refetchSettlements();
    // We might also want to refetch expenses in case our backend has updated them
    refetchExpenses();
  };

  if (groupLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (groupError || !group) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl text-center">
        <h1 className="text-2xl font-bold mb-4">Group not found</h1>
        <p className="text-muted-foreground">The group you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{group.name}</h1>
        {group.description && (
          <p className="text-muted-foreground text-lg">{group.description}</p>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participants?.length || 0}</div>
            <p className="text-muted-foreground text-sm">people in group</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Receipt className="h-5 w-5 mr-2" />
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses?.length || 0}</div>
            <p className="text-muted-foreground text-sm">total expenses</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Calculator className="h-5 w-5 mr-2" />
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0).toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR'
              }) || '₹0'}
            </div>
            <p className="text-muted-foreground text-sm">spent so far</p>
          </CardContent>
        </Card>
      </div>

      {user && (
        <div className="mb-8">
          <FinanceIntegrationSettings groupId={groupId} groupName={group.name} />
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <Button 
          onClick={() => setShowAddExpense(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
        <Button 
          variant="outline"
          onClick={() => setShowAddParticipant(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Participant
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass mb-6">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="animate-fade-in">
          <ExpensesList 
            expenses={expenses || []} 
            participants={participants || []}
            isLoading={expensesLoading} 
          />
        </TabsContent>

        <TabsContent value="balances" className="animate-fade-in">
          <BalancesDashboard 
            participants={participants || []}
            expenses={expenses || []}
            isLoading={participantsLoading || expensesLoading}
            groupId={groupId}
            groupName={group.name}
            onSettlementAdded={handleSettlementAdded}
          />
        </TabsContent>

        <TabsContent value="participants" className="animate-fade-in">
          <ParticipantsList 
            participants={participants || []} 
            isLoading={participantsLoading} 
          />
        </TabsContent>
      </Tabs>

      <AddExpenseDialog 
        open={showAddExpense}
        onOpenChange={setShowAddExpense}
        groupId={groupId}
        participants={participants || []}
      />

      <AddParticipantDialog 
        open={showAddParticipant}
        onOpenChange={setShowAddParticipant}
        groupId={groupId}
        onSuccess={() => refetchParticipants()}
      />
    </div>
  );
};

export default GroupDetailContainer;
