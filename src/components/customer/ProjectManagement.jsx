import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFolder, FiPlus, FiCalendar, FiUser, FiClock, FiCheckCircle } = FiIcons;

const ProjectManagement = () => {
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'list'

  const projects = [
    {
      id: 1,
      title: 'Implement Multi-Factor Authentication',
      description: 'Deploy MFA across all critical systems and user accounts',
      status: 'In Progress',
      priority: 'High',
      assignee: 'IT Security Team',
      dueDate: '2024-02-20',
      progress: 65,
      tasks: [
        { id: 1, title: 'Evaluate MFA solutions', completed: true },
        { id: 2, title: 'Pilot deployment', completed: true },
        { id: 3, title: 'User training', completed: false },
        { id: 4, title: 'Full rollout', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Update Incident Response Plan',
      description: 'Revise and test incident response procedures',
      status: 'Planning',
      priority: 'Medium',
      assignee: 'Compliance Team',
      dueDate: '2024-03-15',
      progress: 25,
      tasks: [
        { id: 1, title: 'Review current plan', completed: true },
        { id: 2, title: 'Identify gaps', completed: false },
        { id: 3, title: 'Update procedures', completed: false },
        { id: 4, title: 'Conduct drill', completed: false }
      ]
    },
    {
      id: 3,
      title: 'Vulnerability Assessment',
      description: 'Comprehensive security assessment of all systems',
      status: 'Completed',
      priority: 'High',
      assignee: 'External Consultant',
      dueDate: '2024-01-30',
      progress: 100,
      tasks: [
        { id: 1, title: 'Network scan', completed: true },
        { id: 2, title: 'Application testing', completed: true },
        { id: 3, title: 'Report generation', completed: true },
        { id: 4, title: 'Remediation plan', completed: true }
      ]
    },
    {
      id: 4,
      title: 'Data Backup Strategy',
      description: 'Implement comprehensive backup and recovery solution',
      status: 'On Hold',
      priority: 'Medium',
      assignee: 'Operations Team',
      dueDate: '2024-04-01',
      progress: 15,
      tasks: [
        { id: 1, title: 'Assess current backups', completed: true },
        { id: 2, title: 'Define requirements', completed: false },
        { id: 3, title: 'Select solution', completed: false },
        { id: 4, title: 'Implementation', completed: false }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'on hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusColumns = [
    { title: 'Planning', status: 'planning' },
    { title: 'In Progress', status: 'in progress' },
    { title: 'Completed', status: 'completed' },
    { title: 'On Hold', status: 'on hold' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
          <p className="text-gray-600 mt-1">Track compliance projects and roadmap progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('board')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'board' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </button>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Projects', value: projects.length, color: 'blue' },
          { label: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length, color: 'yellow' },
          { label: 'Completed', value: projects.filter(p => p.status === 'Completed').length, color: 'green' },
          { label: 'Overdue', value: 0, color: 'red' }
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

      {/* Board View */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {statusColumns.map((column, columnIndex) => (
            <div key={column.status} className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-4">{column.title}</h3>
              <div className="space-y-3">
                {projects
                  .filter(project => project.status.toLowerCase() === column.status)
                  .map((project, index) => (
                    <motion.div
                      key={project.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: columnIndex * 0.1 + index * 0.05 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900 text-sm">{project.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3">{project.description}</p>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                        <SafeIcon icon={FiUser} className="w-3 h-3" />
                        <span>{project.assignee}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                        <SafeIcon icon={FiCalendar} className="w-3 h-3" />
                        <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{project.tasks.filter(t => t.completed).length}/{project.tasks.length} tasks</span>
                        <SafeIcon icon={FiFolder} className="w-3 h-3" />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <SafeIcon icon={FiFolder} className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Assignee:</span>
                      <span className="text-gray-900">{project.assignee}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Due:</span>
                      <span className="text-gray-900">{new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Tasks:</span>
                      <span className="text-gray-900">{project.tasks.filter(t => t.completed).length}/{project.tasks.length}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 text-sm">Tasks:</h4>
                    {project.tasks.map((task, taskIndex) => (
                      <div key={task.id} className="flex items-center space-x-2 text-sm">
                        <SafeIcon 
                          icon={task.completed ? FiCheckCircle : FiClock} 
                          className={`w-4 h-4 ${task.completed ? 'text-green-500' : 'text-gray-400'}`} 
                        />
                        <span className={task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;