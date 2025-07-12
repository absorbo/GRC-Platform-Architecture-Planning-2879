import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNIS2 } from '../../contexts/NIS2Context';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiUser, FiClock, FiFlag, FiCheck, FiArrowRight, FiFilter } = FiIcons;

const ComplianceRoadmap = ({ customerId }) => {
  const { generateComplianceRoadmap } = useNIS2();
  const [roadmap, setRoadmap] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [taskStatuses, setTaskStatuses] = useState({});

  useEffect(() => {
    if (customerId) {
      const roadmapData = generateComplianceRoadmap(customerId);
      setRoadmap(roadmapData);
    }
  }, [customerId, generateComplianceRoadmap]);

  const updateTaskStatus = (taskId, status) => {
    setTaskStatuses(prev => ({
      ...prev,
      [taskId]: status
    }));
  };

  if (!roadmap || roadmap.tasks.length === 0) {
    return (
      <div className="p-6 text-center">
        <SafeIcon icon={FiCalendar} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Roadmap Available</h3>
        <p className="text-gray-600">Complete your assessment to generate a compliance roadmap.</p>
      </div>
    );
  }

  const filteredTasks = roadmap.tasks.filter(task => {
    const currentStatus = taskStatuses[task.id] || task.status;
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
    const statusMatch = filterStatus === 'all' || currentStatus === filterStatus;
    return priorityMatch && statusMatch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEffortColor = (effort) => {
    switch (effort) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completedTasks = Object.values(taskStatuses).filter(status => status === 'completed').length;
  const totalTasks = roadmap.tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Compliance Roadmap</h2>
            <p className="text-gray-600">Your personalized path to NIS2 compliance</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{progressPercentage}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{totalTasks}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {roadmap.tasks.filter(t => t.priority === 'high').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{completedTasks}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">{totalTasks - completedTasks}</div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-600" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Tasks Timeline */}
      <div className="space-y-4">
        {filteredTasks.map((task, index) => {
          const currentStatus = taskStatuses[task.id] || task.status;
          
          return (
            <motion.div
              key={task.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStatus === 'completed' ? 'bg-green-100' :
                      currentStatus === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {currentStatus === 'completed' ? (
                        <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                      ) : (
                        <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(currentStatus)}`}>
                        {currentStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-gray-600 mb-4">{task.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">Assigned: {task.assignedRole}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiClock} className={`w-4 h-4 ${getEffortColor(task.effort)}`} />
                      <span className="text-gray-700">Effort: {task.effort}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiFlag} className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">Control: {task.controlId}</span>
                    </div>
                  </div>

                  {/* Dependencies */}
                  {task.dependencies && task.dependencies.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <SafeIcon icon={FiArrowRight} className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-900">Dependencies</span>
                      </div>
                      <div className="text-sm text-yellow-800">
                        This task depends on: {task.dependencies.join(', ')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  {currentStatus === 'pending' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'in_progress')}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      Start
                    </button>
                  )}
                  {currentStatus === 'in_progress' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'completed')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      Complete
                    </button>
                  )}
                  {currentStatus === 'completed' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'pending')}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <SafeIcon icon={FiCalendar} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Found</h3>
          <p className="text-gray-600">
            {filterPriority !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your filters to see more tasks.'
              : 'All compliance tasks have been completed!'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ComplianceRoadmap;