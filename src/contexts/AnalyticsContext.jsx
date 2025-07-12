```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNIS2 } from './NIS2Context';
import { useRisk } from './RiskContext';
import { useProject } from './ProjectContext';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};

// Dashboard widget types
const WIDGET_TYPES = {
  compliance_progress: {
    name: 'Compliance Progress',
    description: 'Shows overall compliance progress and trends'
  },
  risk_exposure: {
    name: 'Risk Exposure',
    description: 'Displays current risk levels and distribution'
  },
  task_completion: {
    name: 'Task Completion',
    description: 'Track project and task completion rates'
  },
  audit_activity: {
    name: 'Audit Activity',
    description: 'Recent audit logs and security events'
  }
};

export const AnalyticsProvider = ({ children }) => {
  const { calculateComplianceStatus } = useNIS2();
  const { generateRiskRegister, prioritizeRisks } = useRisk();
  const { getTasksByCustomer, calculateCompletion } = useProject();

  const [dashboards, setDashboards] = useState({});
  const [trends, setTrends] = useState({});
  const [benchmarks, setBenchmarks] = useState({});

  // Load analytics data
  useEffect(() => {
    const loadAnalyticsData = () => {
      const storedData = localStorage.getItem('analytics_data');
      if (storedData) {
        const data = JSON.parse(storedData);
        setDashboards(data.dashboards || {});
        setTrends(data.trends || {});
        setBenchmarks(data.benchmarks || {});
      }
    };
    loadAnalyticsData();
  }, []);

  // Save analytics data
  const saveAnalyticsData = () => {
    const data = {
      dashboards,
      trends,
      benchmarks
    };
    localStorage.setItem('analytics_data', JSON.stringify(data));
  };

  // Dashboard Management
  const createDashboard = (userId, name, layout) => {
    const dashboardId = `${userId}_${Date.now()}`;
    setDashboards(prev => ({
      ...prev,
      [dashboardId]: {
        name,
        layout,
        userId,
        widgets: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }));
    saveAnalyticsData();
    return dashboardId;
  };

  const addWidget = (dashboardId, widgetType, config) => {
    const widgetId = `widget_${Date.now()}`;
    setDashboards(prev => ({
      ...prev,
      [dashboardId]: {
        ...prev[dashboardId],
        widgets: [
          ...prev[dashboardId].widgets,
          {
            id: widgetId,
            type: widgetType,
            config,
            createdAt: new Date().toISOString()
          }
        ],
        updatedAt: new Date().toISOString()
      }
    }));
    saveAnalyticsData();
    return widgetId;
  };

  // Trend Analysis
  const analyzeTrends = (customerId, startDate, endDate) => {
    // Get historical compliance data
    const complianceHistory = Object.values(trends)
      .filter(trend => 
        trend.customerId === customerId &&
        trend.type === 'compliance' &&
        new Date(trend.timestamp) >= new Date(startDate) &&
        new Date(trend.timestamp) <= new Date(endDate)
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Calculate trend metrics
    const trendData = {
      compliance: {
        current: calculateComplianceStatus(customerId)?.overallScore || 0,
        history: complianceHistory.map(h => ({
          timestamp: h.timestamp,
          score: h.score
        })),
        improvement: complianceHistory.length > 1 ?
          complianceHistory[complianceHistory.length - 1].score - complianceHistory[0].score :
          0
      },
      risks: {
        total: generateRiskRegister(customerId).length,
        treated: generateRiskRegister(customerId)
          .filter(r => r.status === 'treated').length,
        high_priority: prioritizeRisks(customerId)
          .filter(r => (r.inherentRisk?.score || 0) >= 15).length
      },
      tasks: {
        completion_rate: calculateCompletion(customerId),
        total: getTasksByCustomer(customerId).length
      }
    };

    return trendData;
  };

  // Benchmarking
  const calculateBenchmarks = (industry, hasOT) => {
    // Get all customers in the same industry
    const industryBenchmarks = Object.values(benchmarks)
      .filter(b => b.industry === industry && b.hasOT === hasOT);

    if (industryBenchmarks.length === 0) return null;

    // Calculate average scores
    const averages = {
      compliance_score: industryBenchmarks.reduce((sum, b) => sum + b.compliance_score, 0) / industryBenchmarks.length,
      risk_treatment_rate: industryBenchmarks.reduce((sum, b) => sum + b.risk_treatment_rate, 0) / industryBenchmarks.length,
      task_completion_rate: industryBenchmarks.reduce((sum, b) => sum + b.task_completion_rate, 0) / industryBenchmarks.length
    };

    // Calculate percentiles
    const percentiles = {
      compliance_score: calculatePercentiles(industryBenchmarks.map(b => b.compliance_score)),
      risk_treatment_rate: calculatePercentiles(industryBenchmarks.map(b => b.risk_treatment_rate)),
      task_completion_rate: calculatePercentiles(industryBenchmarks.map(b => b.task_completion_rate))
    };

    return {
      averages,
      percentiles,
      sample_size: industryBenchmarks.length
    };
  };

  // Helper function to calculate percentiles
  const calculatePercentiles = (values) => {
    const sorted = values.sort((a, b) => a - b);
    return {
      p25: sorted[Math.floor(sorted.length * 0.25)],
      p50: sorted[Math.floor(sorted.length * 0.50)],
      p75: sorted[Math.floor(sorted.length * 0.75)]
    };
  };

  const value = {
    // Constants
    WIDGET_TYPES,

    // Dashboard Management
    createDashboard,
    addWidget,
    getDashboards: (userId) => Object.values(dashboards).filter(d => d.userId === userId),

    // Analytics
    analyzeTrends,
    calculateBenchmarks,

    // Raw Data Access (for custom analysis)
    trends,
    benchmarks
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
```