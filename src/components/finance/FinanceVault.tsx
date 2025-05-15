
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Unlock, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { 
  financeVaultExists, 
  initializeFinanceVault, 
  getFinanceVault, 
  saveFinanceVault, 
  FinanceVault as FinanceVaultType 
} from '@/utils/financeUtils';
import { verifyMasterPassword } from '@/utils/encryptionUtils';

const FinanceVault: React.FC = () => {
  const [vault, setVault] = useState<FinanceVaultType | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [vaultExists, setVaultExists] = useState(false);
  
  useEffect(() => {
    // Check if vault exists
    const exists = financeVaultExists();
    setVaultExists(exists);
  }, []);
  
  const handleCreateVault = async () => {
    if (!masterPassword) {
      toast({
        title: "Password required",
        description: "Please enter a master password",
        variant: "destructive",
      });
      return;
    }
    
    if (masterPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      initializeFinanceVault(masterPassword);
      const newVault = getFinanceVault(masterPassword);
      setVault(newVault);
      setIsUnlocked(true);
      toast({
        title: "Vault created",
        description: "Your finance vault has been created and unlocked",
      });
      setVaultExists(true);
    } catch (error: any) {
      toast({
        title: "Failed to create vault",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUnlockVault = async () => {
    if (!masterPassword) {
      toast({
        title: "Password required",
        description: "Please enter your master password",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const unlocked = getFinanceVault(masterPassword);
      setVault(unlocked);
      setIsUnlocked(true);
      toast({
        title: "Vault unlocked",
        description: "Your finance vault has been unlocked",
      });
    } catch (error: any) {
      toast({
        title: "Failed to unlock vault",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLockVault = () => {
    setVault(null);
    setIsUnlocked(false);
    setMasterPassword('');
    setConfirmPassword('');
    toast({
      title: "Vault locked",
      description: "Your finance vault has been locked",
    });
  };
  
  if (isUnlocked && vault) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Finance Vault (Unlocked)</CardTitle>
              <CardDescription>Your finance data is securely stored</CardDescription>
            </div>
            <Button onClick={handleLockVault} variant="outline" size="sm">
              <Lock className="mr-2 h-4 w-4" />
              Lock Vault
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="mb-4">Your vault contains:</p>
              <ul className="space-y-1">
                <li>• {vault.transactions.length} transactions</li>
                <li>• {vault.transactions.filter(t => t.type === 'income').length} income entries</li>
                <li>• {vault.transactions.filter(t => t.type === 'expense').length} expense entries</li>
              </ul>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>All your finance data is securely encrypted using AES-256.</p>
              <p>Make sure to remember your master password as it cannot be recovered.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center min-h-[50vh] animate-fade-in">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{vaultExists ? 'Unlock Finance Vault' : 'Create Finance Vault'}</CardTitle>
          <CardDescription>
            {vaultExists ? 
              'Enter your master password to unlock your vault' : 
              'Set a master password to encrypt your financial data'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Master Password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              disabled={loading}
            />
            
            {!vaultExists && (
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            )}
          </div>
          
          <Button 
            className="w-full" 
            onClick={vaultExists ? handleUnlockVault : handleCreateVault}
            disabled={loading}
          >
            {loading ? 'Processing...' : vaultExists ? (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                Unlock Vault
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Vault
              </>
            )}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Your data is securely encrypted using AES-256.</p>
            <p>Don't lose your master password - it cannot be recovered!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceVault;
