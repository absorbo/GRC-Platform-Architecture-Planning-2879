import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNIS2 } from '../../contexts/NIS2Context';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiGlobe, FiBuilding, FiSettings, FiCheck, FiArrowRight, FiArrowLeft } = FiIcons;

const CustomerDesignationWizard = ({ onComplete }) => {
  const { user } = useAuth();
  const { INDUSTRY_SECTORS, createCustomerDesignation } = useNIS2();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    country: '',
    industry: '',
    companySize: '',
    employeeCount: '',
    annualTurnover: '',
    hasOT: null,
    otDetails: {
      types: [],
      criticalSystems: '',
      networkSegmentation: '',
      otSecurityMeasures: ''
    },
    servicesCriticality: '',
    interconnectedness: ''
  });

  const countries = [
    { code: 'belgium', name: 'Belgium', framework: 'CyFun Framework' },
    { code: 'france', name: 'France', framework: 'ANSSI Framework' },
    { code: 'germany', name: 'Germany', framework: 'BSI Framework' },
    { code: 'netherlands', name: 'Netherlands', framework: 'NCSC Framework' }
  ];

  const companySizes = [
    { value: 'micro', label: 'Micro (< 10 employees)', employees: '< 10' },
    { value: 'small', label: 'Small (10-49 employees)', employees: '10-49' },
    { value: 'medium', label: 'Medium (50-249 employees)', employees: '50-249' },
    { value: 'large', label: 'Large (250+ employees)', employees: '250+' }
  ];

  const otTypes = [
    'Industrial Control Systems (ICS)',
    'SCADA Systems',
    'Building Management Systems (BMS)',
    'Energy Management Systems',
    'Manufacturing Execution Systems (MES)',
    'Distributed Control Systems (DCS)',
    'Safety Instrumented Systems (SIS)',
    'Process Control Systems'
  ];

  const steps = [
    { title: 'Country Selection', icon: FiGlobe },
    { title: 'Industry & Size', icon: FiBuilding },
    { title: 'OT Infrastructure', icon: FiSettings },
    { title: 'Review & Confirm', icon: FiCheck }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const designation = createCustomerDesignation(user.id, formData);
    onComplete(designation);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateOTDetails = (field, value) => {
    setFormData(prev => ({
      ...prev,
      otDetails: {
        ...prev.otDetails,
        [field]: value
      }
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.country !== '';
      case 1:
        return formData.industry !== '' && formData.companySize !== '';
      case 2:
        return formData.hasOT !== null && (formData.hasOT === false || formData.otDetails.types.length > 0);
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Primary Country of Operation</h3>
              <p className="text-gray-600 mb-6">This determines which national transposition of NIS2 applies to your organization.</p>
            </div>
            <div className="space-y-3">
              {countries.map((country) => (
                <motion.div
                  key={country.code}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.country === country.code
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData('country', country.code)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{country.name}</h4>
                      <p className="text-sm text-gray-600">{country.framework}</p>
                    </div>
                    {formData.country === country.code && (
                      <SafeIcon icon={FiCheck} className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry Sector & Company Size</h3>
              <p className="text-gray-600 mb-6">This information determines your NIS2 designation and applicable controls.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Industry Sector</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(INDUSTRY_SECTORS).map(([key, sector]) => (
                  <motion.div
                    key={key}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.industry === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateFormData('industry', key)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="font-medium text-gray-900">{sector.name}</h4>
                    <p className="text-xs text-gray-600">{sector.description}</p>
                    {sector.typically_essential && (
                      <span className="inline-block mt-1 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        Typically Essential
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Company Size</label>
              <div className="space-y-2">
                {companySizes.map((size) => (
                  <div
                    key={size.value}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.companySize === size.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateFormData('companySize', size.value)}
                  >
                    <span className="font-medium text-gray-900">{size.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Operational Technology (OT) Infrastructure</h3>
              <p className="text-gray-600 mb-6">OT systems require additional cybersecurity controls under NIS2.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Does your organization operate or rely on Operational Technology (OT) infrastructure?
              </label>
              <div className="space-y-2">
                <div
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.hasOT === true
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData('hasOT', true)}
                >
                  <span className="font-medium text-gray-900">Yes, we operate OT infrastructure</span>
                </div>
                <div
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.hasOT === false
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateFormData('hasOT', false)}
                >
                  <span className="font-medium text-gray-900">No, we do not operate OT infrastructure</span>
                </div>
              </div>
            </div>

            {formData.hasOT === true && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Types of OT Systems (select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {otTypes.map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.otDetails.types.includes(type)}
                          onChange={(e) => {
                            const types = e.target.checked
                              ? [...formData.otDetails.types, type]
                              : formData.otDetails.types.filter(t => t !== type);
                            updateOTDetails('types', types);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your critical OT systems and their functions
                  </label>
                  <textarea
                    value={formData.otDetails.criticalSystems}
                    onChange={(e) => updateOTDetails('criticalSystems', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="e.g., SCADA systems controlling power distribution, manufacturing control systems..."
                  />
                </div>
              </motion.div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Your Designation</h3>
              <p className="text-gray-600 mb-6">Please review the information before proceeding to your NIS2 assessment.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Country:</span>
                <p className="text-gray-900">{countries.find(c => c.code === formData.country)?.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Industry:</span>
                <p className="text-gray-900">{INDUSTRY_SECTORS[formData.industry]?.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Company Size:</span>
                <p className="text-gray-900">{companySizes.find(s => s.value === formData.companySize)?.label}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">OT Infrastructure:</span>
                <p className="text-gray-900">{formData.hasOT ? 'Yes' : 'No'}</p>
                {formData.hasOT && formData.otDetails.types.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-600">OT Types:</span>
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                      {formData.otDetails.types.map((type, index) => (
                        <li key={index}>{type}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Preliminary NIS2 Designation</h4>
              <p className="text-blue-800">
                Based on your responses, your organization will likely be classified as an{' '}
                <strong>
                  {INDUSTRY_SECTORS[formData.industry]?.typically_essential ? 'Essential' : 'Important'} Entity
                </strong>{' '}
                under NIS2.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <SafeIcon icon={step.icon} className="w-5 h-5" />
              </div>
              <span
                className={`ml-3 text-sm font-medium ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-4 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-96"
      >
        {renderStepContent()}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>{currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}</span>
          <SafeIcon icon={currentStep === steps.length - 1 ? FiCheck : FiArrowRight} className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CustomerDesignationWizard;