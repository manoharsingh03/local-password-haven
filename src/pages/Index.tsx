
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ThemeToggle from '@/components/ThemeToggle';
import { Wallet, Users, LogIn, Lock } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header with auth controls */}
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">KeyCoin</h2>
          <div className="flex items-center gap-3">
            <Link to="/password">
              <Button variant="ghost" size="icon" className="rounded-full" title="Password Manager">
                <Lock className="h-4 w-4" />
              </Button>
            </Link>
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
            Secure everything that matters — passwords, finances & bills
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Finance Tracker Card */}
          <Card className="glass glass-hover transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Wallet size={48} className="text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">💰 Finance Tracker</CardTitle>
              <CardDescription className="text-center">
                Track your income, expenses, and budgets — all securely stored.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6 text-muted-foreground">
                Monitor your spending, track financial goals, and visualize your money flow with interactive charts and insights.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/finance" className="w-full">
                <Button size="lg" className="w-full transition-all hover:shadow-neon">
                  Open Finance Tracker
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Bill Splitter Card */}
          <Card className="glass glass-hover transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in" style={{animationDelay: '100ms'}}>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Users size={48} className="text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">🤝 Bill Splitter</CardTitle>
              <CardDescription className="text-center">
                Split bills and expenses easily with friends, family, and roommates.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6 text-muted-foreground">
                Create groups, track shared expenses, and calculate who owes what with smart splitting algorithms.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/billsplitter" className="w-full">
                <Button size="lg" className="w-full transition-all hover:shadow-neon">
                  Open Bill Splitter
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground animate-fade-in" style={{animationDelay: '200ms'}}>
          <p>All data is stored {isLoggedIn ? 'in your encrypted Supabase account' : 'securely and never sent to any server without your permission'}.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
