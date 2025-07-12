import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

const NIS2Context = createContext();

export const useNIS2 = () => {
  const context = useContext(NIS2Context);
  if (!context) {
    throw new Error('useNIS2 must be used within a NIS2Provider');
  }
  return context;
};

// NIS2 Control Framework Data
const NIS2_CONTROLS = {
  'belgium': {
    name: 'Belgian CyFun Framework',
    controls: [
      {
        id: 'cybersec-001',
        family: 'Cybersecurity Risk Management',
        title: 'Cybersecurity Risk Assessment',
        description: 'Implement comprehensive cybersecurity risk assessment procedures',
        requirements: [
          'Conduct regular risk assessments of cybersecurity threats',
          'Document identified risks and their potential impact',
          'Implement risk mitigation measures',
          'Review and update risk assessments annually'
        ],
        applicability: {
          essential: true,
          important: true,
          sectors: ['energy', 'transport', 'banking', 'health', 'digital', 'manufacturing'],
          ot_required: false
        }
      },
      {
        id: 'cybersec-002',
        family: 'Cybersecurity Risk Management',
        title: 'Incident Response Plan',
        description: 'Establish and maintain an incident response plan',
        requirements: [
          'Develop formal incident response procedures',
          'Define roles and responsibilities for incident response',
          'Establish communication protocols',
          'Test incident response plan regularly'
        ],
        applicability: {
          essential: true,
          important: true,
          sectors: ['energy', 'transport', 'banking', 'health', 'digital', 'manufacturing'],
          ot_required: false
        }
      },
      {
        id: 'ot-001',
        family: 'Operational Technology Security',
        title: 'OT Network Segmentation',
        description: 'Implement network segmentation for OT environments',
        requirements: [
          'Separate OT networks from IT networks',
          'Implement network access controls',
          'Monitor OT network traffic',
          'Regular security assessments of OT infrastructure'
        ],
        applicability: {
          essential: true,
          important: true,
          sectors: ['energy', 'transport', 'manufacturing'],
          ot_required: true
        }
      },
      {
        id: 'data-001',
        family: 'Data Protection',
        title: 'Data Classification and Handling',
        description: 'Implement data classification and secure handling procedures',
        requirements: [
          'Classify data based on sensitivity',
          'Implement appropriate protection measures',
          'Control access to classified data',
          'Secure data transmission and storage'
        ],
        applicability: {
          essential: true,
          important: true,
          sectors: ['banking', 'health', 'digital'],
          ot_required: false
        }
      }
    ]
  }
};

// Industry sectors and their characteristics
const INDUSTRY_SECTORS = {
  energy: {
    name: 'Energy',
    description: 'Electricity, oil, gas, and renewable energy sectors',
    typically_essential: true,
    common_ot: true
  },
  transport: {
    name: 'Transport',
    description: 'Air, rail, water, and road transport',
    typically_essential: true,
    common_ot: true
  },
  banking: {
    name: 'Banking',
    description: 'Credit institutions and financial services',
    typically_essential: true,
    common_ot: false
  },
  health: {
    name: 'Health',
    description: 'Healthcare providers and medical services',
    typically_essential: true,
    common_ot: false
  },
  digital: {
    name: 'Digital Infrastructure',
    description: 'Digital service providers and infrastructure',
    typically_essential: true,
    common_ot: false
  },
  manufacturing: {
    name: 'Manufacturing',
    description: 'Production and manufacturing industries',
    typically_essential: false,
    common_ot: true
  }
};

