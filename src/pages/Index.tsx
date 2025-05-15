
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ThemeToggle from '@/components/ThemeToggle';
import { Key, Wallet } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex justify-end mb-2">
          <ThemeToggle />
        </div>
        
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">KeyCoin</h1>
          <p className="text-xl text-muted-foreground">
            Your vault for passwords and personal finances by mona darling
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Password Manager Card */}
          <Card className="glass glass-hover transition-all duration-300">
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
                <Button size="lg" className="w-full">
                  Open Password Manager
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Finance Tracker Card */}
          <Card className="glass glass-hover transition-all duration-300">
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
                <Button size="lg" className="w-full">
                  Open Finance Tracker
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>All data is stored locally on your device and never sent to any server.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
