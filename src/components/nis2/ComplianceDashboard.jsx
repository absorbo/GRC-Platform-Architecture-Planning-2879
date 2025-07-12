import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNIS2 } from '../../contexts/NIS2Context';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiCheck, FiAlertTriangle, FiX, FiEye, FiDownload, FiTrendingUp } = FiIcons;

const ComplianceDashboard = ({ customerId }) => {
  const { calculateComplianceStatus, customerDesignations, NIS2_CONTROLS } = useNIS2();
  const [complianceData, setComplianceData] = useState(null);
  const [selectedControl, setSelectedControl] = useState(null);

  const designation = customerDesignations[customerId];

  useEffect(() => {
    if (customerId) {
      const compliance = calculateComplianceStatus(customerId);
      setComplianceData(compliance);
    }
  }, [customerId, calculateComplianceStatus]);

  if (!designation || !complianceData) {
    return (
      <div className="p-6 text-center">
        <SafeIcon icon={FiShield} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessment Data</h3>
        <p className="text-gray-600">Complete your assessment to view compliance status.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-100';
      case 'partially_compliant':
        return 'text-yellow-600 bg-yellow-100';
      case 'non_compliant':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
        return FiCheck;
      case 'partially_compliant':
        return FiAlertTriangle;
      case 'non_compliant':
        return FiX;
      default:
        return FiAlertTriangle;
    }
  };

  const getMaturityColor = (level) => {
    switch (level) {
      case 'advanced':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'basic':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const controlsByFamily = designation.applicableControls.reduce((acc, control) => {
    const family = control.family;
    if (!acc[family]) {
      acc[family] = [];
    }
    acc[family].push(control);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{complianceData.overallScore}%</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maturity Level</p>
              <p className={`text-lg font-bold mt-1 px-3 py-1 rounded-full inline-block ${getMaturityColor(complianceData.maturityLevel)}`}>
                {complianceData.maturityLevel.charAt(0).toUpperCase() + complianceData.maturityLevel.slice(1)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <SafeIcon icon={FiShield} className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliant Controls</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {complianceData.compliantControls}
                <span className="text-lg text-gray-500">/{complianceData.totalControls}</span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gaps to Address</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {complianceData.totalControls - complianceData.compliantControls}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Control Families */}
      <div className="space-y-6">
        {Object.entries(controlsByFamily).map(([family, controls], familyIndex) => {
          const familyStatuses = controls.map(control => 
            complianceData.controlStatuses.find(status => status.controlId === control.id)
          );
          const familyScore = familyStatuses.reduce((sum, status) => sum + (status?.score || 0), 0) / familyStatuses.length;

          return (
            <motion.div
              key={family}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: familyIndex * 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{family}</h3>
                  <p className="text-sm text-gray-600">{controls.length} controls</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(familyScore)}%</div>
                  <div className="text-sm text-gray-600">Family Score</div>
                </div>
              </div>

              <div className="space-y-4">
                {controls.map((control, controlIndex) => {
                  const controlStatus = complianceData.controlStatuses.find(status => status.controlId === control.id);
                  const StatusIcon = getStatusIcon(controlStatus?.status || 'not_assessed');

                  return (
                    <div
                      key={control.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`p-2 rounded-lg ${getStatusColor(controlStatus?.status || 'not_assessed')}`}>
                            <SafeIcon icon={StatusIcon} className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{control.title}</h4>
                            <p className="text-sm text-gray-600">{control.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm text-gray-500">
                                Score: {controlStatus?.score || 0}%
                              </span>
                              {controlStatus?.gaps && controlStatus.gaps.length > 0 && (
                                <span className="text-sm text-red-600">
                                  {controlStatus.gaps.length} gap{controlStatus.gaps.length !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedControl(control)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <SafeIcon icon={FiEye} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Control Progress Bar */}
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              controlStatus?.status === 'compliant' ? 'bg-green-500' :
                              controlStatus?.status === 'partially_compliant' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${controlStatus?.score || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Quick Gaps Preview */}
                      {controlStatus?.gaps && controlStatus.gaps.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h5 className="font-medium text-yellow-900 text-sm mb-1">Key Gaps:</h5>
                          <ul className="text-xs text-yellow-800 space-y-1">
                            {controlStatus.gaps.slice(0, 2).map((gap, index) => (
                              <li key={index}>• {gap.reason}</li>
                            ))}
                            {controlStatus.gaps.length > 2 && (
                              <li>• And {controlStatus.gaps.length - 2} more...</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Control Detail Modal */}
      {selectedControl && (
        <ControlDetailModal
          control={selectedControl}
          controlStatus={complianceData.controlStatuses.find(status => status.controlId === selectedControl.id)}
          onClose={() => setSelectedControl(null)}
        />
      )}
    </div>
  );
};

// Control Detail Modal Component
const ControlDetailModal = ({ control, controlStatus, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{control.title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Control Information */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700">{control.description}</p>
          </div>

          {/* Requirements */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Requirements</h4>
            <ul className="space-y-2">
              {control.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Current Status */}
          {controlStatus && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Current Status</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(controlStatus.status)}`}>
                    <SafeIcon icon={getStatusIcon(controlStatus.status)} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Score: {controlStatus.score}%
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {controlStatus.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {controlStatus.gaps && controlStatus.gaps.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Identified Gaps</h5>
                    <div className="space-y-3">
                      {controlStatus.gaps.map((gap, index) => (
                        <div key={index} className="border border-yellow-200 bg-yellow-50 rounded-lg p-3">
                          <div className="font-medium text-yellow-900 mb-1">{gap.reason}</div>
                          {gap.suggestions && gap.suggestions.length > 0 && (
                            <div>
                              <div className="text-sm text-yellow-800 mb-1">Suggestions:</div>
                              <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                                {gap.suggestions.map((suggestion, suggestionIndex) => (
                                  <li key={suggestionIndex}>{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <SafeIcon icon={FiDownload} className="w-4 h-4" />
              <span>Export Details</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComplianceDashboard;