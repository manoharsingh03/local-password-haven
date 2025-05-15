
import React from 'react';
import AppContainer from '@/components/AppContainer';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <ThemeToggle />
      <AppContainer />
    </div>
  );
};

export default Index;
