
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, ListFilter, Lock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import TransactionList from "./TransactionList";
import FinanceVault from "./FinanceVault";

const FinanceContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="ml-2">
            <Home className="h-4 w-4 mr-2" />
            Back to Password Manager
          </Button>
        </Link>
      </div>

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Finance Tracker</h1>
        <p className="text-muted-foreground">Track, visualize, and manage your personal finances</p>
      </header>

      <Tabs 
        defaultValue="dashboard" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-center mb-6">
          <TabsList className="glass">
            <TabsTrigger value="dashboard" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center">
              <ListFilter className="mr-2 h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="vault" className="flex items-center">
              <Lock className="mr-2 h-4 w-4" />
              Vault
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="animate-fade-in">
          <Dashboard />
        </TabsContent>
        
        <TabsContent value="transactions" className="animate-fade-in">
          <TransactionList />
        </TabsContent>
        
        <TabsContent value="vault" className="animate-fade-in">
          <FinanceVault />
        </TabsContent>
      </Tabs>

      <footer className="mt-10 text-center text-sm text-muted-foreground">
        <p>Your financial data never leaves this device. All data is stored locally and can be encrypted.</p>
      </footer>
    </div>
  );
};

export default FinanceContainer;
