
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { splitEqually } from '@/utils/billSplitterUtils';

interface Participant {
  id: string;
  name: string;
  email?: string;
}

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  participants: Participant[];
}

const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  open,
  onOpenChange,
  groupId,
  participants
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  const createExpenseMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      amount: number;
      paid_by: string;
      split_type: string;
      splits: Array<{ participant_id: string; amount: number }>;
    }) => {
      // First create the expense
      const { data: expense, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          group_id: groupId,
          title: data.title,
          amount: data.amount,
          paid_by: data.paid_by,
          split_type: data.split_type
        })
        .select()
        .single();

      if (expenseError) throw expenseError;

      // Then create the splits
      const splits = data.splits.map(split => ({
        expense_id: expense.id,
        participant_id: split.participant_id,
        amount: split.amount
      }));

      const { error: splitsError } = await supabase
        .from('splits')
        .insert(splits);

      if (splitsError) throw splitsError;

      return expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', groupId] });
      toast({
        title: "Success",
        description: "Expense added successfully!"
      });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error creating expense:', error);
      toast({
        title: "Error",
        description: "Failed to create expense. Please try again.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setPaidBy('');
    setSplitType('equal');
    setSelectedParticipants([]);
    setCustomSplits({});
  };

  const handleParticipantToggle = (participantId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleSubmit = () => {
    if (!title.trim() || !amount || !paidBy || selectedParticipants.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const expenseAmount = parseFloat(amount);
    let splits: Array<{ participant_id: string; amount: number }> = [];

    if (splitType === 'equal') {
      const splitAmounts = splitEqually(expenseAmount, selectedParticipants);
      splits = selectedParticipants.map(id => ({
        participant_id: id,
        amount: splitAmounts[id]
      }));
    } else if (splitType === 'exact') {
      const totalCustom = selectedParticipants.reduce((sum, id) => 
        sum + (parseFloat(customSplits[id]) || 0), 0);
      
      if (Math.abs(totalCustom - expenseAmount) > 0.01) {
        toast({
          title: "Error",
          description: "Custom split amounts must equal the total expense amount.",
          variant: "destructive"
        });
        return;
      }

      splits = selectedParticipants.map(id => ({
        participant_id: id,
        amount: parseFloat(customSplits[id]) || 0
      }));
    }

    createExpenseMutation.mutate({
      title,
      amount: expenseAmount,
      paid_by: paidBy,
      split_type: splitType,
      splits
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Add an expense and split it among group participants.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Expense Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Lunch at restaurant"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paidBy">Paid By</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((participant) => (
                    <SelectItem key={participant.id} value={participant.id}>
                      {participant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="splitType">Split Type</Label>
              <Select value={splitType} onValueChange={setSplitType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equal">Equal Split</SelectItem>
                  <SelectItem value="exact">Exact Amounts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Split Among Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={participant.id}
                        checked={selectedParticipants.includes(participant.id)}
                        onCheckedChange={() => handleParticipantToggle(participant.id)}
                      />
                      <Label htmlFor={participant.id} className="font-medium">
                        {participant.name}
                      </Label>
                    </div>
                    {splitType === 'exact' && selectedParticipants.includes(participant.id) && (
                      <Input
                        type="number"
                        step="0.01"
                        className="w-24"
                        placeholder="0.00"
                        value={customSplits[participant.id] || ''}
                        onChange={(e) => setCustomSplits(prev => ({
                          ...prev,
                          [participant.id]: e.target.value
                        }))}
                      />
                    )}
                    {splitType === 'equal' && selectedParticipants.includes(participant.id) && amount && (
                      <span className="text-sm text-muted-foreground">
                        ₹{(parseFloat(amount) / selectedParticipants.length).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={createExpenseMutation.isPending}
            >
              {createExpenseMutation.isPending ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
