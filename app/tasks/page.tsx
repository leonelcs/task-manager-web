'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, Task } from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import { Plus, Filter, User, Users, Globe } from 'lucide-react';
import Link from 'next/link';

const impactFilters = [
  { value: '', label: 'All Impact Levels' },
  { value: 'rock', label: '🏔️ Rocks' },
  { value: 'pebbles', label: '🪨 Pebbles' },
  { value: 'sand', label: '⏳ Sand' }
];

const statusFilters = [
  { value: '', label: 'All Statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
];

const priorityFilters = [
  { value: '', label: 'All Priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

export default function TasksPage() {
  const [filters, setFilters] = useState({
    impact_size: '',
    status: '',
    priority: ''
  });

  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => api.getTasks(filters)
  });

  // Organize tasks into sections
  const organizedTasks = useMemo(() => {
    const personal: Task[] = [];
    const sharedProjects: { [projectName: string]: Task[] } = {};
    const publicProjects: { [projectName: string]: Task[] } = {};

    tasks.forEach((task: Task) => {
      // If task has a project, it should always go to the project section
      if (task.project_id && task.project_name && task.project_type) {
        if (task.project_type === 'shared') {
          // Group tasks in shared projects
          if (!sharedProjects[task.project_name]) {
            sharedProjects[task.project_name] = [];
          }
          sharedProjects[task.project_name].push(task);
        } else if (task.project_type === 'public') {
          // Group tasks in public projects
          if (!publicProjects[task.project_name]) {
            publicProjects[task.project_name] = [];
          }
          publicProjects[task.project_name].push(task);
        } else if (task.project_type === 'personal') {
          // Personal project tasks go to their own project section
          const projectKey = `${task.project_name} (Personal)`;
          if (!sharedProjects[projectKey]) {
            sharedProjects[projectKey] = [];
          }
          sharedProjects[projectKey].push(task);
        }
      } else {
        // Only truly personal tasks (no project) go here
        personal.push(task);
      }
    });

    return { personal, sharedProjects, publicProjects };
  }, [tasks]);

  const handleTaskComplete = async (taskId: string) => {
    try {
      await api.completeTask(taskId);
      // Refetch tasks after completion
      await refetch();
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-adhd-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            All Tasks {tasks.length > 0 && <span className="text-lg text-gray-500 font-normal">({tasks.length})</span>}
          </h1>
          <p className="text-gray-600">Manage your tasks with ADHD-friendly organization</p>
        </div>
        <Link href="/tasks/new" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={filters.impact_size}
            onChange={(e) => updateFilter('impact_size', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            {impactFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            {statusFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => updateFilter('priority', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            {priorityFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks Sections */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {Object.values(filters).some(f => f) 
              ? 'No tasks match your current filters'
              : 'No tasks yet'
            }
          </div>
          <Link href="/tasks/new" className="btn-primary">
            Create your first task
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Personal Tasks Section */}
          {organizedTasks.personal.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-adhd-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Tasks
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {organizedTasks.personal.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organizedTasks.personal.map((task: Task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onComplete={handleTaskComplete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Shared Projects Sections */}
          {Object.entries(organizedTasks.sharedProjects).map(([projectName, projectTasks]) => (
            <div key={projectName} className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {projectName}
                </h2>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  SHARED
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {projectTasks.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectTasks.map((task: Task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onComplete={handleTaskComplete}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Public Projects Sections */}
          {Object.entries(organizedTasks.publicProjects).map(([projectName, projectTasks]) => (
            <div key={projectName} className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {projectName}
                </h2>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  PUBLIC
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {projectTasks.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectTasks.map((task: Task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onComplete={handleTaskComplete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
