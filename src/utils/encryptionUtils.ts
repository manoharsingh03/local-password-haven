
import CryptoJS from 'crypto-js';

// Encrypt data with AES using a master password
export const encryptData = (data: any, masterPassword: string): string => {
  try {
    const jsonData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonData, masterPassword).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Decrypt data with AES using a master password
export const decryptData = (encryptedData: string, masterPassword: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, masterPassword);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data. Incorrect master password?');
  }
};

// Generate a hash of the master password for verification
export const hashMasterPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

// Verify the master password against a stored hash
export const verifyMasterPassword = (password: string, storedHash: string): boolean => {
  const passwordHash = hashMasterPassword(password);
  return passwordHash === storedHash;
};
