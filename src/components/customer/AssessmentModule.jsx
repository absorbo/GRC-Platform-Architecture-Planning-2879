import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNIS2 } from '../../contexts/NIS2Context';
import { useAuth } from '../../contexts/AuthContext';
import CustomerDesignationWizard from '../nis2/CustomerDesignationWizard';
import AIAssessmentInterface from '../nis2/AIAssessmentInterface';
import ComplianceDashboard from '../nis2/ComplianceDashboard';
import MaturityReport from '../nis2/MaturityReport';
import ComplianceRoadmap from '../nis2/ComplianceRoadmap';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClipboard, FiCheck, FiShield, FiTrendingUp, FiCalendar, FiArrowRight } = FiIcons;

const AssessmentModule = () => {
  const { user } = useAuth();
  const { customerDesignations, assessments, startAssessment } = useNIS2();
  const [currentView, setCurrentView] = useState('designation');
  const [currentAssessment, setCurrentAssessment] = useState(null);

  const designation = customerDesignations[user?.id];
  const userAssessments = Object.values(assessments).filter(a => a.customerId === user?.id);

  useEffect(() => {
    // Determine the current view based on user progress
    if (!designation) {
      setCurrentView('designation');
    } else if (userAssessments.length === 0) {
      setCurrentView('start');
    } else {
      const latestAssessment = userAssessments.sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      )[0];
      
      if (latestAssessment.status === 'in_progress') {
        setCurrentView('assessment');
        setCurrentAssessment(latestAssessment);
      } else {
        setCurrentView('dashboard');
      }
    }
  }, [designation, userAssessments]);

  const handleDesignationComplete = (newDesignation) => {
    setCurrentView('start');
  };

  const handleStartAssessment = () => {
    const assessment = startAssessment(user.id);
    setCurrentAssessment(assessment);
    setCurrentView('assessment');
  };

  const handleAssessmentComplete = () => {
    setCurrentView('dashboard');
    setCurrentAssessment(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'designation':
        return (
          <CustomerDesignationWizard onComplete={handleDesignationComplete} />
        );

      case 'start':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <SafeIcon icon={FiClipboard} className="w-8 h-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your NIS2 Assessment</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Based on your designation as an organization in the {designation?.industry} sector operating in {designation?.country}, 
                we've prepared a customized assessment covering {designation?.applicableControls?.length} relevant NIS2 controls.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <SafeIcon icon={FiShield} className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">AI-Powered</h3>
                  <p className="text-sm text-gray-600">Intelligent questions adapted to your responses</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Evidence-Based</h3>
                  <p className="text-sm text-gray-600">Upload supporting documents and evidence</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Immediate Results</h3>
                  <p className="text-sm text-gray-600">Real-time compliance tracking and roadmap</p>
                </div>
              </div>

              <button
                onClick={handleStartAssessment}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors mx-auto"
              >
                <span>Start Assessment</span>
                <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
              </button>

              <p className="text-sm text-gray-500 mt-4">
                Estimated time: 30-45 minutes | You can save and continue later
              </p>
            </motion.div>
          </div>
        );

      case 'assessment':
        return (
          <AIAssessmentInterface
            customerId={user.id}
            designation={designation}
            assessment={currentAssessment}
            onComplete={handleAssessmentComplete}
          />
        );

      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              <div className="flex space-x-2">
                {[
                  { id: 'dashboard', label: 'Compliance Dashboard', icon: FiShield },
                  { id: 'report', label: 'Maturity Report', icon: FiTrendingUp },
                  { id: 'roadmap', label: 'Implementation Roadmap', icon: FiCalendar }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentView(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentView === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <ComplianceDashboard customerId={user.id} />
          </div>
        );

      case 'report':
        return (
          <div className="space-y-8">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              <div className="flex space-x-2">
                {[
                  { id: 'dashboard', label: 'Compliance Dashboard', icon: FiShield },
                  { id: 'report', label: 'Maturity Report', icon: FiTrendingUp },
                  { id: 'roadmap', label: 'Implementation Roadmap', icon: FiCalendar }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentView(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentView === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <MaturityReport customerId={user.id} />
          </div>
        );

      case 'roadmap':
        return (
          <div className="space-y-8">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              <div className="flex space-x-2">
                {[
                  { id: 'dashboard', label: 'Compliance Dashboard', icon: FiShield },
                  { id: 'report', label: 'Maturity Report', icon: FiTrendingUp },
                  { id: 'roadmap', label: 'Implementation Roadmap', icon: FiCalendar }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentView(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentView === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <ComplianceRoadmap customerId={user.id} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
    </div>
  );
};

export default AssessmentModule;