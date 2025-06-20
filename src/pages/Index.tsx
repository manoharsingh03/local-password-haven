
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ThemeToggle from '@/components/ThemeToggle';
import { Lock, LogIn, Shield, Key } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const handleLogin = () => {
    navigate('/login');
  };

  // Get user display name (full name or email)
  const userDisplayName = isLoggedIn 
    ? user?.user_metadata?.full_name || user?.email || 'User'
    : '';
    
  // First letter of name or email for avatar fallback
  const fallbackText = userDisplayName ? userDisplayName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header with auth controls */}
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">KeyCoin</h2>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 hover:bg-secondary/50 px-3 py-1.5 rounded-full transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                    <AvatarFallback>{fallbackText}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline font-medium">{userDisplayName.split(' ')[0]}</span>
                </Link>
              </div>
            ) : (
              <Button onClick={handleLogin} size="sm" className="animate-fade-in">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
            <ThemeToggle />
          </div>
        </header>
        
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">KeyCoin</h1>
          <p className="text-xl text-muted-foreground">
            Your secure password manager — generate, store & protect your passwords
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Password Manager Card */}
          <Card className="glass glass-hover transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Lock size={48} className="text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl text-center">🔐 Password Manager</CardTitle>
              <CardDescription className="text-center text-lg">
                Generate strong passwords and store them securely with military-grade encryption.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center p-4">
                  <Key className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium mb-1">Generate</h3>
                  <p className="text-sm text-muted-foreground">Create strong, unique passwords</p>
                </div>
                <div className="flex flex-col items-center p-4">
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium mb-1">Secure</h3>
                  <p className="text-sm text-muted-foreground">AES encryption protects your data</p>
                </div>
                <div className="flex flex-col items-center p-4">
                  <Lock className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium mb-1">Store</h3>
                  <p className="text-sm text-muted-foreground">Organize all your passwords safely</p>
                </div>
              </div>
              <p className="mb-6 text-muted-foreground">
                Never forget a password again. Generate cryptographically secure passwords and store them in your encrypted vault.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/password" className="w-full">
                <Button size="lg" className="w-full transition-all hover:shadow-neon">
                  Open Password Manager
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground animate-fade-in" style={{animationDelay: '200ms'}}>
          <p>All your passwords are encrypted with AES-256 and {isLoggedIn ? 'stored securely in your account' : 'never leave your device without your permission'}.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
