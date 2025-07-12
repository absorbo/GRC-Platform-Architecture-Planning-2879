import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBarChart3, FiDownload, FiCalendar, FiTrendingUp } = FiIcons;

const ResellerReports = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">Track your customers' compliance progress and performance</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors">
            <SafeIcon icon={FiCalendar} className="w-4 h-4" />
            <span>Date Range</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: '$45,230', change: '+12%', icon: FiTrendingUp, color: 'green' },
          { title: 'Active Customers', value: '23', change: '+3', icon: FiBarChart3, color: 'blue' },
          { title: 'Avg. Compliance', value: '78%', change: '+8%', icon: FiBarChart3, color: 'purple' },
          { title: 'Assessments Done', value: '67', change: '+15', icon: FiBarChart3, color: 'emerald' }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className={`text-sm mt-1 text-${metric.color}-600`}>{metric.change}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${metric.color}-50`}>
                <SafeIcon icon={metric.icon} className={`w-6 h-6 text-${metric.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Available Reports */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Customer Portfolio Summary', description: 'Overview of all customer compliance status', status: 'Ready' },
            { name: 'Revenue Performance', description: 'Monthly and quarterly revenue analysis', status: 'Ready' },
            { name: 'Compliance Trends', description: 'Historical compliance progress tracking', status: 'Generating' },
            { name: 'Risk Assessment Overview', description: 'Summary of customer risk profiles', status: 'Ready' },
            { name: 'Customer Satisfaction', description: 'Feedback and satisfaction metrics', status: 'Ready' },
            { name: 'Market Analysis', description: 'Industry benchmarking and insights', status: 'Ready' }
          ].map((report, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                  {report.status === 'Ready' && (
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <SafeIcon icon={FiDownload} className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ResellerReports;