import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MetersPage from './pages/MetersPage';
import ForecastPage from './pages/ForecastPage';
import TheftPage from './pages/TheftPage';
import SubstationsPage from './pages/SubstationsPage';
import OutagesPage from './pages/OutagesPage';
import BillingPage from './pages/BillingPage';
import LoginPage from './pages/LoginPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  console.log('[ROUTER] ProtectedRoute render:', { user: user?.email, loading });
  
  if (loading) {
    console.log('[ROUTER] Showing loading spinner');
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-cyan-400">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    console.log('[ROUTER] No user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('[ROUTER] User authenticated, showing protected content');
  return children;
}

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="meters" element={<MetersPage />} />
          <Route path="forecast" element={<ForecastPage />} />
          <Route path="theft" element={<TheftPage />} />
          <Route path="substations" element={<SubstationsPage />} />
          <Route path="outages" element={<OutagesPage />} />
          <Route path="billing" element={<BillingPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}