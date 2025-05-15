
import React from 'react';
import FinanceContainer from '@/components/finance/FinanceContainer';
import ThemeToggle from '@/components/ThemeToggle';

const FinanceTracker = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <ThemeToggle />
      <FinanceContainer />
    </div>
  );
};

export default FinanceTracker;
