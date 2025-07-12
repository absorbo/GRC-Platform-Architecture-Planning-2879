import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { NIS2Provider } from './contexts/NIS2Context';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ResellerDashboard from './pages/ResellerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import './index.css';

function App() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <NIS2Provider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/super-admin/*"
                  element={
                    <ProtectedRoute allowedRoles={['super-admin']}>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reseller/*"
                  element={
                    <ProtectedRoute allowedRoles={['reseller']}>
                      <ResellerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/*"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </Router>
        </NIS2Provider>
      </AuthProvider>
    </DatabaseProvider>
  );
}

export default App;