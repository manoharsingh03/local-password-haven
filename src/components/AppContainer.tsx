
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Copy } from "lucide-react";
import PasswordGenerator from "./PasswordGenerator";
import PasswordVault from "./PasswordVault";
import ProfileCard from "./ProfileCard";
import { useAuth } from '@/context/AuthContext';

const AppContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("generator");
  const { isLoggedIn } = useAuth();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Password Manager</h1>
        <p className="text-muted-foreground">Generate, evaluate, and securely store your passwords</p>
      </header>

      {isLoggedIn && (
        <div className="mb-6">
          <ProfileCard />
        </div>
      )}

      <Tabs 
        defaultValue="generator" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-center mb-6">
          <TabsList className="glass">
            <TabsTrigger value="generator" className="flex items-center">
              <Copy className="mr-2 h-4 w-4" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="vault" className="flex items-center">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Vault
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="generator" className="flex justify-center animate-fade-in">
          <PasswordGenerator />
        </TabsContent>
        
        <TabsContent value="vault" className="animate-fade-in">
          <PasswordVault />
        </TabsContent>
      </Tabs>

      <footer className="mt-10 text-center text-sm text-muted-foreground">
        <p>Your passwords {isLoggedIn ? 'are securely encrypted and stored' : 'never leave this device. All data is encrypted and stored locally'}.</p>
      </footer>
    </div>
  );
};

export default AppContainer;