export const NIS2Provider = ({ children }) => {
  const { user } = useAuth();
  const [customerDesignations, setCustomerDesignations] = useState({});
  const [assessments, setAssessments] = useState({});
  const [evidence, setEvidence] = useState({});
  const [complianceStatus, setComplianceStatus] = useState({});

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const storedData = localStorage.getItem('nis2_data');
      if (storedData) {
        const data = JSON.parse(storedData);
        setCustomerDesignations(data.designations || {});
        setAssessments(data.assessments || {});
        setEvidence(data.evidence || {});
        setComplianceStatus(data.compliance || {});
      }
    };
    loadData();
  }, []);

  // Save data to localStorage
  const saveData = () => {
    const data = {
      designations: customerDesignations,
      assessments: assessments,
      evidence: evidence,
      compliance: complianceStatus
    };
    localStorage.setItem('nis2_data', JSON.stringify(data));
  };

  // Customer designation assessment
  const createCustomerDesignation = (customerId, designationData) => {
    const newDesignation = {
      id: uuidv4(),
      customerId,
      country: designationData.country,
      industry: designationData.industry,
      companySize: designationData.companySize,
      hasOT: designationData.hasOT,
      otDetails: designationData.otDetails,
      designation: determineDesignation(designationData),
      applicableControls: getApplicableControls(designationData),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCustomerDesignations(prev => ({
      ...prev,
      [customerId]: newDesignation
    }));

    return newDesignation;
  };

  // Determine customer designation based on assessment
  const determineDesignation = (data) => {
    const { industry, companySize, hasOT } = data;
    const sector = INDUSTRY_SECTORS[industry];
    
    if (sector?.typically_essential) {
      if (companySize === 'large' || hasOT) {
        return 'essential';
      }
      return 'important';
    }
    
    return 'other';
  };

  // Get applicable controls based on designation
  const getApplicableControls = (designationData) => {
    const { country, industry, hasOT } = designationData;
    const designation = determineDesignation(designationData);
    const controls = NIS2_CONTROLS[country]?.controls || [];

    return controls.filter(control => {
      const applicability = control.applicability;
      
      // Check designation applicability
      if (designation === 'essential' && !applicability.essential) return false;
      if (designation === 'important' && !applicability.important && !applicability.essential) return false;
      
      // Check sector applicability
      if (!applicability.sectors.includes(industry)) return false;
      
      // Check OT requirement
      if (applicability.ot_required && !hasOT) return false;
      
      return true;
    });
  };

  // Assessment management
  const startAssessment = (customerId) => {
    const designation = customerDesignations[customerId];
    if (!designation) return null;

    const assessmentId = uuidv4();
    const newAssessment = {
      id: assessmentId,
      customerId,
      designationId: designation.id,
      status: 'in_progress',
      responses: {},
      currentQuestion: 0,
      totalQuestions: designation.applicableControls.length * 4, // Average questions per control
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAssessments(prev => ({
      ...prev,
      [assessmentId]: newAssessment
    }));

    return newAssessment;
  };

  // Update assessment response
  const updateAssessmentResponse = (assessmentId, questionId, response) => {
    setAssessments(prev => ({
      ...prev,
      [assessmentId]: {
        ...prev[assessmentId],
        responses: {
          ...prev[assessmentId].responses,
          [questionId]: response
        },
        updatedAt: new Date().toISOString()
      }
    }));
  };

  // Evidence management
  const submitEvidence = (assessmentId, questionId, evidenceData) => {
    const evidenceId = uuidv4();
    const newEvidence = {
      id: evidenceId,
      assessmentId,
      questionId,
      type: evidenceData.type,
      fileName: evidenceData.fileName,
      fileSize: evidenceData.fileSize,
      description: evidenceData.description,
      uploadedAt: new Date().toISOString()
    };

    setEvidence(prev => ({
      ...prev,
      [evidenceId]: newEvidence
    }));

    return newEvidence;
  };

  // AI-powered response analysis
  const analyzeResponse = (response, controlRequirements) => {
    // Simulated AI analysis - in production, this would call actual AI service
    const keywords = response.toLowerCase();
    let score = 0;
    let gaps = [];

    controlRequirements.forEach((requirement, index) => {
      const reqKeywords = requirement.toLowerCase().split(' ');
      const matches = reqKeywords.filter(word => keywords.includes(word)).length;
      const reqScore = matches / reqKeywords.length;
      
      if (reqScore > 0.7) {
        score += 25; // Max 100 for 4 requirements
      } else {
        gaps.push({
          requirement,
          reason: `Insufficient evidence for: ${requirement}`,
          suggestions: [`Provide documentation for ${requirement}`, `Implement controls for ${requirement}`]
        });
      }
    });

    return {
      score: Math.min(score, 100),
      status: score >= 80 ? 'compliant' : score >= 50 ? 'partially_compliant' : 'non_compliant',
      gaps,
      confidence: 0.85 // Simulated confidence score
    };
  };

  // Calculate compliance status
  const calculateComplianceStatus = (customerId) => {
    const designation = customerDesignations[customerId];
    const customerAssessments = Object.values(assessments).filter(a => a.customerId === customerId);
    
    if (!designation || customerAssessments.length === 0) return null;

    const latestAssessment = customerAssessments.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    )[0];

    const controlStatuses = designation.applicableControls.map(control => {
      const responses = Object.entries(latestAssessment.responses)
        .filter(([qId]) => qId.startsWith(control.id));
      
      if (responses.length === 0) {
        return {
          controlId: control.id,
          status: 'not_assessed',
          score: 0,
          gaps: control.requirements.map(req => ({
            requirement: req,
            reason: 'Not yet assessed',
            suggestions: ['Complete assessment for this control']
          }))
        };
      }

      // Combine all responses for this control
      const combinedResponse = responses.map(([, response]) => response.answer || '').join(' ');
      return {
        controlId: control.id,
        ...analyzeResponse(combinedResponse, control.requirements)
      };
    });

    const overallScore = controlStatuses.reduce((sum, status) => sum + status.score, 0) / controlStatuses.length;
    const compliantControls = controlStatuses.filter(s => s.status === 'compliant').length;
    const totalControls = controlStatuses.length;

    return {
      customerId,
      overallScore: Math.round(overallScore),
      maturityLevel: overallScore >= 80 ? 'advanced' : overallScore >= 60 ? 'intermediate' : 'basic',
      compliantControls,
      totalControls,
      controlStatuses,
      lastUpdated: new Date().toISOString()
    };
  };

  // Generate compliance roadmap
  const generateComplianceRoadmap = (customerId) => {
    const compliance = calculateComplianceStatus(customerId);
    if (!compliance) return null;

    const tasks = [];
    let taskPriority = 1;

    compliance.controlStatuses.forEach((controlStatus, index) => {
      if (controlStatus.status !== 'compliant') {
        controlStatus.gaps?.forEach((gap, gapIndex) => {
          gap.suggestions?.forEach((suggestion, suggestionIndex) => {
            tasks.push({
              id: `task-${index}-${gapIndex}-${suggestionIndex}`,
              title: suggestion,
              description: `Address gap: ${gap.reason}`,
              controlId: controlStatus.controlId,
              priority: controlStatus.status === 'non_compliant' ? 'high' : 'medium',
              effort: 'medium', // Simplified - in production would be more sophisticated
              assignedRole: 'CISO',
              status: 'pending',
              dependencies: [],
              dueDate: new Date(Date.now() + (taskPriority * 7 * 24 * 60 * 60 * 1000)).toISOString()
            });
            taskPriority++;
          });
        });
      }
    });

    return {
      customerId,
      tasks: tasks.slice(0, 20), // Limit to top 20 tasks
      generatedAt: new Date().toISOString()
    };
  };

  // Save data whenever state changes
  useEffect(() => {
    saveData();
  }, [customerDesignations, assessments, evidence, complianceStatus]);

  const value = {
    // Data
    NIS2_CONTROLS,
    INDUSTRY_SECTORS,
    customerDesignations,
    assessments,
    evidence,
    complianceStatus,
    
    // Functions
    createCustomerDesignation,
    startAssessment,
    updateAssessmentResponse,
    submitEvidence,
    analyzeResponse,
    calculateComplianceStatus,
    generateComplianceRoadmap,
    getApplicableControls,
    determineDesignation
  };

  return (
    <NIS2Context.Provider value={value}>
      {children}
    </NIS2Context.Provider>
  );
};