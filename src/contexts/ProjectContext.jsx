```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRisk } from './RiskContext';
import { useNIS2 } from './NIS2Context';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

// Task status definitions
const TASK_STATUSES = {
  todo: {
    name: 'To Do',
    description: 'Task not yet started'
  },
  in_progress: {
    name: 'In Progress',
    description: 'Task currently being worked on'
  },
  review: {
    name: 'In Review',
    description: 'Task completed and awaiting review'
  },
  completed: {
    name: 'Completed',
    description: 'Task finished and verified'
  },
  on_hold: {
    name: 'On Hold',
    description: 'Task temporarily suspended'
  }
};

// Priority levels
const PRIORITY_LEVELS = {
  critical: {
    name: 'Critical',
    value: 4,
    description: 'Urgent task requiring immediate attention'
  },
  high: {
    name: 'High',
    value: 3,
    description: 'Important task with significant impact'
  },
  medium: {
    name: 'Medium',
    value: 2,
    description: 'Standard priority task'
  },
  low: {
    name: 'Low',
    value: 1,
    description: 'Task that can be addressed when resources are available'
  }
};

export const ProjectProvider = ({ children }) => {
  const { generateComplianceRoadmap } = useNIS2();
  const { getRisksByCustomer, getTreatmentsByRisk } = useRisk();
  const [tasks, setTasks] = useState({});
  const [comments, setComments] = useState({});
  const [dependencies, setDependencies] = useState({});

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const storedData = localStorage.getItem('project_data');
      if (storedData) {
        const data = JSON.parse(storedData);
        setTasks(data.tasks || {});
        setComments(data.comments || {});
        setDependencies(data.dependencies || {});
      }
    };
    loadData();
  }, []);

  // Save data to localStorage
  const saveData = () => {
    const data = {
      tasks,
      comments,
      dependencies
    };
    localStorage.setItem('project_data', JSON.stringify(data));
  };

  // Generate tasks from compliance gaps and risk treatments
  const generateTasks = (customerId) => {
    const roadmap = generateComplianceRoadmap(customerId);
    const risks = getRisksByCustomer(customerId);
    const newTasks = {};

    // Generate tasks from compliance roadmap
    roadmap.tasks.forEach(roadmapTask => {
      const taskId = uuidv4();
      newTasks[taskId] = {
        id: taskId,
        customerId,
        title: roadmapTask.title,
        description: roadmapTask.description,
        status: 'todo',
        priority: roadmapTask.priority,
        effort: roadmapTask.effort,
        assignedRole: roadmapTask.assignedRole,
        dueDate: roadmapTask.dueDate,
        source: 'compliance',
        controlId: roadmapTask.controlId,
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    // Generate tasks from risk treatments
    risks.forEach(risk => {
      const treatments = getTreatmentsByRisk(risk.id);
      treatments.forEach(treatment => {
        const taskId = uuidv4();
        newTasks[taskId] = {
          id: taskId,
          customerId,
          title: `Implement: ${treatment.strategy} - ${risk.title}`,
          description: treatment.description,
          status: 'todo',
          priority: 'high',
          effort: treatment.effort,
          assignedRole: treatment.assignedRole,
          dueDate: treatment.dueDate,
          source: 'risk_treatment',
          riskId: risk.id,
          treatmentId: treatment.id,
          progress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });
    });

    setTasks(prev => ({
      ...prev,
      ...newTasks
    }));

    saveData();
    return Object.values(newTasks);
  };

  // Add a new task
  const addTask = (customerId, taskData) => {
    const taskId = uuidv4();
    const newTask = {
      id: taskId,
      customerId,
      ...taskData,
      status: 'todo',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks(prev => ({
      ...prev,
      [taskId]: newTask
    }));

    saveData();
    return newTask;
  };

  // Update task
  const updateTask = (taskId, updates) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }));

    saveData();
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[taskId];
      return newTasks;
    });

    // Remove associated comments and dependencies
    setComments(prev => {
      const newComments = { ...prev };
      Object.keys(newComments).forEach(commentId => {
        if (newComments[commentId].taskId === taskId) {
          delete newComments[commentId];
        }
      });
      return newComments;
    });

    setDependencies(prev => {
      const newDependencies = { ...prev };
      Object.keys(newDependencies).forEach(depId => {
        if (newDependencies[depId].taskId === taskId || newDependencies[depId].dependsOn === taskId) {
          delete newDependencies[depId];
        }
      });
      return newDependencies;
    });

    saveData();
  };

  // Add comment to task
  const addComment = (taskId, userId, content) => {
    const commentId = uuidv4();
    const newComment = {
      id: commentId,
      taskId,
      userId,
      content,
      createdAt: new Date().toISOString()
    };

    setComments(prev => ({
      ...prev,
      [commentId]: newComment
    }));

    saveData();
    return newComment;
  };

  // Add task dependency
  const addDependency = (taskId, dependsOnTaskId) => {
    const dependencyId = uuidv4();
    const newDependency = {
      id: dependencyId,
      taskId,
      dependsOn: dependsOnTaskId,
      createdAt: new Date().toISOString()
    };

    setDependencies(prev => ({
      ...prev,
      [dependencyId]: newDependency
    }));

    saveData();
    return newDependency;
  };

  // Remove task dependency
  const removeDependency = (dependencyId) => {
    setDependencies(prev => {
      const newDependencies = { ...prev };
      delete newDependencies[dependencyId];
      return newDependencies;
    });

    saveData();
  };

  // Get tasks by customer
  const getTasksByCustomer = (customerId) => {
    return Object.values(tasks).filter(task => task.customerId === customerId);
  };

  // Get task dependencies
  const getTaskDependencies = (taskId) => {
    return Object.values(dependencies).filter(dep => 
      dep.taskId === taskId || dep.dependsOn === taskId
    );
  };

  // Get task comments
  const getTaskComments = (taskId) => {
    return Object.values(comments)
      .filter(comment => comment.taskId === taskId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  // Calculate task completion percentage for a customer
  const calculateCompletion = (customerId) => {
    const customerTasks = getTasksByCustomer(customerId);
    if (customerTasks.length === 0) return 0;

    const completedTasks = customerTasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / customerTasks.length) * 100);
  };

  const value = {
    // Constants
    TASK_STATUSES,
    PRIORITY_LEVELS,
    
    // State
    tasks,
    comments,
    dependencies,
    
    // Functions
    generateTasks,
    addTask,
    updateTask,
    deleteTask,
    addComment,
    addDependency,
    removeDependency,
    getTasksByCustomer,
    getTaskDependencies,
    getTaskComments,
    calculateCompletion
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
```