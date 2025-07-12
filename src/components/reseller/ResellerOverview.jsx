import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useDatabase } from '../../contexts/DatabaseContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiBuilding, FiTrendingUp, FiCheckCircle } = FiIcons;

const ResellerOverview = () => {
  const { user } = useAuth();
  const { getUsersByRole, getCompaniesByReseller } = useDatabase();

  const myCustomers = getUsersByRole('customer', user?.id);
  const myCompanies = getCompaniesByReseller(user?.id);

  const stats = [
    {
      title: 'My Customers',
      value: myCustomers.length,
      icon: FiUsers,
      color: 'blue',
      change: '+3 this month'
    },
    {
      title: 'Active Companies',
      value: myCompanies.length,
      icon: FiBuilding,
      color: 'green',
      change: 'All active'
    },
    {
      title: 'Assessments Completed',
      value: '12',
      icon: FiCheckCircle,
      color: 'purple',
      change: '+4 this week'
    },
    {
      title: 'Revenue Growth',
      value: '+15%',
      icon: FiTrendingUp,
      color: 'emerald',
      change: 'vs last quarter'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h2>
        <p className="text-gray-600 mt-1">Here's an overview of your customer portfolio</p>
      </div>

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
        {/* Recent Customer Activity */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Customer Activity</h3>
          <div className="space-y-3">
            {[
              { customer: 'TechCorp Ltd', action: 'Completed NIS2 assessment', time: '2 hours ago' },
              { customer: 'DataFlow Inc', action: 'Uploaded compliance evidence', time: '1 day ago' },
              { customer: 'SecureNet Co', action: 'Updated risk register', time: '2 days ago' },
              { customer: 'CloudFirst Ltd', action: 'Started assessment', time: '3 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.customer}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Customer Status Overview */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Compliance Status</h3>
          <div className="space-y-4">
            {[
              { name: 'TechCorp Ltd', status: 'Compliant', progress: 100, color: 'green' },
              { name: 'DataFlow Inc', status: 'In Progress', progress: 75, color: 'blue' },
              { name: 'SecureNet Co', status: 'Assessment Phase', progress: 45, color: 'yellow' },
              { name: 'CloudFirst Ltd', status: 'Not Started', progress: 10, color: 'gray' }
            ].map((customer, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${customer.color}-100 text-${customer.color}-800`}>
                    {customer.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-${customer.color}-600 h-2 rounded-full transition-all`}
                    style={{ width: `${customer.progress}%` }}
                  ></div>
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
            <span className="font-medium text-gray-700">Add New Customer</span>
          </button>
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors">
            <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-700">Start Assessment</span>
          </button>
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors">
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-700">Generate Report</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResellerOverview;