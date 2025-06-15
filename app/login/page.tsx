'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth.tsx';
import { Brain, ArrowRight, Shield, Users, Target } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, startGoogleLogin } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const authUrl = await startGoogleLogin();
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-adhd-primary-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-adhd-primary-50 via-white to-adhd-secondary-50">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center">
              <Brain className="h-16 w-16 text-adhd-primary-500" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome to ADHD Task Manager
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              A task management system designed specifically for ADHD brains
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 space-y-4">
            <div className="flex items-start space-x-3">
              <Target className="h-6 w-6 text-rock-500 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Rock/Pebbles/Sand System</h3>
                <p className="text-xs text-gray-600">Focus on what matters most with impact-based prioritization</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="h-6 w-6 text-adhd-secondary-500 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">ADHD Support Groups</h3>
                <p className="text-xs text-gray-600">Connect with others and build accountability partnerships</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-pebbles-500 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Visual Project Context</h3>
                <p className="text-xs text-gray-600">See all your tasks with color-coded project organization</p>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <div className="mt-8">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-adhd-primary-600 hover:bg-adhd-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adhd-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </span>
              {isLoggingIn ? 'Signing in...' : 'Continue with Google'}
              {!isLoggingIn && (
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our privacy policy. We only access basic profile information 
              needed to create your ADHD-friendly workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
