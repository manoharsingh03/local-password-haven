
import React from 'react';
import { Link } from 'react-router-dom';
import AppContainer from '@/components/AppContainer';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const PasswordManager = () => {
  const { user, signOut } = useAuth();
  
  const userDisplayName = user?.user_metadata?.full_name || user?.email || 'User';
  const fallbackText = userDisplayName ? userDisplayName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-4">
        <header className="flex items-center justify-between mb-6">
          <Link to="/" className="text-2xl font-bold">KeyCoin</Link>
          <div className="flex items-center gap-3">
            {user && (
              <>
                <Link to="/profile" className="flex items-center gap-2 hover:bg-secondary/50 px-3 py-1.5 rounded-full transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                    <AvatarFallback>{fallbackText}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline font-medium">{userDisplayName.split(' ')[0]}</span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => signOut()}
                  className="rounded-full"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
            <ThemeToggle />
          </div>
        </header>
        <AppContainer />
      </div>
    </div>
  );
};

export default PasswordManager;
