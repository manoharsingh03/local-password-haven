
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Clipboard, ClipboardCopy } from "lucide-react";
import { 
  generatePassword, 
  evaluatePasswordStrength, 
  PasswordStrength, 
  strengthColors, 
  strengthMessages 
} from "@/utils/passwordUtils";
import { useToast } from '@/hooks/use-toast';

const PasswordGenerator: React.FC = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState<string>('');
  const [passwordLength, setPasswordLength] = useState<number>(16);
  const [copied, setCopied] = useState<boolean>(false);
  const [options, setOptions] = useState({
    useUppercase: true,
    useLowercase: true,
    useNumbers: true,
    useSymbols: true,
  });

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(PasswordStrength.WEAK);

  // Generate initial password on component mount
  useEffect(() => {
    generateNewPassword();
  }, []);

  // Update password strength when password changes
  useEffect(() => {
    const strength = evaluatePasswordStrength(password, options);
    setPasswordStrength(strength);
  }, [password, options]);

  // Generate new password based on current options
  const generateNewPassword = () => {
    const newPassword = generatePassword(passwordLength, options);
    setPassword(newPassword);
    setCopied(false);
  };

  // Handle option changes
  const handleOptionChange = (option: keyof typeof options, value: boolean) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [option]: value,
    }));
  };

  // Copy password to clipboard
  const copyToClipboard = () => {
    if (!password) return;
    
    navigator.clipboard.writeText(password)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Password copied successfully!",
        });
        
        // Reset copied status after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard.",
          variant: "destructive",
        });
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="animate-fade-in glass rounded-xl p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Generate Password</h2>
      
      {/* Password Display */}
      <div className="relative mb-6">
        <div className="flex items-center bg-background dark:bg-black/40 rounded-lg border border-input p-3 mb-2">
          <input
            type="text"
            value={password}
            readOnly
            className="password-input flex-1 bg-transparent border-none focus:outline-none text-lg"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className="relative ml-2"
          >
            {copied ? (
              <Clipboard className="h-5 w-5 text-primary animate-pulse-scale" />
            ) : (
              <ClipboardCopy className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {/* Strength indicator */}
        <div className="mb-3">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${strengthColors[passwordStrength]}`}
              style={{ width: `${(Object.values(PasswordStrength).indexOf(passwordStrength) + 1) * 25}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1 text-muted-foreground">
            {strengthMessages[passwordStrength]}
          </p>
        </div>
      </div>

      {/* Password Options */}
      <div className="space-y-6">
        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Password Length</label>
            <span className="text-sm font-mono">{passwordLength}</span>
          </div>
          <Slider
            value={[passwordLength]}
            min={6}
            max={30}
            step={1}
            onValueChange={(values) => setPasswordLength(values[0])}
          />
        </div>

        {/* Character Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Include Uppercase</label>
            <Switch
              checked={options.useUppercase}
              onCheckedChange={(checked) => handleOptionChange('useUppercase', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Include Lowercase</label>
            <Switch
              checked={options.useLowercase}
              onCheckedChange={(checked) => handleOptionChange('useLowercase', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Include Numbers</label>
            <Switch
              checked={options.useNumbers}
              onCheckedChange={(checked) => handleOptionChange('useNumbers', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Include Symbols</label>
            <Switch
              checked={options.useSymbols}
              onCheckedChange={(checked) => handleOptionChange('useSymbols', checked)}
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateNewPassword}
          className="w-full transition-all hover:shadow-neon"
        >
          Generate New Password
        </Button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
