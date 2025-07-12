import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBarChart3, FiTrendingUp, FiUsers, FiShield, FiDownload, FiCalendar } = FiIcons;

const GlobalReports = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Global Reports</h2>
          <p className="text-gray-600 mt-1">Comprehensive analytics and compliance reports</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors">
            <SafeIcon icon={FiCalendar} className="w-4 h-4" />
            <span>Date Range</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Assessments', value: '156', change: '+12%', icon: FiBarChart3, color: 'blue' },
          { title: 'Compliance Rate', value: '87%', change: '+5%', icon: FiShield, color: 'green' },
          { title: 'Active Users', value: '432', change: '+8%', icon: FiUsers, color: 'purple' },
          { title: 'Risk Reduction', value: '34%', change: '+15%', icon: FiTrendingUp, color: 'emerald' }
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

      {/* Report Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Reports</h3>
          <div className="space-y-3">
            {[
              { name: 'NIS2 Compliance Overview', status: 'Ready', lastGenerated: '2 hours ago' },
              { name: 'Risk Assessment Summary', status: 'Ready', lastGenerated: '1 day ago' },
              { name: 'Control Implementation Status', status: 'Generating', lastGenerated: '3 days ago' },
              { name: 'Gap Analysis Report', status: 'Ready', lastGenerated: '1 week ago' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-900">{report.name}</div>
                  <div className="text-sm text-gray-500">Last generated: {report.lastGenerated}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                  <button className="p-1 text-blue-600 hover:text-blue-800">
                    <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Analytics</h3>
          <div className="space-y-3">
            {[
              { name: 'User Activity Report', status: 'Ready', lastGenerated: '1 hour ago' },
              { name: 'System Performance Metrics', status: 'Ready', lastGenerated: '6 hours ago' },
              { name: 'Feature Usage Statistics', status: 'Ready', lastGenerated: '1 day ago' },
              { name: 'Security Incident Log', status: 'Ready', lastGenerated: '2 days ago' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-900">{report.name}</div>
                  <div className="text-sm text-gray-500">Last generated: {report.lastGenerated}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {report.status}
                  </span>
                  <button className="p-1 text-blue-600 hover:text-blue-800">
                    <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Report Templates */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Report Builder</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <SafeIcon icon={FiBarChart3} className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Executive Summary</span>
            </div>
            <p className="text-sm text-gray-600">High-level overview for leadership</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <SafeIcon icon={FiShield} className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Technical Detail</span>
            </div>
            <p className="text-sm text-gray-600">Detailed technical compliance report</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">Trend Analysis</span>
            </div>
            <p className="text-sm text-gray-600">Historical trends and projections</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GlobalReports;