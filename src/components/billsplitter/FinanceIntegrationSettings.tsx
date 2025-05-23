
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreditCard, ReceiptText, Loader2 } from 'lucide-react';
import { getFinanceIntegration, toggleFinanceIntegration } from '@/utils/financeIntegrationUtils';
import { toast } from '@/components/ui/use-toast';

interface FinanceIntegrationSettingsProps {
  groupId: string;
  groupName: string;
}

const FinanceIntegrationSettings: React.FC<FinanceIntegrationSettingsProps> = ({ groupId, groupName }) => {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (user?.id) {
        setLoading(true);
        const isEnabled = await getFinanceIntegration(groupId, user.id);
        setEnabled(isEnabled);
        setLoading(false);
      }
    };

    fetchSettings();
  }, [groupId, user]);

  const handleToggle = async (newState: boolean) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to change integration settings",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const success = await toggleFinanceIntegration(groupId, user.id, newState);
    setLoading(false);
    
    if (success) {
      setEnabled(newState);
      toast({
        title: newState ? "Integration Enabled" : "Integration Disabled",
        description: newState 
          ? `Bill splits from "${groupName}" will now be tracked in your Finance Tracker.` 
          : `Bill splits from "${groupName}" will no longer be tracked.`,
      });
    }
  };

  if (!user) {
    return (
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <CreditCard className="h-5 w-5 mr-2" />
            Finance Tracker Integration
          </CardTitle>
          <CardDescription>
            Log in to enable automatic tracking of expenses in your Finance Tracker
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <CreditCard className="h-5 w-5 mr-2" />
          Finance Tracker Integration
        </CardTitle>
        <CardDescription>
          Automatically sync bill splits to your personal Finance Tracker
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ReceiptText className="h-4 w-4 text-primary" />
            <Label htmlFor="finance-sync">
              Track expenses in Finance Tracker
            </Label>
          </div>
          
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Switch
              id="finance-sync"
              checked={enabled}
              onCheckedChange={handleToggle}
            />
          )}
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          When enabled, all payments you make in this group will be automatically tracked in your Finance Tracker
          for better personal expense management.
        </p>
      </CardContent>
    </Card>
  );
};

export default FinanceIntegrationSettings;
