import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNIS2 } from '../../contexts/NIS2Context';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageCircle, FiUpload, FiCheck, FiAlertTriangle, FiInfo, FiArrowRight } = FiIcons;

const AIAssessmentInterface = ({ customerId, designation, assessment, onComplete }) => {
  const { updateAssessmentResponse, submitEvidence, analyzeResponse, NIS2_CONTROLS } = useNIS2();
  const [currentControlIndex, setCurrentControlIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState(assessment?.responses || {});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const applicableControls = designation?.applicableControls || [];
  const currentControl = applicableControls[currentControlIndex];
  const controlFramework = NIS2_CONTROLS[designation?.country];

  // Generate dynamic questions based on control requirements
  const generateQuestions = (control) => {
    if (!control) return [];

    const baseQuestions = [
      {
        id: `${control.id}-implementation`,
        type: 'text',
        question: `How has your organization implemented the requirement: "${control.title}"?`,
        guidance: `Please describe your current implementation of ${control.title.toLowerCase()}. Focus on specific measures, processes, and technologies you have in place.`,
        placeholder: 'Describe your implementation approach, tools, and processes...'
      },
      {
        id: `${control.id}-evidence`,
        type: 'file',
        question: 'Please provide supporting documentation or evidence',
        guidance: 'Upload relevant documents such as policies, procedures, screenshots, or certificates that demonstrate compliance.',
        acceptedTypes: ['.pdf', '.docx', '.png', '.jpg', '.xlsx']
      }
    ];

    // Add requirement-specific questions
    const requirementQuestions = control.requirements.map((requirement, index) => ({
      id: `${control.id}-req-${index}`,
      type: 'text',
      question: `How do you address: "${requirement}"?`,
      guidance: `Provide specific details about how your organization meets this requirement. Include any relevant processes, tools, or documentation.`,
      placeholder: 'Describe your approach to this specific requirement...'
    }));

    return [...baseQuestions, ...requirementQuestions];
  };

  const currentQuestions = generateQuestions(currentControl);
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = applicableControls.reduce((sum, control) => sum + generateQuestions(control).length, 0);
  const completedQuestions = currentControlIndex * (currentQuestions.length || 0) + currentQuestionIndex;
  const progress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  const handleResponse = async (response) => {
    if (!currentQuestion) return;

    const questionId = currentQuestion.id;
    const responseData = {
      answer: response,
      timestamp: new Date().toISOString(),
      questionText: currentQuestion.question
    };

    // Update local state
    setResponses(prev => ({
      ...prev,
      [questionId]: responseData
    }));

    // Update assessment in context
    updateAssessmentResponse(assessment.id, questionId, responseData);

    // Analyze response if it's a text response
    if (currentQuestion.type === 'text' && response.trim()) {
      setIsAnalyzing(true);
      try {
        // Simulate AI analysis delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const analysis = analyzeResponse(response, currentControl.requirements);
        setAnalysisResult(analysis);
        
        setTimeout(() => {
          setIsAnalyzing(false);
          handleNext();
        }, 2000);
      } catch (error) {
        console.error('Analysis error:', error);
        setIsAnalyzing(false);
        handleNext();
      }
    } else {
      handleNext();
    }
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const evidenceData = {
      type: 'file',
      fileName: file.name,
      fileSize: file.size,
      description: `Evidence for ${currentQuestion.question}`
    };

    try {
      const evidence = submitEvidence(assessment.id, currentQuestion.id, evidenceData);
      
      // Also store as response
      handleResponse({
        type: 'file',
        fileName: file.name,
        evidenceId: evidence.id
      });
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentControlIndex < applicableControls.length - 1) {
      setCurrentControlIndex(currentControlIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      // Assessment complete
      onComplete();
    }
    setAnalysisResult(null);
  };

  const handleSkip = () => {
    handleNext();
  };

  if (!currentControl || !currentQuestion) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiCheck} className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment Complete</h3>
        <p className="text-gray-600">All applicable controls have been assessed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">NIS2 Compliance Assessment</h2>
            <p className="text-gray-600">Control {currentControlIndex + 1} of {applicableControls.length}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{progress}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Control Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiInfo} className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">{currentControl.title}</h3>
            <p className="text-blue-800 mb-3">{currentControl.description}</p>
            <div className="text-sm text-blue-700">
              <strong>Control Family:</strong> {currentControl.family}
            </div>
          </div>
        </div>
      </div>

      {/* Question Interface */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentControlIndex}-${currentQuestionIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          {isAnalyzing ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Response</h3>
              <p className="text-gray-600">AI is evaluating your response against NIS2 requirements...</p>
            </div>
          ) : analysisResult ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                analysisResult.status === 'compliant' ? 'bg-green-100' :
                analysisResult.status === 'partially_compliant' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <SafeIcon 
                  icon={analysisResult.status === 'compliant' ? FiCheck : FiAlertTriangle} 
                  className={`w-8 h-8 ${
                    analysisResult.status === 'compliant' ? 'text-green-600' :
                    analysisResult.status === 'partially_compliant' ? 'text-yellow-600' : 'text-red-600'
                  }`} 
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {analysisResult.status === 'compliant' ? 'Excellent Response!' :
                 analysisResult.status === 'partially_compliant' ? 'Good Progress' : 'Needs Attention'}
              </h3>
              <p className="text-gray-600 mb-4">
                Compliance Score: {analysisResult.score}% | Confidence: {Math.round(analysisResult.confidence * 100)}%
              </p>
              {analysisResult.gaps && analysisResult.gaps.length > 0 && (
                <div className="text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Areas for Improvement:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    {analysisResult.gaps.slice(0, 2).map((gap, index) => (
                      <li key={index}>• {gap.reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {currentQuestion.question}
                </h3>
                
                {currentQuestion.guidance && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-2">
                      <SafeIcon icon={FiMessageCircle} className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">AI Guidance</h4>
                        <p className="text-gray-700 text-sm">{currentQuestion.guidance}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {currentQuestion.type === 'text' && (
                <TextResponseInput
                  question={currentQuestion}
                  existingResponse={responses[currentQuestion.id]?.answer || ''}
                  onSubmit={handleResponse}
                />
              )}

              {currentQuestion.type === 'file' && (
                <FileUploadInput
                  question={currentQuestion}
                  onUpload={handleFileUpload}
                  existingFiles={responses[currentQuestion.id] ? [responses[currentQuestion.id]] : []}
                />
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Skip for Now
                </button>
                
                <div className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {currentQuestions.length} for this control
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Text Response Input Component
const TextResponseInput = ({ question, existingResponse, onSubmit }) => {
  const [response, setResponse] = useState(existingResponse);

  return (
    <div className="space-y-4">
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows="6"
        placeholder={question.placeholder || 'Provide your detailed response...'}
      />
      
      <button
        onClick={() => onSubmit(response)}
        disabled={!response.trim()}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span>Submit Response</span>
        <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
      </button>
    </div>
  );
};

// File Upload Input Component
const FileUploadInput = ({ question, onUpload, existingFiles }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <SafeIcon icon={FiUpload} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Evidence</h3>
        <p className="text-gray-600 mb-4">
          Drag and drop files here, or click to select
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Accepted formats: {question.acceptedTypes?.join(', ') || 'All file types'}
        </p>
        
        <input
          type="file"
          onChange={handleFileSelect}
          multiple
          accept={question.acceptedTypes?.join(',')}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors"
        >
          <SafeIcon icon={FiUpload} className="w-4 h-4" />
          <span>Select Files</span>
        </label>
      </div>

      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
          {existingFiles.map((file, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600" />
              <span className="text-green-800">{file.fileName || 'File uploaded successfully'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIAssessmentInterface;