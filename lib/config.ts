// Configuration for API endpoints
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://adhd-task-manager-api-aflmfd633a-ez.a.run.app',
  ENDPOINTS: {
    AUTH: {
      GOOGLE_LOGIN: '/api/auth/google/login',
      GOOGLE_CALLBACK: '/api/auth/google/callback',
      ME: '/api/auth/me',
      LOGOUT: '/api/auth/logout'
    }
  }
};

// Helper function to get full API URL
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}
