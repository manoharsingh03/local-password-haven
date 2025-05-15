
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  vaultExists, 
  initializeVault, 
  getVault,
  Vault as VaultType
} from "@/utils/storageUtils";
import { verifyMasterPassword } from "@/utils/encryptionUtils";
import PasswordVaultEntries from './PasswordVaultEntries';

const PasswordVault: React.FC = () => {
  const { toast } = useToast();
  const [masterPassword, setMasterPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [vault, setVault] = useState<VaultType | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(!vaultExists());
  
  // Handle creating a new vault
  const handleCreateVault = () => {
    if (masterPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Master password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    if (masterPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      initializeVault(masterPassword);
      const newVault = getVault(masterPassword);
      setVault(newVault);
      setIsLocked(false);
      toast({
        title: "Vault created",
        description: "Your password vault has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating vault",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };
  
  // Handle unlocking an existing vault
  const handleUnlockVault = () => {
    try {
      const loadedVault = getVault(masterPassword);
      setVault(loadedVault);
      setIsLocked(false);
      toast({
        title: "Vault unlocked",
        description: "Your password vault has been unlocked.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to unlock vault",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };
  
  // Handle locking the vault
  const handleLockVault = () => {
    setVault(null);
    setMasterPassword('');
    setConfirmPassword('');
    setIsLocked(true);
  };
  
  // Switch between create and unlock modes
  const toggleMode = () => {
    setIsCreating(!isCreating);
    setMasterPassword('');
    setConfirmPassword('');
  };
  
  if (!isLocked && vault) {
    return (
      <div className="animate-fade-in w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Password Vault</h2>
          <Button variant="outline" onClick={handleLockVault}>
            Lock Vault
          </Button>
        </div>
        <PasswordVaultEntries vault={vault} masterPassword={masterPassword} setVault={setVault} />
      </div>
    );
  }
  
  return (
    <Card className="animate-fade-in glass w-full max-w-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isCreating ? "Create Password Vault" : "Unlock Password Vault"}
      </h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="masterPassword">Master Password</Label>
          <Input
            id="masterPassword"
            type="password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            placeholder="Enter your master password"
          />
        </div>
        
        {isCreating && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your master password"
            />
          </div>
        )}
        
        <Button 
          className="w-full transition-all hover:shadow-neon"
          onClick={isCreating ? handleCreateVault : handleUnlockVault}
        >
          {isCreating ? "Create Vault" : "Unlock Vault"}
        </Button>
        
        <div className="text-center mt-4">
          <button 
            onClick={toggleMode} 
            className="text-sm text-primary hover:underline"
          >
            {isCreating 
              ? "Already have a vault? Unlock it" 
              : "Need to create a vault? Set up here"}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PasswordVault;
