'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getApiUrl, API_CONFIG } from '@/lib/config';
import { apiClient } from '@/lib/api';
import { Brain, CheckCircle, XCircle } from 'lucide-react';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');
      const token = searchParams.get('token');
      const user_id = searchParams.get('user_id');

      if (error) {
        setStatus('error');
        setError(`OAuth error: ${error}`);
        return;
      }

      // If we have a token directly from redirect, use it
      if (token && user_id) {
        try {
          // Get user data using the token - use apiClient for HTTPS enforcement
          const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.ME, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const userData = response.data;
          
          // Login the user with the received token and user data
          login(token, userData);
          
          setStatus('success');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/');
          }, 2000);

        } catch (error) {
          console.error('Token authentication error:', error);
          setStatus('error');
          setError(error instanceof Error ? error.message : 'Authentication failed');
        }
        return;
      }

      if (!code) {
        setStatus('error');
        setError('No authorization code received');
        return;
      }

      try {
        // Send the code to our backend to complete the OAuth flow - use apiClient for HTTPS enforcement
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.GOOGLE_CALLBACK, {
          params: {
            code: code,
            state: state || ''
          }
        });

        const data = response.data;
        
        // Login the user with the received token and user data
        login(data.access_token, data.user);
        
        setStatus('success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/');
        }, 2000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setError(error instanceof Error ? error.message : 'Authentication failed');
      }
    };

    handleCallback();
  }, [searchParams, login, router]);

  const handleRetryLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-adhd-primary-50 via-white to-adhd-secondary-50">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Header */}
          <div className="flex justify-center">
            <Brain className="h-16 w-16 text-adhd-primary-500" />
          </div>

          {status === 'loading' && (
            <>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-adhd-primary-500"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Completing your sign-in...
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Please wait while we set up your ADHD-friendly workspace
                </p>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome to your ADHD workspace! 🎉
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Redirecting you to your dashboard...
                </p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Oops! Something went wrong
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {error || 'Authentication failed. Please try again.'}
                </p>
              </div>
              <button
                onClick={handleRetryLogin}
                className="btn-primary"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
