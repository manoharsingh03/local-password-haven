
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface AddParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
}

const AddParticipantDialog: React.FC<AddParticipantDialogProps> = ({
  open,
  onOpenChange,
  groupId
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const queryClient = useQueryClient();

  const createParticipantMutation = useMutation({
    mutationFn: async (data: { name: string; email?: string }) => {
      const { data: participant, error } = await supabase
        .from('participants')
        .insert({
          group_id: groupId,
          name: data.name,
          email: data.email || null
        })
        .select()
        .single();

      if (error) throw error;
      return participant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants', groupId] });
      toast({
        title: "Success",
        description: "Participant added successfully!"
      });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error creating participant:', error);
      toast({
        title: "Error",
        description: "Failed to add participant. Please try again.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setName('');
    setEmail('');
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a participant name.",
        variant: "destructive"
      });
      return;
    }

    createParticipantMutation.mutate({
      name: name.trim(),
      email: email.trim() || undefined
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Participant</DialogTitle>
          <DialogDescription>
            Add a new person to this group to split expenses with.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter participant's name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={createParticipantMutation.isPending}
            >
              {createParticipantMutation.isPending ? 'Adding...' : 'Add Participant'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddParticipantDialog;
