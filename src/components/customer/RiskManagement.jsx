import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiAlertTriangle, FiPlus, FiEdit, FiTrash2, FiFilter, FiSearch } = FiIcons;

const RiskManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showAddRisk, setShowAddRisk] = useState(false);

  const risks = [
    {
      id: 1,
      title: 'Inadequate Access Controls',
      description: 'User access permissions are not regularly reviewed and updated',
      severity: 'High',
      category: 'Access Management',
      likelihood: 'Medium',
      impact: 'High',
      status: 'Open',
      owner: 'IT Security Team',
      dueDate: '2024-02-15',
      mitigation: 'Implement quarterly access reviews and automated provisioning'
    },
    {
      id: 2,
      title: 'Outdated Software Components',
      description: 'Several critical systems running on outdated software versions',
      severity: 'Medium',
      category: 'System Security',
      likelihood: 'High',
      impact: 'Medium',
      status: 'In Progress',
      owner: 'System Administrator',
      dueDate: '2024-02-28',
      mitigation: 'Schedule regular patching and vulnerability assessments'
    },
    {
      id: 3,
      title: 'Insufficient Backup Testing',
      description: 'Backup systems are not regularly tested for recovery capabilities',
      severity: 'Medium',
      category: 'Business Continuity',
      likelihood: 'Low',
      impact: 'High',
      status: 'Open',
      owner: 'Operations Team',
      dueDate: '2024-03-10',
      mitigation: 'Implement monthly backup recovery testing procedures'
    },
    {
      id: 4,
      title: 'Weak Password Policies',
      description: 'Current password policies do not meet security best practices',
      severity: 'High',
      category: 'Authentication',
      likelihood: 'High',
      impact: 'Medium',
      status: 'Resolved',
      owner: 'IT Security Team',
      dueDate: '2024-01-30',
      mitigation: 'Implemented strong password policy and MFA requirements'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         risk.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || risk.severity.toLowerCase() === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Risk Management</h2>
          <p className="text-gray-600 mt-1">Identify, assess, and manage organizational risks</p>
        </div>
        <button
          onClick={() => setShowAddRisk(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Add Risk</span>
        </button>
      </div>

      {/* Risk Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Risks', value: risks.length, color: 'blue' },
          { label: 'High Severity', value: risks.filter(r => r.severity === 'High').length, color: 'red' },
          { label: 'In Progress', value: risks.filter(r => r.status === 'In Progress').length, color: 'yellow' },
          { label: 'Resolved', value: risks.filter(r => r.status === 'Resolved').length, color: 'green' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-sm font-medium text-gray-600">{stat.label}</div>
            <div className={`text-2xl font-bold text-${stat.color}-600 mt-1`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search risks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Risk List */}
      <div className="space-y-4">
        {filteredRisks.map((risk, index) => (
          <motion.div
            key={risk.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <SafeIcon icon={FiAlertTriangle} className={`w-5 h-5 ${
                    risk.severity === 'High' ? 'text-red-500' : 
                    risk.severity === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                  <h3 className="text-lg font-semibold text-gray-900">{risk.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(risk.severity)}`}>
                    {risk.severity}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(risk.status)}`}>
                    {risk.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{risk.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Category:</span>
                    <p className="text-gray-900">{risk.category}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Owner:</span>
                    <p className="text-gray-900">{risk.owner}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Due Date:</span>
                    <p className="text-gray-900">{new Date(risk.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Impact:</span>
                    <p className="text-gray-900">{risk.impact}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-500 text-sm">Mitigation Strategy:</span>
                  <p className="text-gray-900 text-sm mt-1">{risk.mitigation}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                  <SafeIcon icon={FiEdit} className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRisks.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <SafeIcon icon={FiAlertTriangle} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No risks found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first risk'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default RiskManagement;