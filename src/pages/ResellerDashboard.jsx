import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import ResellerOverview from '../components/reseller/ResellerOverview';
import CustomerManagement from '../components/reseller/CustomerManagement';
import ResellerReports from '../components/reseller/ResellerReports';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiUsers, FiBarChart3 } = FiIcons;

const ResellerDashboard = () => {
  const menuItems = [
    { path: '', icon: FiHome, label: 'Overview' },
    { path: '/customers', icon: FiUsers, label: 'Customer Management' },
    { path: '/reports', icon: FiBarChart3, label: 'Reports' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar menuItems={menuItems} basePath="/reseller" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Reseller Dashboard" />
        
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<ResellerOverview />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/reports" element={<ResellerReports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ResellerDashboard;