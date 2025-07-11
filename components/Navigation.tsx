'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, FolderOpen, Users, BarChart3, Brain, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Groups', href: '/groups', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - responsive sizing */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-adhd-primary-500" />
            <span className="text-lg sm:text-xl font-bold text-gray-900 hidden xs:block">
              ADHD Task Manager
            </span>
            <span className="text-lg font-bold text-gray-900 block xs:hidden">
              ADHD
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-adhd-primary-100 text-adhd-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation - Icons Only */}
          <div className="flex md:hidden items-center space-x-1 flex-1 justify-center mx-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-center p-2 rounded-md transition-colors',
                    isActive
                      ? 'bg-adhd-primary-100 text-adhd-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                  title={item.name}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {user && (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {user.profile_picture_url ? (
                    <img 
                      src={user.profile_picture_url} 
                      alt={user.full_name || user.email}
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                    />
                  ) : (
                    <User className="h-7 w-7 sm:h-8 sm:w-8 p-1.5 sm:p-2 bg-gray-100 rounded-full text-gray-600" />
                  )}
                  
                  {/* User name - hidden on very small screens */}
                  <span className="text-sm text-gray-700 hidden sm:block max-w-20 lg:max-w-none truncate">
                    {user.full_name || user.email}
                  </span>
                  
                  <button
                    onClick={logout}
                    className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
        </div>
      </div>
    </nav>
  );
}
