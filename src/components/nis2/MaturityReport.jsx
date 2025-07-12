import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNIS2 } from '../../contexts/NIS2Context';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiShield, FiAlertTriangle, FiCheck, FiDownload, FiFileText } = FiIcons;

const MaturityReport = ({ customerId }) => {
  const { calculateComplianceStatus, generateComplianceRoadmap, customerDesignations } = useNIS2();
  const [reportData, setReportData] = useState(null);
  const [roadmap, setRoadmap] = useState(null);

  const designation = customerDesignations[customerId];

  useEffect(() => {
    if (customerId) {
      const compliance = calculateComplianceStatus(customerId);
      const roadmapData = generateComplianceRoadmap(customerId);
      setReportData(compliance);
      setRoadmap(roadmapData);
    }
  }, [customerId, calculateComplianceStatus, generateComplianceRoadmap]);

  if (!reportData || !designation) {
    return (
      <div className="p-6 text-center">
        <SafeIcon icon={FiFileText} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Data</h3>
        <p className="text-gray-600">Complete your assessment to generate the maturity report.</p>
      </div>
    );
  }

  const getMaturityDescription = (level) => {
    switch (level) {
      case 'advanced':
        return 'Your organization demonstrates advanced cybersecurity maturity with comprehensive controls and processes in place.';
      case 'intermediate':
        return 'Your organization shows good cybersecurity practices but has opportunities for improvement in some areas.';
      case 'basic':
        return 'Your organization is in the early stages of cybersecurity maturity and requires significant improvements to meet NIS2 requirements.';
      default:
        return 'Unable to determine maturity level.';
    }
  };

  const getMaturityRecommendations = (level) => {
    switch (level) {
      case 'advanced':
        return [
          'Continue to maintain and improve existing controls',
          'Focus on continuous monitoring and optimization',
          'Consider becoming a cybersecurity leader in your industry',
          'Share best practices with industry peers'
        ];
      case 'intermediate':
        return [
          'Prioritize addressing identified gaps in critical controls',
          'Implement regular security assessments and reviews',
          'Enhance incident response and recovery capabilities',
          'Strengthen staff training and awareness programs'
        ];
      case 'basic':
        return [
          'Immediately address high-priority security gaps',
          'Establish fundamental cybersecurity governance',
          'Implement basic security controls and monitoring',
          'Develop incident response and business continuity plans'
        ];
      default:
        return [];
    }
  };

  const priorityTasks = roadmap?.tasks.filter(task => task.priority === 'high').slice(0, 5) || [];
  const mediumTasks = roadmap?.tasks.filter(task => task.priority === 'medium').slice(0, 5) || [];

  return (
    <div className="p-6 space-y-8">
      {/* Report Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">NIS2 Compliance Maturity Report</h1>
            <p className="text-blue-100">
              Generated on {new Date().toLocaleDateString()} for {designation.country.charAt(0).toUpperCase() + designation.country.slice(1)} | {designation.industry.charAt(0).toUpperCase() + designation.industry.slice(1)} Sector
            </p>
          </div>
          <button className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors">
            <SafeIcon icon={FiDownload} className="w-5 h-5" />
            <span>Export Report</span>
          </button>
        </div>
      </motion.div>

      {/* Executive Summary */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Executive Summary</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Maturity Score */}
          <div className="text-center">
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-4xl font-bold ${
              reportData.maturityLevel === 'advanced' ? 'bg-green-100 text-green-600' :
              reportData.maturityLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
            }`}>
              {reportData.overallScore}%
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">Overall Compliance Score</h3>
            <p className={`text-sm mt-2 px-3 py-1 rounded-full inline-block ${
              reportData.maturityLevel === 'advanced' ? 'bg-green-100 text-green-800' :
              reportData.maturityLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {reportData.maturityLevel.charAt(0).toUpperCase() + reportData.maturityLevel.slice(1)} Maturity
            </p>
          </div>

          {/* Key Metrics */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Compliant Controls</span>
              <span className="font-semibold text-green-600">
                {reportData.compliantControls}/{reportData.totalControls}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Gaps to Address</span>
              <span className="font-semibold text-red-600">
                {reportData.totalControls - reportData.compliantControls}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Priority Tasks</span>
              <span className="font-semibold text-orange-600">
                {priorityTasks.length}
              </span>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Key Insights</h4>
            <div className="space-y-2">
              {reportData.maturityLevel === 'advanced' && (
                <div className="flex items-center space-x-2 text-green-700">
                  <SafeIcon icon={FiCheck} className="w-4 h-4" />
                  <span className="text-sm">Strong cybersecurity posture</span>
                </div>
              )}
              {priorityTasks.length > 0 && (
                <div className="flex items-center space-x-2 text-red-700">
                  <SafeIcon icon={FiAlertTriangle} className="w-4 h-4" />
                  <span className="text-sm">Critical gaps require immediate attention</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-blue-700">
                <SafeIcon icon={FiTrendingUp} className="w-4 h-4" />
                <span className="text-sm">Clear roadmap for improvement</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Maturity Assessment</h4>
          <p className="text-blue-800">{getMaturityDescription(reportData.maturityLevel)}</p>
        </div>
      </motion.div>

      {/* Detailed Findings */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Findings</h2>

        {/* Control Family Breakdown */}
        <div className="space-y-6">
          {Object.entries(
            reportData.controlStatuses.reduce((acc, status) => {
              const control = designation.applicableControls.find(c => c.id === status.controlId);
              const family = control?.family || 'Unknown';
              if (!acc[family]) {
                acc[family] = [];
              }
              acc[family].push({ ...status, control });
              return acc;
            }, {})
          ).map(([family, statuses]) => {
            const familyScore = statuses.reduce((sum, status) => sum + status.score, 0) / statuses.length;
            const compliantCount = statuses.filter(s => s.status === 'compliant').length;

            return (
              <div key={family} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{family}</h3>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{Math.round(familyScore)}%</div>
                    <div className="text-sm text-gray-600">
                      {compliantCount}/{statuses.length} compliant
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full ${
                      familyScore >= 80 ? 'bg-green-500' :
                      familyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${familyScore}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {statuses.map((status) => (
                    <div
                      key={status.controlId}
                      className={`p-3 rounded-lg border ${
                        status.status === 'compliant' ? 'border-green-200 bg-green-50' :
                        status.status === 'partially_compliant' ? 'border-yellow-200 bg-yellow-50' :
                        'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <SafeIcon
                          icon={
                            status.status === 'compliant' ? FiCheck :
                            status.status === 'partially_compliant' ? FiAlertTriangle : FiAlertTriangle
                          }
                          className={`w-4 h-4 ${
                            status.status === 'compliant' ? 'text-green-600' :
                            status.status === 'partially_compliant' ? 'text-yellow-600' : 'text-red-600'
                          }`}
                        />
                        <span className="font-medium text-gray-900">{status.control?.title}</span>
                      </div>
                      <div className="text-sm text-gray-600">Score: {status.score}%</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Strategic Recommendations</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Immediate Actions</h3>
            <div className="space-y-3">
              {getMaturityRecommendations(reportData.maturityLevel).map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Tasks</h3>
            <div className="space-y-3">
              {priorityTasks.map((task, index) => (
                <div key={task.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="font-medium text-red-900">{task.title}</div>
                  <div className="text-sm text-red-700 mt-1">{task.description}</div>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-red-600">
                    <span>Effort: {task.effort}</span>
                    <span>Assigned: {task.assignedRole}</span>
                  </div>
                </div>
              ))}
              {priorityTasks.length === 0 && (
                <div className="text-center py-4 text-gray-600">
                  <SafeIcon icon={FiCheck} className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p>No high-priority tasks identified</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Implementation Roadmap Preview */}
      {roadmap && roadmap.tasks.length > 0 && (
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Implementation Roadmap Preview</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Full Roadmap →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Next 30 Days</h3>
              <div className="space-y-2">
                {roadmap.tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-sm text-gray-700">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Effort Distribution</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">High Priority</span>
                  <span className="font-medium">{priorityTasks.length} tasks</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Medium Priority</span>
                  <span className="font-medium">{mediumTasks.length} tasks</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="font-medium">{roadmap.tasks.length} tasks</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MaturityReport;