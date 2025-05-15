
// Password strength levels
export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong',
  VERY_STRONG = 'very-strong',
}

// Password strength messages
export const strengthMessages = {
  [PasswordStrength.WEAK]: 'Weak: Too short or too simple',
  [PasswordStrength.MEDIUM]: 'Medium: Add more variety',
  [PasswordStrength.STRONG]: 'Strong: Good password',
  [PasswordStrength.VERY_STRONG]: 'Very Strong: Excellent password',
};

// Password strength colors
export const strengthColors = {
  [PasswordStrength.WEAK]: 'bg-strength-weak',
  [PasswordStrength.MEDIUM]: 'bg-strength-medium',
  [PasswordStrength.STRONG]: 'bg-strength-strong',
  [PasswordStrength.VERY_STRONG]: 'bg-strength-veryStrong',
};

// Function to generate random password
export const generatePassword = (
  length: number,
  options: {
    useUppercase: boolean;
    useLowercase: boolean;
    useNumbers: boolean;
    useSymbols: boolean;
  }
): string => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  let availableChars = '';
  if (options.useUppercase) availableChars += uppercaseChars;
  if (options.useLowercase) availableChars += lowercaseChars;
  if (options.useNumbers) availableChars += numberChars;
  if (options.useSymbols) availableChars += symbolChars;

  // Default to lowercase if nothing is selected
  if (availableChars === '') availableChars = lowercaseChars;

  let password = '';
  const charactersLength = availableChars.length;

  // Generate password
  for (let i = 0; i < length; i++) {
    password += availableChars.charAt(Math.floor(Math.random() * charactersLength));
  }

  return password;
};

// Function to evaluate password strength
export const evaluatePasswordStrength = (
  password: string,
  options: {
    useUppercase: boolean;
    useLowercase: boolean;
    useNumbers: boolean;
    useSymbols: boolean;
  }
): PasswordStrength => {
  if (!password) return PasswordStrength.WEAK;

  // Calculate score based on character types and length
  let score = 0;
  
  // Length score
  if (password.length >= 16) {
    score += 4;
  } else if (password.length >= 12) {
    score += 3;
  } else if (password.length >= 8) {
    score += 2;
  } else if (password.length >= 6) {
    score += 1;
  }

  // Character type scores
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  if (hasLower && options.useLowercase) score += 1;
  if (hasUpper && options.useUppercase) score += 1;
  if (hasNumber && options.useNumbers) score += 1;
  if (hasSymbol && options.useSymbols) score += 1;

  // Determine strength based on score
  if (score >= 6) return PasswordStrength.VERY_STRONG;
  if (score >= 4) return PasswordStrength.STRONG;
  if (score >= 2) return PasswordStrength.MEDIUM;
  return PasswordStrength.WEAK;
};
