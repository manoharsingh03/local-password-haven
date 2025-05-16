
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileCard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const avatarUrl = user?.user_metadata?.avatar_url || null;
  const fullName = user?.user_metadata?.full_name || 'User';
  const email = user?.email || '';
  
  // First letter of name or email for avatar fallback
  const fallbackText = fullName ? fullName.charAt(0) : email.charAt(0).toUpperCase();
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          <AvatarImage src={avatarUrl || ''} alt={fullName} />
          <AvatarFallback className="text-2xl">{fallbackText}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{fullName}</CardTitle>
          <CardDescription>{email}</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="text-sm text-muted-foreground pt-2">
        <div className="flex justify-between items-center">
          <p>Account type: {user?.app_metadata?.provider || 'Email'}</p>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button 
          variant="outline" 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? 'Logging out...' : 'Log Out'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
