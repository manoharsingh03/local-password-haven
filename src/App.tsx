
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FinanceTracker from "./pages/FinanceTracker";
import PasswordManager from "./pages/PasswordManager";
import BillSplitter from "./pages/BillSplitter";
import GroupDetail from "./pages/GroupDetail";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import UserProfile from "./pages/UserProfile";

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

// Create a stable query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/finance" element={<FinanceTracker />} />
    <Route path="/password" element={<PasswordManager />} />
    <Route path="/billsplitter" element={<BillSplitter />} />
    <Route path="/billsplitter/group/:groupId" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
    <Route path="/login" element={<Login />} />
    <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
    <Route path="/auth/callback" element={<AuthCallback />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
