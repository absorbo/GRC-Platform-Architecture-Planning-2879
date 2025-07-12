import React from 'react';
import { motion } from 'framer-motion';
import { useDatabase } from '../../contexts/DatabaseContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiUserCheck, FiBuilding, FiTrendingUp, FiShield, FiActivity } = FiIcons;

const SuperAdminOverview = () => {
  const { users, companies } = useDatabase();

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: FiUsers,
      color: 'blue',
      change: '+2.5%'
    },
    {
      title: 'Active Resellers',
      value: users.filter(u => u.role === 'reseller' && u.isActive).length,
      icon: FiUserCheck,
      color: 'green',
      change: '+5.2%'
    },
    {
      title: 'Customer Companies',
      value: companies.length,
      icon: FiBuilding,
      color: 'purple',
      change: '+12.3%'
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: FiActivity,
      color: 'emerald',
      change: 'Optimal'
    }
  ];

  const recentActivities = [
    { action: 'New reseller registered', user: 'john.doe@partner.com', time: '2 hours ago' },
    { action: 'Customer completed assessment', user: 'ABC Corp', time: '4 hours ago' },
    { action: 'System backup completed', user: 'System', time: '6 hours ago' },
    { action: 'New compliance framework added', user: 'admin@trusecure.com', time: '1 day ago' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
        {/* System Status */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <SafeIcon icon={FiShield} className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Authentication</span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Services</span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">File Storage</span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
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
            <SafeIcon icon={FiActivity} className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          </div>
          
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors">
            <SafeIcon icon={FiUsers} className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">Add New User</span>
          </button>
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors">
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-700">View Analytics</span>
          </button>
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors">
            <SafeIcon icon={FiShield} className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-700">Security Audit</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuperAdminOverview;