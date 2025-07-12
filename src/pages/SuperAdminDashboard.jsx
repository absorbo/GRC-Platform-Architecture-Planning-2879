import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import SuperAdminOverview from '../components/superadmin/SuperAdminOverview';
import UserManagement from '../components/superadmin/UserManagement';
import SystemSettings from '../components/superadmin/SystemSettings';
import AuditLogs from '../components/superadmin/AuditLogs';
import GlobalReports from '../components/superadmin/GlobalReports';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiUsers, FiSettings, FiFileText, FiBarChart3, FiShield } = FiIcons;

const SuperAdminDashboard = () => {
  const menuItems = [
    { path: '', icon: FiHome, label: 'Overview' },
    { path: '/users', icon: FiUsers, label: 'User Management' },
    { path: '/settings', icon: FiSettings, label: 'System Settings' },
    { path: '/audit', icon: FiShield, label: 'Audit Logs' },
    { path: '/reports', icon: FiBarChart3, label: 'Global Reports' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar menuItems={menuItems} basePath="/super-admin" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Super Administrator Dashboard" />
        
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<SuperAdminOverview />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="/audit" element={<AuditLogs />} />
            <Route path="/reports" element={<GlobalReports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;