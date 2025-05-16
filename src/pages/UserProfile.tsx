
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, ArrowLeft, User, Mail, Calendar } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import ThemeToggle from '@/components/ThemeToggle';
import { format } from 'date-fns';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const avatarUrl = user?.user_metadata?.avatar_url || null;
  const fullName = user?.user_metadata?.full_name || 'User';
  const email = user?.email || '';
  const provider = user?.app_metadata?.provider || 'Email';
  const createdAt = user?.created_at ? format(new Date(user.created_at), 'PPP') : 'Unknown';
  
  // First letter of name or email for avatar fallback
  const fallbackText = fullName ? fullName.charAt(0) : email.charAt(0).toUpperCase();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back
          </Button>
          <ThemeToggle />
        </div>
        
        <Card className="shadow-lg animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl">User Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 border-2 border-primary/20">
                  <AvatarImage src={avatarUrl || ''} alt={fullName} />
                  <AvatarFallback className="text-4xl">{fallbackText}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <User className="inline-block mr-2 h-4 w-4" />
                    Full Name
                  </p>
                  <p className="text-xl font-medium">{fullName}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Mail className="inline-block mr-2 h-4 w-4" />
                    Email
                  </p>
                  <p className="text-xl">{email}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Login Provider</p>
                  <div className="flex items-center gap-2">
                    {provider === 'google' && (
                      <svg className="h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                      </svg>
                    )}
                    <span className="text-lg">{provider}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="inline-block mr-2 h-4 w-4" />
                    Account Created
                  </p>
                  <p>{createdAt}</p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end pt-4 border-t">
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
