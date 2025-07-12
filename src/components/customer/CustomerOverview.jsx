import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiAlertTriangle, FiCheckCircle, FiClock, FiTrendingUp, FiFileText } = FiIcons;

const CustomerOverview = () => {
  const { user } = useAuth();

  const complianceStats = [
    {
      title: 'NIS2 Compliance',
      value: '68%',
      icon: FiShield,
      color: 'blue',
      change: '+12% this month'
    },
    {
      title: 'High Risks',
      value: '7',
      icon: FiAlertTriangle,
      color: 'red',
      change: '-3 resolved'
    },
    {
      title: 'Controls Implemented',
      value: '45/67',
      icon: FiCheckCircle,
      color: 'green',
      change: '+8 this week'
    },
    {
      title: 'Pending Tasks',
      value: '12',
      icon: FiClock,
      color: 'yellow',
      change: '5 due soon'
    }
  ];

  const recentActivities = [
    { action: 'Risk assessment updated', item: 'Data Processing Controls', time: '2 hours ago' },
    { action: 'Evidence uploaded', item: 'Incident Response Plan', time: '1 day ago' },
    { action: 'Control implemented', item: 'Access Management', time: '2 days ago' },
    { action: 'Assessment started', item: 'Network Security', time: '3 days ago' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.firstName}!</h2>
        <p className="text-gray-600 mt-1">Track your NIS2 compliance progress and manage risks</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complianceStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 text-${stat.color}-600`}>{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Progress */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Compliance Progress</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { category: 'Risk Management', progress: 85, color: 'green' },
              { category: 'Incident Response', progress: 72, color: 'blue' },
              { category: 'Business Continuity', progress: 60, color: 'yellow' },
              { category: 'Supply Chain Security', progress: 45, color: 'red' }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm text-gray-600">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-${item.color}-600 h-2 rounded-full transition-all`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <SafeIcon icon={FiFileText} className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          </div>
          
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.item}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors">
            <SafeIcon icon={FiFileText} className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">Continue Assessment</span>
          </button>
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-300 transition-colors">
            <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-600" />
            <span className="font-medium text-gray-700">Review Risks</span>
          </button>
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors">
            <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-700">Upload Evidence</span>
          </button>
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors">
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-700">View Report</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerOverview;