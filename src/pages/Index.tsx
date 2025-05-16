
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ThemeToggle from '@/components/ThemeToggle';
import { Key, Wallet, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Get user display name (full name or email)
  const userDisplayName = isLoggedIn 
    ? user?.user_metadata?.full_name || user?.email || 'User'
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header with auth controls */}
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">KeyCoin</h2>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link to="/profile">
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {userDisplayName.split(' ')[0]}
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} size="icon">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={handleLogin} className="animate-fade-in">
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
            Your vault for passwords and personal finances
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Password Manager Card */}
          <Card className="glass glass-hover transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Key size={36} className="text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Password Manager</CardTitle>
              <CardDescription className="text-center">
                Generate and store passwords securely in your local vault.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6 text-muted-foreground">
                Create strong passwords, evaluate their strength, and keep them in an encrypted vault on your device.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/password">
                <Button size="lg" className="w-full transition-all hover:shadow-neon">
                  Open Password Manager
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Finance Tracker Card */}
          <Card className="glass glass-hover transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in" style={{animationDelay: '100ms'}}>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Wallet size={36} className="text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Finance Tracker</CardTitle>
              <CardDescription className="text-center">
                Track your income, expenses, and budgets — all locally.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6 text-muted-foreground">
                Monitor your spending, track financial goals, and visualize your money flow with interactive charts.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/finance">
                <Button size="lg" className="w-full transition-all hover:shadow-neon">
                  Open Finance Tracker
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground animate-fade-in" style={{animationDelay: '200ms'}}>
          <p>All data is stored {isLoggedIn ? 'in your encrypted Supabase account' : 'locally on your device and never sent to any server'}.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
