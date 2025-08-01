import axios from 'axios';
import Cookies from 'js-cookie';
import { API_CONFIG } from './config';

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Enhanced logging for debugging
const isDevelopment = process.env.NODE_ENV === 'development';

// Debug log the base URL configuration
console.log('🔧 API Client Configuration:', {
  baseURL: API_CONFIG.BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  timestamp: new Date().toISOString()
});

// Add request interceptor to always include auth token and log requests
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Force HTTPS if HTTP is detected in any URL (except localhost)
    if (config.url && config.url.startsWith('http://') && !config.url.includes('localhost')) {
      console.warn('⚠️ HTTP URL detected and converted to HTTPS:', config.url);
      config.url = config.url.replace('http://', 'https://');
    }
    if (config.baseURL && config.baseURL.startsWith('http://') && !config.baseURL.includes('localhost')) {
      console.warn('⚠️ HTTP baseURL detected and converted to HTTPS:', config.baseURL);
      config.baseURL = config.baseURL.replace('http://', 'https://');
    }
    
    // Always log the full URL being called
    const fullURL = config.baseURL && config.url ? `${config.baseURL}${config.url}` : (config.url || 'unknown');
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      fullURL: fullURL,
      baseURL: config.baseURL,
      url: config.url,
      protocol: fullURL.startsWith('https://') ? 'HTTPS' : (fullURL.startsWith('http://') ? 'HTTP' : 'UNKNOWN'),
      headers: config.headers,
      data: config.data,
      timeout: config.timeout,
      hasAuthToken: !!config.headers['Authorization']
    });
    
    // Additional check for mixed content (except localhost)
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && fullURL.startsWith('http://') && !fullURL.includes('localhost')) {
      console.error('🚨 MIXED CONTENT DETECTED:', {
        pageProtocol: window.location.protocol,
        requestURL: fullURL,
        stack: new Error().stack
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
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
      Cookies.remove('auth_token');
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
  project_name?: string;
  project_type?: 'personal' | 'shared' | 'public';
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

// Energy Log interfaces
export interface EnergyLog {
  id?: string;
  user_id?: string;
  energy_level: 'low' | 'medium' | 'high';
  duration_minutes?: number;
  notes?: string;
  logged_at?: string;
}

export interface EnergyLogCreate {
  energy_level: 'low' | 'medium' | 'high';
  duration_minutes?: number;
  notes?: string;
}

export interface EnergyLogResponse {
  energy_log: Array<{
    date: string;
    time: string;
    level: string;
    duration: number;
  }>;
  patterns: {
    best_focus_time: string;
    typical_afternoon_dip: string;
    secondary_peak: string;
  };
  insights: string[];
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
    const response = await apiClient.post('/api/tasks/', task); // Fixed: Added trailing slash
    return response.data;
  },

  updateTask: async (taskId: string, task: Partial<Task>) => {
    const response = await apiClient.put(`/api/tasks/${taskId}`, task);
    return response.data;
  },

  deleteTask: async (taskId: string) => {
    const response = await apiClient.delete(`/api/tasks/${taskId}`);
    return response.data;
  },

  completeTask: async (taskId: string, completionData?: {
    actual_duration?: number;
    completion_notes?: string;
  }) => {
    const response = await apiClient.put(`/api/tasks/${taskId}/complete`, completionData);
    return response.data;
  },

  // Projects
  getProjects: async (params?: {
    project_type?: string | string[];
    status?: string;
  }) => {
    // Use Axios params instead of manual URL construction to ensure baseURL is used
    const axiosParams: Record<string, string | string[]> = {};
    
    if (params) {
      if (params.project_type) {
        // Axios will properly serialize arrays as multiple parameters
        axiosParams.project_type = params.project_type;
      }
      if (params.status) {
        axiosParams.status = params.status;
      }
    }
    
    const response = await apiClient.get('/api/projects/', { params: axiosParams });
    return response.data;
  },

  createProject: async (project: Partial<Project>) => {
    const response = await apiClient.post('/api/projects/', project);
    return response.data;
  },

  deleteProject: async (projectId: string) => {
    const response = await apiClient.delete(`/api/projects/${projectId}`);
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
    const response = await apiClient.get('/api/shared-groups/');
    return response.data;
  },

  createSharedGroup: async (group: Partial<SharedGroup>) => {
    const response = await apiClient.post('/api/shared-groups/', group);
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
    const response = await apiClient.post(`/api/invitations/groups/${group_id}/invite`, {
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
    const response = await apiClient.get('/api/invitations/me/');
    return response.data;
  },

  // Group invitation management (for group owners)
  getGroupInvitations: async (groupId: string) => {
    const response = await apiClient.get(`/api/invitations/groups/${groupId}/`);
    return response.data;
  },

  resendGroupInvitation: async (groupId: string, invitationId: string) => {
    const response = await apiClient.post(`/api/invitations/groups/${groupId}/${invitationId}/resend`);
    return response.data;
  },

  cancelGroupInvitation: async (groupId: string, invitationId: string) => {
    const response = await apiClient.delete(`/api/invitations/groups/${groupId}/${invitationId}`);
    return response.data;
  },

  clearPendingGroupInvitations: async (groupId: string) => {
    const response = await apiClient.delete(`/api/invitations/groups/${groupId}/clear-pending`);
    return response.data;
  },

  // Users
  getUserProfile: async () => {
    const response = await apiClient.get('/api/users/');
    return response.data;
  },

  // Analytics
  getAnalyticsDashboard: async () => {
    const response = await apiClient.get('/api/analytics/dashboard');
    return response.data;
  },

  getAnalyticsPatterns: async (days: number = 30) => {
    const response = await apiClient.get(`/api/analytics/patterns?days=${days}`);
    return response.data;
  },

  getAnalyticsProgress: async () => {
    const response = await apiClient.get('/api/analytics/progress');
    return response.data;
  },

  getAnalyticsFocusSessions: async () => {
    const response = await apiClient.get('/api/analytics/focus-sessions');
    return response.data;
  },

  getAnalyticsTest: async () => {
    const response = await apiClient.get('/api/analytics/test');
    return response.data;
  },

  getAnalyticsTestPatterns: async () => {
    const response = await apiClient.get('/api/analytics/test/patterns');
    return response.data;
  },

  getAnalyticsTestProgress: async () => {
    const response = await apiClient.get('/api/analytics/test/progress');
    return response.data;
  },

  // Energy Log
  getEnergyLog: async (): Promise<EnergyLogResponse> => {
    const response = await apiClient.get('/api/users/energy-log');
    return response.data;
  },

  logEnergyLevel: async (energyData: EnergyLogCreate) => {
    const response = await apiClient.post('/api/users/energy-log', energyData);
    return response.data;
  },

  // Backward compatibility functions
  getGroups: async () => {
    const response = await apiClient.get('/api/shared-groups/');
    return response.data;
  },

  createGroup: async (group: Partial<SharedGroup>) => {
    const response = await apiClient.post('/api/shared-groups/', group);
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
    const response = await apiClient.post(`/api/invitations/groups/${group_id}/invite`, {
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
