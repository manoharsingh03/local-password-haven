
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Lock, ArrowLeft } from "lucide-react";
import ThemeToggle from '@/components/ThemeToggle';
import GroupDetailContainer from '@/components/billsplitter/GroupDetailContainer';

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user, signOut } = useAuth();
  
  const userDisplayName = user?.user_metadata?.full_name || user?.email || 'User';
  const fallbackText = userDisplayName ? userDisplayName.charAt(0).toUpperCase() : 'U';

  if (!groupId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Group not found</h1>
          <Link to="/billsplitter">
            <Button>Back to Bill Splitter</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-4">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl font-bold">KeyCoin</Link>
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/billsplitter">
              <Button variant="ghost" size="sm" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Groups
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/password">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Lock className="h-4 w-4" />
              </Button>
            </Link>
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
        <GroupDetailContainer groupId={groupId} />
      </div>
    </div>
  );
};

export default GroupDetail;
