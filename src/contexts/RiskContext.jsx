```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNIS2 } from './NIS2Context';

const RiskContext = createContext();

export const useRisk = () => {
  const context = useContext(RiskContext);
  if (!context) {
    throw new Error('useRisk must be used within a RiskProvider');
  }
  return context;
};

// Risk Categories with descriptions for accurate classification
const RISK_CATEGORIES = {
  cybersecurity: {
    name: 'Cybersecurity',
    description: 'Risks related to information security, data protection, and cyber threats'
  },
  operational: {
    name: 'Operational',
    description: 'Risks affecting business operations and service delivery'
  },
  legal: {
    name: 'Legal & Compliance',
    description: 'Risks related to regulatory compliance and legal obligations'
  },
  financial: {
    name: 'Financial',
    description: 'Risks impacting financial stability and resources'
  }
};

// Treatment Strategies with guidance
const TREATMENT_STRATEGIES = {
  mitigate: {
    name: 'Mitigate',
    description: 'Implement controls to reduce risk likelihood or impact'
  },
  transfer: {
    name: 'Transfer',
    description: 'Share or transfer risk to another party (e.g., insurance)'
  },
  accept: {
    name: 'Accept',
    description: 'Accept and monitor the risk if within tolerance levels'
  },
  avoid: {
    name: 'Avoid',
    description: 'Eliminate the risk by removing its source'
  }
};

// Risk scoring matrix for consistent evaluation
const RISK_SCORING = {
  likelihood: {
    1: { label: 'Rare', description: 'May occur only in exceptional circumstances' },
    2: { label: 'Unlikely', description: 'Could occur at some time' },
    3: { label: 'Possible', description: 'Might occur at some time' },
    4: { label: 'Likely', description: 'Will probably occur in most circumstances' },
    5: { label: 'Almost Certain', description: 'Expected to occur in most circumstances' }
  },
  impact: {
    1: { label: 'Insignificant', description: 'Minimal impact on operations' },
    2: { label: 'Minor', description: 'Minor impact, easily remediated' },
    3: { label: 'Moderate', description: 'Significant impact requiring management attention' },
    4: { label: 'Major', description: 'Major impact threatening business objectives' },
    5: { label: 'Catastrophic', description: 'Catastrophic impact on business viability' }
  }
};

export const RiskProvider = ({ children }) => {
  const { calculateComplianceStatus } = useNIS2();
  const [risks, setRisks] = useState({});
  const [treatments, setTreatments] = useState({});

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const storedData = localStorage.getItem('risk_data');
      if (storedData) {
        const data = JSON.parse(storedData);
        setRisks(data.risks || {});
        setTreatments(data.treatments || {});
      }
    };
    loadData();
  }, []);

  // Save data to localStorage
  const saveData = () => {
    const data = {
      risks,
      treatments
    };
    localStorage.setItem('risk_data', JSON.stringify(data));
  };

  // Automatically identify risks from compliance gaps
  const identifyRisksFromCompliance = (customerId) => {
    const complianceStatus = calculateComplianceStatus(customerId);
    if (!complianceStatus) return [];

    const identifiedRisks = [];
    complianceStatus.controlStatuses.forEach(status => {
      if (status.status !== 'compliant') {
        status.gaps.forEach(gap => {
          const riskId = uuidv4();
          const risk = {
            id: riskId,
            customerId,
            title: `Risk from gap: ${gap.requirement}`,
            description: gap.reason,
            category: 'cybersecurity',
            source: 'automated',
            controlId: status.controlId,
            inherentRisk: {
              likelihood: 3, // Default to 'Possible'
              impact: 3,    // Default to 'Moderate'
              score: 9
            },
            residualRisk: null,
            status: 'identified',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          identifiedRisks.push(risk);
        });
      }
    });

    return identifiedRisks;
  };

  // Calculate risk score based on likelihood and impact
  const calculateRiskScore = (likelihood, impact) => {
    return likelihood * impact;
  };

  // Add a new risk
  const addRisk = (customerId, riskData) => {
    const riskId = uuidv4();
    const newRisk = {
      id: riskId,
      customerId,
      ...riskData,
      status: 'identified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setRisks(prev => ({
      ...prev,
      [riskId]: newRisk
    }));

    saveData();
    return newRisk;
  };

  // Update existing risk
  const updateRisk = (riskId, updates) => {
    setRisks(prev => ({
      ...prev,
      [riskId]: {
        ...prev[riskId],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }));

    saveData();
  };

  // Delete risk
  const deleteRisk = (riskId) => {
    setRisks(prev => {
      const newRisks = { ...prev };
      delete newRisks[riskId];
      return newRisks;
    });

    saveData();
  };

  // Add risk treatment
  const addTreatment = (riskId, treatmentData) => {
    const treatmentId = uuidv4();
    const newTreatment = {
      id: treatmentId,
      riskId,
      ...treatmentData,
      status: 'planned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTreatments(prev => ({
      ...prev,
      [treatmentId]: newTreatment
    }));

    // Update risk status
    updateRisk(riskId, {
      status: 'treatment_planned',
      residualRisk: treatmentData.residualRisk
    });

    saveData();
    return newTreatment;
  };

  // Update treatment
  const updateTreatment = (treatmentId, updates) => {
    setTreatments(prev => ({
      ...prev,
      [treatmentId]: {
        ...prev[treatmentId],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }));

    saveData();
  };

  // Get risks by customer
  const getRisksByCustomer = (customerId) => {
    return Object.values(risks).filter(risk => risk.customerId === customerId);
  };

  // Get treatments by risk
  const getTreatmentsByRisk = (riskId) => {
    return Object.values(treatments).filter(treatment => treatment.riskId === riskId);
  };

  // Generate risk register
  const generateRiskRegister = (customerId) => {
    const customerRisks = getRisksByCustomer(customerId);
    return customerRisks.map(risk => ({
      ...risk,
      treatments: getTreatmentsByRisk(risk.id)
    }));
  };

  // Prioritize risks based on score and context
  const prioritizeRisks = (customerId) => {
    const riskRegister = generateRiskRegister(customerId);
    return riskRegister.sort((a, b) => {
      // Sort by inherent risk score (higher score = higher priority)
      const scoreA = a.inherentRisk?.score || 0;
      const scoreB = b.inherentRisk?.score || 0;
      if (scoreB !== scoreA) return scoreB - scoreA;

      // If scores are equal, sort by status (identified risks first)
      if (a.status === 'identified' && b.status !== 'identified') return -1;
      if (a.status !== 'identified' && b.status === 'identified') return 1;

      // Finally, sort by creation date (newer first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const value = {
    // Constants
    RISK_CATEGORIES,
    TREATMENT_STRATEGIES,
    RISK_SCORING,
    
    // State
    risks,
    treatments,
    
    // Functions
    identifyRisksFromCompliance,
    calculateRiskScore,
    addRisk,
    updateRisk,
    deleteRisk,
    addTreatment,
    updateTreatment,
    getRisksByCustomer,
    getTreatmentsByRisk,
    generateRiskRegister,
    prioritizeRisks
  };

  return (
    <RiskContext.Provider value={value}>
      {children}
    </RiskContext.Provider>
  );
};
```