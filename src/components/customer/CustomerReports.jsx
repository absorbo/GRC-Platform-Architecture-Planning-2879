import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBarChart3, FiDownload, FiCalendar, FiTrendingUp, FiShield, FiFileText } = FiIcons;

const CustomerReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const reportTypes = [
    {
      title: 'NIS2 Compliance Report',
      description: 'Comprehensive compliance status assessment',
      status: 'Ready',
      lastGenerated: '2 hours ago',
      icon: FiShield,
      color: 'blue'
    },
    {
      title: 'Risk Assessment Report',
      description: 'Current risk landscape and mitigation strategies',
      status: 'Ready',
      lastGenerated: '1 day ago',
      icon: FiTrendingUp,
      color: 'red'
    },
    {
      title: 'Control Implementation Status',
      description: 'Progress on security control implementations',
      status: 'Generating',
      lastGenerated: '3 days ago',
      icon: FiBarChart3,
      color: 'green'
    },
    {
      title: 'Gap Analysis Report',
      description: 'Identified gaps and remediation recommendations',
      status: 'Ready',
      lastGenerated: '1 week ago',
      icon: FiFileText,
      color: 'purple'
    }
  ];

  const complianceMetrics = [
    { label: 'Overall Compliance', value: 68, target: 85, color: 'blue' },
    { label: 'Risk Management', value: 85, target: 90, color: 'green' },
    { label: 'Incident Response', value: 72, target: 80, color: 'yellow' },
    { label: 'Business Continuity', value: 60, target: 75, color: 'red' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">Generate and download compliance reports</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Compliance Metrics */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Metrics</h3>
        <div className="space-y-4">
          {complianceMetrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                <span className="text-sm text-gray-600">{metric.value}% / {metric.target}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-${metric.color}-600 h-2 rounded-full transition-all`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Available Reports */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report, index) => (
            <motion.div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${report.color}-50`}>
                    <SafeIcon icon={report.icon} className={`w-5 h-5 text-${report.color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{report.title}</h4>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  report.status === 'Ready' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Last generated: {report.lastGenerated}</span>
                {report.status === 'Ready' && (
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm">
                    <SafeIcon icon={FiDownload} className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Report History */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Report History</h3>
        <div className="space-y-3">
          {[
            { name: 'NIS2 Compliance Report', date: '2024-01-20', size: '2.4 MB', format: 'PDF' },
            { name: 'Risk Assessment Report', date: '2024-01-19', size: '1.8 MB', format: 'PDF' },
            { name: 'Control Implementation Status', date: '2024-01-17', size: '3.2 MB', format: 'PDF' },
            { name: 'Gap Analysis Report', date: '2024-01-13', size: '2.1 MB', format: 'PDF' }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiFileText} className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{report.name}</div>
                  <div className="text-sm text-gray-500">
                    {report.date} • {report.size} • {report.format}
                  </div>
                </div>
              </div>
              <button className="p-1 text-blue-600 hover:text-blue-800">
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerReports;