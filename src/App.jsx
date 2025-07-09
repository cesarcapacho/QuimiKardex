
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ReagentsPage from '@/pages/ReagentsPage';
import KardexPage from '@/pages/KardexPage';
import Layout from '@/components/Layout';
import { Toaster } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react'; // Import loader icon

function App() {
  return (
    <AuthProvider>
      <Router>
        <Main />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

function Main() {
  const { user, loading } = useAuth();

  // Show a proper loading indicator while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-secondary dark:bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary dark:text-blue-400" />
        <span className="ml-4 text-lg text-muted-foreground">Cargando aplicación...</span>
      </div>
    );
  }

  // Once loading is finished, render routes based on auth state
  return (
    <Routes>
      {/* Login Route: Only accessible if not logged in */}
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/" replace />}
      />

      {/* Protected Routes: Require user to be logged in */}
      <Route
        path="/"
        element={user ? <Layout><DashboardPage /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/reagents"
        element={user ? <Layout><ReagentsPage /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/kardex"
        element={user ? <Layout><KardexPage /></Layout> : <Navigate to="/login" replace />}
      />

      {/* Catch-all Route: Redirects to login or home based on auth state */}
      <Route
        path="*"
        element={<Navigate to={user ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
