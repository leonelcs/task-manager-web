// Configuration for API endpoints
// FORCE HTTPS - Never use HTTP in production
const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://adhd-task-manager-api-371157983914.europe-west4.run.app';

// Aggressively force HTTPS - replace any HTTP with HTTPS
const secureBaseUrl = rawBaseUrl.replace(/^http:\/\//, 'https://');

// Additional safety check - if no protocol, ensure HTTPS
const finalBaseUrl = secureBaseUrl.startsWith('http') ? secureBaseUrl : `https://${secureBaseUrl}`;

// Debug logging for production
if (typeof window !== 'undefined') {
  console.log('🔧 API Configuration Debug:', {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    rawBaseUrl: rawBaseUrl,
    secureBaseUrl: secureBaseUrl,
    finalBaseUrl: finalBaseUrl,
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    forcedHTTPS: rawBaseUrl !== finalBaseUrl
  });
  
  // Alert if we had to force HTTPS conversion
  if (rawBaseUrl !== finalBaseUrl) {
    console.warn('⚠️ Forced HTTP to HTTPS conversion!', { 
      original: rawBaseUrl, 
      converted: finalBaseUrl 
    });
  }
  
  // Final safety check
  if (!finalBaseUrl.startsWith('https://')) {
    console.error('🚨 CRITICAL: API URL is not HTTPS!', finalBaseUrl);
  }
}

export const API_CONFIG = {
  BASE_URL: finalBaseUrl,
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
  const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Debug logging for all API URL generation
  if (typeof window !== 'undefined') {
    console.log('🔗 API URL Generation:', {
      endpoint,
      baseUrl: API_CONFIG.BASE_URL,
      fullUrl,
      isHTTPS: fullUrl.startsWith('https://'),
      timestamp: new Date().toISOString()
    });
    
    // Alert if we're generating an HTTP URL
    if (!fullUrl.startsWith('https://')) {
      console.error('🚨 CRITICAL: Generated HTTP URL!', {
        endpoint,
        baseUrl: API_CONFIG.BASE_URL,
        fullUrl
      });
    }
  }
  
  return fullUrl;
}
