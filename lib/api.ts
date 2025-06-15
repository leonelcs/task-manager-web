import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types based on the task-manager API
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  task_type: 'routine' | 'project' | 'maintenance' | 'emergency' | 'hyperfocus';
  impact_size: 'rock' | 'pebbles' | 'sand';
  estimated_duration?: number;
  created_at: string;
  due_date?: string;
  dopamine_reward?: string;
  energy_level_required?: string;
  project_id?: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  project_type: 'personal' | 'shared' | 'public';
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
  owner_id: number;
  collaborator_count: number;
  task_count: number;
  completion_percentage: number;
  created_at: string;
  due_date?: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  member_count: number;
  is_active: boolean;
  created_at: string;
  adhd_settings?: {
    group_focus_sessions: boolean;
    shared_energy_tracking: boolean;
    group_dopamine_celebrations: boolean;
    collaborative_task_chunking: boolean;
    group_break_reminders: boolean;
    accountability_features: boolean;
  };
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  profile_picture_url?: string;
  is_active: boolean;
  created_at: string;
}

// API functions
export const api = {
  // Tasks
  getTasks: async (params?: {
    status?: string;
    priority?: string;
    task_type?: string;
    impact_size?: string;
  }) => {
    const response = await apiClient.get('/api/tasks', { params });
    return response.data;
  },

  createTask: async (task: Partial<Task>) => {
    const response = await apiClient.post('/api/tasks', task);
    return response.data;
  },

  completeTask: async (taskId: number) => {
    const response = await apiClient.put(`/api/tasks/${taskId}/complete`);
    return response.data;
  },

  // Projects
  getProjects: async (params?: {
    project_type?: string;
    status?: string;
  }) => {
    const response = await apiClient.get('/api/projects', { params });
    return response.data;
  },

  createProject: async (project: Partial<Project>) => {
    const response = await apiClient.post('/api/projects', project);
    return response.data;
  },

  getProject: async (projectId: number) => {
    const response = await apiClient.get(`/api/projects/${projectId}`);
    return response.data;
  },

  // Groups
  getGroups: async () => {
    const response = await apiClient.get('/api/groups');
    return response.data;
  },

  createGroup: async (group: Partial<Group>) => {
    const response = await apiClient.post('/api/groups', group);
    return response.data;
  },

  getGroup: async (groupId: number) => {
    const response = await apiClient.get(`/api/groups/${groupId}`);
    return response.data;
  },

  // Users
  getUserProfile: async () => {
    const response = await apiClient.get('/api/users');
    return response.data;
  },

  // Analytics
  getAnalyticsDashboard: async () => {
    const response = await apiClient.get('/api/analytics/dashboard');
    return response.data;
  },
};
