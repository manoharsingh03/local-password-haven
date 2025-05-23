
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import GroupsList from './GroupsList';
import CreateGroupDialog from './CreateGroupDialog';

const BillSplitterContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("groups");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl text-center">
        <h1 className="text-4xl font-bold mb-4">Bill Splitter</h1>
        <p className="text-muted-foreground mb-6">Please log in to create and manage your bill splitting groups.</p>
        <Button onClick={() => window.location.href = '/login'}>
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Bill Splitter</h1>
        <p className="text-muted-foreground">Split bills and expenses with friends, family, and roommates</p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => setShowCreateGroup(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Group
        </Button>
      </div>

      <Tabs 
        defaultValue="groups" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-center mb-6">
          <TabsList className="glass">
            <TabsTrigger value="groups" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              My Groups
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="groups" className="animate-fade-in">
          <GroupsList />
        </TabsContent>
        
        <TabsContent value="dashboard" className="animate-fade-in">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Overall Dashboard</h3>
            <p className="text-muted-foreground">View your overall balances across all groups</p>
          </div>
        </TabsContent>
      </Tabs>

      <CreateGroupDialog 
        open={showCreateGroup}
        onOpenChange={setShowCreateGroup}
      />

      <footer className="mt-10 text-center text-sm text-muted-foreground">
        <p>All your bill splitting data is securely stored and encrypted.</p>
      </footer>
    </div>
  );
};

export default BillSplitterContainer;
