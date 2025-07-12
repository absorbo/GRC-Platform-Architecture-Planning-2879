import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import CustomerOverview from '../components/customer/CustomerOverview';
import AssessmentModule from '../components/customer/AssessmentModule';
import RiskManagement from '../components/customer/RiskManagement';
import ProjectManagement from '../components/customer/ProjectManagement';
import CustomerReports from '../components/customer/CustomerReports';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiClipboard, FiAlertTriangle, FiFolder, FiBarChart3 } = FiIcons;

const CustomerDashboard = () => {
  const menuItems = [
    { path: '', icon: FiHome, label: 'Overview' },
    { path: '/assessment', icon: FiClipboard, label: 'NIS2 Assessment' },
    { path: '/risks', icon: FiAlertTriangle, label: 'Risk Management' },
    { path: '/projects', icon: FiFolder, label: 'Project Management' },
    { path: '/reports', icon: FiBarChart3, label: 'Reports' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar menuItems={menuItems} basePath="/customer" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Customer Dashboard" />
        
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<CustomerOverview />} />
            <Route path="/assessment" element={<AssessmentModule />} />
            <Route path="/risks" element={<RiskManagement />} />
            <Route path="/projects" element={<ProjectManagement />} />
            <Route path="/reports" element={<CustomerReports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;