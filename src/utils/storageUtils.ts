
import { encryptData, decryptData, hashMasterPassword } from './encryptionUtils';

// Type definitions
export interface PasswordEntry {
  id: string;
  label: string;
  username?: string;
  password: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vault {
  masterPasswordHash: string;
  entries: PasswordEntry[];
}

const VAULT_KEY = 'password_vault';

// Initialize the vault if it doesn't exist
export const initializeVault = (masterPassword: string): void => {
  // Check if vault already exists
  const storedVault = localStorage.getItem(VAULT_KEY);
  if (storedVault) {
    throw new Error('Vault already exists. Please unlock it instead.');
  }

  // Create new empty vault
  const newVault: Vault = {
    masterPasswordHash: hashMasterPassword(masterPassword),
    entries: [],
  };

  // Encrypt and store the vault
  const encryptedVault = encryptData(newVault, masterPassword);
  localStorage.setItem(VAULT_KEY, encryptedVault);
};

// Get the vault using the master password
export const getVault = (masterPassword: string): Vault => {
  const storedVault = localStorage.getItem(VAULT_KEY);
  if (!storedVault) {
    throw new Error('No vault found. Please create one first.');
  }

  try {
    return decryptData(storedVault, masterPassword);
  } catch (error) {
    throw new Error('Failed to unlock vault. Incorrect master password?');
  }
};

// Save the vault with the master password
export const saveVault = (vault: Vault, masterPassword: string): void => {
  const encryptedVault = encryptData(vault, masterPassword);
  localStorage.setItem(VAULT_KEY, encryptedVault);
};

// Check if a vault already exists
export const vaultExists = (): boolean => {
  return localStorage.getItem(VAULT_KEY) !== null;
};

// Add a new password entry
export const addPasswordEntry = (
  entry: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>,
  vault: Vault,
  masterPassword: string
): Vault => {
  const now = new Date().toISOString();
  const newEntry: PasswordEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  const updatedVault: Vault = {
    ...vault,
    entries: [...vault.entries, newEntry],
  };

  saveVault(updatedVault, masterPassword);
  return updatedVault;
};

// Update an existing password entry
export const updatePasswordEntry = (
  updatedEntry: PasswordEntry,
  vault: Vault,
  masterPassword: string
): Vault => {
  const updatedEntries = vault.entries.map((entry) =>
    entry.id === updatedEntry.id
      ? { ...updatedEntry, updatedAt: new Date().toISOString() }
      : entry
  );

  const updatedVault: Vault = {
    ...vault,
    entries: updatedEntries,
  };

  saveVault(updatedVault, masterPassword);
  return updatedVault;
};

// Delete a password entry
export const deletePasswordEntry = (
  entryId: string,
  vault: Vault,
  masterPassword: string
): Vault => {
  const updatedEntries = vault.entries.filter((entry) => entry.id !== entryId);

  const updatedVault: Vault = {
    ...vault,
    entries: updatedEntries,
  };

  saveVault(updatedVault, masterPassword);
  return updatedVault;
};

// Export vault as encrypted file
export const exportVault = (vault: Vault, masterPassword: string): string => {
  return encryptData(vault, masterPassword);
};

// Import vault from encrypted file
export const importVault = (encryptedData: string, masterPassword: string): Vault => {
  try {
    const importedVault = decryptData(encryptedData, masterPassword);
    
    // Validate that the imported data has the correct structure
    if (!importedVault.masterPasswordHash || !Array.isArray(importedVault.entries)) {
      throw new Error('Invalid vault format');
    }
    
    return importedVault;
  } catch (error) {
    throw new Error('Failed to import vault. Incorrect password or invalid format.');
  }
};
