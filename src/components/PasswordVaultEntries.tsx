
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Trash, Edit, Plus, ClipboardCopy, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Vault,
  PasswordEntry,
  addPasswordEntry,
  updatePasswordEntry,
  deletePasswordEntry
} from "@/utils/storageUtils";

interface PasswordVaultEntriesProps {
  vault: Vault;
  masterPassword: string;
  setVault: React.Dispatch<React.SetStateAction<Vault | null>>;
}

const PasswordVaultEntries: React.FC<PasswordVaultEntriesProps> = ({ 
  vault, 
  masterPassword,
  setVault 
}) => {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // State for showing/hiding passwords
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  
  // State for the new entry
  const [newEntry, setNewEntry] = useState<Partial<PasswordEntry>>({
    label: '',
    username: '',
    password: '',
    notes: '',
  });
  
  // Toggle password visibility for an entry
  const togglePasswordVisibility = (entryId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }));
  };
  
  // Copy a password to clipboard
  const copyToClipboard = (password: string) => {
    navigator.clipboard.writeText(password)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Password copied successfully!",
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard.",
          variant: "destructive",
        });
      });
  };
  
  // Handle adding a new entry
  const handleAddEntry = () => {
    if (!newEntry.label || !newEntry.password) {
      toast({
        title: "Missing fields",
        description: "Label and password are required.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updatedVault = addPasswordEntry(
        newEntry as Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>,
        vault,
        masterPassword
      );
      
      setVault(updatedVault);
      setNewEntry({
        label: '',
        username: '',
        password: '',
        notes: '',
      });
      setIsAdding(false);
      
      toast({
        title: "Entry added",
        description: "Password entry added successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error adding entry",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };
  
  // Handle updating an entry
  const handleUpdateEntry = (updatedEntry: PasswordEntry) => {
    try {
      const updatedVault = updatePasswordEntry(updatedEntry, vault, masterPassword);
      setVault(updatedVault);
      setEditingId(null);
      
      toast({
        title: "Entry updated",
        description: "Password entry updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error updating entry",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };
  
  // Handle deleting an entry
  const handleDeleteEntry = (entryId: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      try {
        const updatedVault = deletePasswordEntry(entryId, vault, masterPassword);
        setVault(updatedVault);
        
        toast({
          title: "Entry deleted",
          description: "Password entry deleted successfully!",
        });
      } catch (error: any) {
        toast({
          title: "Error deleting entry",
          description: error.message || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    }
  };
  
  // Render an editable entry
  const renderEditableEntry = (entry: PasswordEntry) => {
    const [editedEntry, setEditedEntry] = useState<PasswordEntry>({...entry});
    
    return (
      <Card key={entry.id} className="p-4 mb-4">
        <div className="space-y-2">
          <div>
            <label className="text-sm font-medium">Label</label>
            <Input
              value={editedEntry.label}
              onChange={(e) => setEditedEntry({...editedEntry, label: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Username/Email</label>
            <Input
              value={editedEntry.username || ''}
              onChange={(e) => setEditedEntry({...editedEntry, username: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="flex">
              <Input
                type={visiblePasswords[entry.id] ? 'text' : 'password'}
                className="flex-1"
                value={editedEntry.password}
                onChange={(e) => setEditedEntry({...editedEntry, password: e.target.value})}
              />
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => togglePasswordVisibility(entry.id)}
              >
                {visiblePasswords[entry.id] ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={editedEntry.notes || ''}
              onChange={(e) => setEditedEntry({...editedEntry, notes: e.target.value})}
              rows={2}
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-2">
            <Button 
              variant="outline"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleUpdateEntry(editedEntry)}
            >
              <Save size={16} className="mr-1" />
              Save
            </Button>
          </div>
        </div>
      </Card>
    );
  };
  
  // Render a regular entry
  const renderEntry = (entry: PasswordEntry) => {
    return (
      <Card key={entry.id} className="p-4 mb-4 animate-slide-up">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium text-lg">{entry.label}</h3>
            {entry.username && (
              <p className="text-sm text-muted-foreground">{entry.username}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingId(entry.id)}
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteEntry(entry.id)}
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="flex items-center">
            <div className="flex-1">
              <Input
                type={visiblePasswords[entry.id] ? 'text' : 'password'}
                value={entry.password}
                readOnly
                className="password-input"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => togglePasswordVisibility(entry.id)}
            >
              {visiblePasswords[entry.id] ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="ml-1"
              onClick={() => copyToClipboard(entry.password)}
            >
              <ClipboardCopy size={16} />
            </Button>
          </div>
          
          {entry.notes && (
            <div className="mt-2 text-sm text-muted-foreground">
              <p>{entry.notes}</p>
            </div>
          )}
        </div>
      </Card>
    );
  };
  
  return (
    <div className="space-y-4">
      {vault.entries.length === 0 && !isAdding && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No passwords saved yet.</p>
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={16} className="mr-1" />
            Add Your First Password
          </Button>
        </Card>
      )}
      
      {/* List of entries */}
      <div className="space-y-2">
        {vault.entries.map((entry) => (
          editingId === entry.id 
            ? renderEditableEntry(entry)
            : renderEntry(entry)
        ))}
      </div>
      
      {/* Add new entry form */}
      {isAdding ? (
        <Card className="p-4 animate-fade-in">
          <h3 className="font-medium text-lg mb-3">Add New Password</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Label</label>
              <Input
                value={newEntry.label}
                onChange={(e) => setNewEntry({...newEntry, label: e.target.value})}
                placeholder="e.g. Gmail, Netflix"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Username/Email</label>
              <Input
                value={newEntry.username}
                onChange={(e) => setNewEntry({...newEntry, username: e.target.value})}
                placeholder="username@example.com"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={newEntry.password}
                onChange={(e) => setNewEntry({...newEntry, password: e.target.value})}
                placeholder="Enter password"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Textarea
                value={newEntry.notes}
                onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                placeholder="Add any additional notes here..."
                rows={2}
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-2">
              <Button 
                variant="outline"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddEntry}>
                <Save size={16} className="mr-1" />
                Save
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="flex justify-end">
          <Button 
            onClick={() => setIsAdding(true)}
          >
            <Plus size={16} className="mr-1" />
            Add New Password
          </Button>
        </div>
      )}
    </div>
  );
};

export default PasswordVaultEntries;
