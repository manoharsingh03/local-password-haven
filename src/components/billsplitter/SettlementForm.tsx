
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { addSettlement, SettlementData } from '@/utils/financeIntegrationUtils';
import { formatCurrencyINR } from '@/utils/billSplitterUtils';
import { IndianRupee } from 'lucide-react';

interface SettlementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settlement: {
    from: string;
    to: string;
    amount: number;
    fromName: string;
    toName: string;
  };
  group: {
    id: string;
    name: string;
  };
  participants: Array<{
    id: string;
    name: string;
    email: string | null;
  }>;
  onSuccess: () => void;
}

const SettlementForm: React.FC<SettlementFormProps> = ({ 
  open, 
  onOpenChange, 
  settlement, 
  group,
  participants,
  onSuccess
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState(`${settlement.fromName} paid ${settlement.toName}`);

  // Find participant emails
  const fromParticipant = participants.find(p => p.id === settlement.from);
  const toParticipant = participants.find(p => p.id === settlement.to);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const settlementData: SettlementData = {
      groupId: group.id,
      groupName: group.name,
      fromParticipantId: settlement.from,
      fromParticipantName: settlement.fromName,
      fromParticipantEmail: fromParticipant?.email || null,
      toParticipantId: settlement.to,
      toParticipantName: settlement.toName,
      toParticipantEmail: toParticipant?.email || null,
      amount: settlement.amount,
      description: description
    };

    const success = await addSettlement(settlementData, user?.id);
    
    setIsSubmitting(false);
    
    if (success) {
      toast({
        title: "Settlement recorded",
        description: `Settlement between ${settlement.fromName} and ${settlement.toName} has been recorded.`,
      });
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Settlement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Input id="from" value={settlement.fromName} disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input id="to" value={settlement.toName} disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Input 
                  id="amount" 
                  value={settlement.amount} 
                  disabled
                  className="pl-8"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatCurrencyINR(settlement.amount)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea 
                id="description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes about this payment"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Recording..." : "Record Settlement"}
            </Button>
          </div>

          {user && (
            <p className="text-xs text-muted-foreground">
              Note: This settlement will be synced to your Finance Tracker if you've enabled the integration.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SettlementForm;
