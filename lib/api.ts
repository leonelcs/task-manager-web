import axios from 'axios';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Enhanced logging for debugging
const isDevelopment = process.env.NODE_ENV === 'development';

// Add request interceptor to always include auth token and log requests
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Debug logging
    if (isDevelopment) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data,
        timeout: config.timeout
      });
    }
    
    return config;
  },
  (error) => {
    if (isDevelopment) {
      console.error('❌ API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors and log responses
apiClient.interceptors.response.use(
  (response) => {
    // Debug logging
    if (isDevelopment) {
      console.log('✅ API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
        headers: response.headers
      });
    }
    return response;
  },
  (error) => {
    if (isDevelopment) {
      console.error('❌ API Response Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        timeout: error.code === 'ECONNABORTED' ? 'Request timed out' : false
      });
    }
    
    if (error.response?.status === 401) {
      // Remove invalid token
      Cookies.remove('token');
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types based on the task-manager API
export interface Task {
  id: string;
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
  project_id?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  project_type: 'personal' | 'shared' | 'public';
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
  owner_id: string;
  shared_group_id?: string;
  is_active: boolean;
  is_public_joinable: boolean;
  max_collaborators: number;
  collaborator_count: number;
  task_count: number;
  completion_percentage: number;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  start_date?: string;
  due_date?: string;
  adhd_features?: {
    use_pomodoro_sessions?: boolean;
    enable_group_accountability?: boolean;
    shared_dopamine_rewards?: boolean;
    collective_break_reminders?: boolean;
    energy_sync_recommendations?: boolean;
    difficulty_balancing?: boolean;
    hyperfocus_protection?: boolean;
    progress_celebrations?: {
      milestone_rewards?: boolean;
      team_celebrations?: boolean;
      individual_recognition?: boolean;
    };
  };
  metrics?: {
    total_tasks?: number;
    completed_tasks?: number;
    total_focus_sessions?: number;
    total_break_time?: number;
    average_task_duration?: number;
    collaboration_score?: number;
    dopamine_events?: number;
  };
}

export interface SharedGroup {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  member_count: number;
  project_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  // ADHD-specific settings as individual fields
  group_focus_sessions: boolean;
  shared_energy_tracking: boolean;
  group_dopamine_celebrations: boolean;
  collaborative_task_chunking: boolean;
  group_break_reminders: boolean;
  accountability_features: boolean;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  profile_picture_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface SharedGroupInvitation {
  id: string;
  token: string;
  group_id: string;
  invited_email: string;
  invited_user_id?: string;
  invited_by: string;
  role: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  created_at: string;
  expires_at?: string;
  responded_at?: string;
  group_name?: string;
  group_description?: string;
  inviter_name?: string;
}

export interface SharedGroupInvitationList {
  invitations: SharedGroupInvitation[];
  total: number;
  pending_count: number;
}

// Backward compatibility type aliases
export type Group = SharedGroup;
export type GroupInvitation = SharedGroupInvitation;
export type GroupInvitationList = SharedGroupInvitationList;

// API functions
export const api = {
  // Tasks
  getTasks: async (params?: {
    status?: string;
    priority?: string;
    task_type?: string;
    impact_size?: string;
  }) => {
    // Filter out empty string parameters
    const filteredParams: Record<string, string> = {};
    if (params) {
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          const value = params[key as keyof typeof params];
          if (value !== undefined && value !== '') {
            filteredParams[key] = value;
          }
        }
      }
    }
    const response = await apiClient.get('/api/tasks/', { params: filteredParams });
    return response.data;
  },

  createTask: async (task: Partial<Task>) => {
    const response = await apiClient.post('/api/tasks', task); // Added trailing slash
    return response.data;
  },

  completeTask: async (taskId: string) => {
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

  getProject: async (projectId: string) => {
    const response = await apiClient.get(`/api/projects/${projectId}`);
    return response.data;
  },

  updateProject: async (projectId: string, project: Partial<Project>) => {
    const response = await apiClient.put(`/api/projects/${projectId}`, project);
    return response.data;
  },

  inviteToProject: async (projectId: string, invitation: {
    user_email: string;
    role?: string;
    message?: string;
  }) => {
    const response = await apiClient.post(`/api/projects/${projectId}/invite`, {
      project_id: projectId,
      ...invitation
    });
    return response.data;
  },

  // Shared Groups
  getSharedGroups: async () => {
    const response = await apiClient.get('/api/shared-groups');
    return response.data;
  },

  createSharedGroup: async (group: Partial<SharedGroup>) => {
    const response = await apiClient.post('/api/shared-groups', group);
    return response.data;
  },

  getSharedGroup: async (groupId: string) => {
    const response = await apiClient.get(`/api/shared-groups/${groupId}`);
    return response.data;
  },

  updateSharedGroup: async (groupId: string, group: Partial<SharedGroup>) => {
    const response = await apiClient.put(`/api/shared-groups/${groupId}`, group);
    return response.data;
  },

  deleteSharedGroup: async (groupId: string) => {
    const response = await apiClient.delete(`/api/shared-groups/${groupId}`);
    return response.data;
  },

  // Shared Group Invitations
  createSharedGroupInvitation: async (invitation: {
    group_id: string;
    invited_email: string;
    message?: string;
    role?: string;
  }) => {
    const { group_id, ...payload } = invitation;
    const response = await apiClient.post(`/api/invitations/shared-groups/${group_id}/invite`, {
      invited_email: payload.invited_email,
      message: payload.message,
      role: payload.role || 'member'
    });
    return response.data;
  },

  acceptInvitation: async (token: string) => {
    const response = await apiClient.post(`/api/invitations/${token}/accept`, {
      welcome_preferences: {
        receive_welcome_email: true,
        join_group_focus_session: false,
        share_energy_patterns: false
      }
    });
    return response.data;
  },

  declineInvitation: async (token: string) => {
    const response = await apiClient.post(`/api/invitations/${token}/decline`);
    return response.data;
  },

  getPendingInvitations: async () => {
    const response = await apiClient.get('/api/invitations/users/me/invitations');
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

  // Backward compatibility functions
  getGroups: async () => {
    const response = await apiClient.get('/api/shared-groups');
    return response.data;
  },

  createGroup: async (group: Partial<SharedGroup>) => {
    const response = await apiClient.post('/api/shared-groups', group);
    return response.data;
  },

  getGroup: async (groupId: string) => {
    const response = await apiClient.get(`/api/shared-groups/${groupId}`);
    return response.data;
  },

  updateGroup: async (groupId: string, group: Partial<SharedGroup>) => {
    const response = await apiClient.put(`/api/shared-groups/${groupId}`, group);
    return response.data;
  },

  deleteGroup: async (groupId: string) => {
    const response = await apiClient.delete(`/api/shared-groups/${groupId}`);
    return response.data;
  },

  createInvitation: async (invitation: {
    group_id: string;
    invited_email: string;
    message?: string;
    role?: string;
  }) => {
    const { group_id, ...payload } = invitation;
    const response = await apiClient.post(`/api/invitations/shared-groups/${group_id}/invite`, {
      invited_email: payload.invited_email,
      message: payload.message,
      role: payload.role || 'member'
    });
    return response.data;
  },
};

// Remove the old assignments that don't work with TypeScript
// api.getGroups = api.getSharedGroups;
// api.createGroup = api.createSharedGroup;
// api.getGroup = api.getSharedGroup;
// api.updateGroup = api.updateSharedGroup;
// api.deleteGroup = api.deleteSharedGroup;
// api.createInvitation = api.createSharedGroupInvitation;
