'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Brain, Target, Zap, TrendingUp, Calendar, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => api.getAnalyticsDashboard()
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-adhd-primary-500"></div>
      </div>
    );
  }

  // Mock data for demonstration since analytics endpoint might not return structured data yet
  const mockAnalytics = {
    productivity_patterns: {
      best_time_of_day: '10:00 AM - 12:00 PM',
      average_focus_duration: 45,
      completion_rate: 78,
      energy_correlation: 0.85
    },
    task_statistics: {
      total_completed: 156,
      rocks_completed: 23,
      pebbles_completed: 67,
      sand_completed: 66,
      average_completion_time: 32
    },
    weekly_trends: [
      { day: 'Mon', completed: 8, energy: 7 },
      { day: 'Tue', completed: 12, energy: 8 },
      { day: 'Wed', completed: 6, energy: 5 },
      { day: 'Thu', completed: 10, energy: 7 },
      { day: 'Fri', completed: 14, energy: 9 },
      { day: 'Sat', completed: 5, energy: 6 },
      { day: 'Sun', completed: 3, energy: 4 }
    ]
  };

  const data = analytics || mockAnalytics;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Understand your ADHD patterns and optimize your productivity</p>
      </div>

      {/* ADHD-Focused Insights */}
      <div className="card bg-gradient-to-r from-adhd-primary-500 to-adhd-primary-600 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-8 w-8" />
          <h2 className="text-xl font-bold">Your ADHD Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-adhd-primary-100 text-sm">Peak Focus Time</p>
            <p className="text-lg font-semibold">{data.productivity_patterns?.best_time_of_day || '10:00 AM - 12:00 PM'}</p>
          </div>
          <div>
            <p className="text-adhd-primary-100 text-sm">Average Focus Duration</p>
            <p className="text-lg font-semibold">{data.productivity_patterns?.average_focus_duration || 45} minutes</p>
          </div>
          <div>
            <p className="text-adhd-primary-100 text-sm">Task Completion Rate</p>
            <p className="text-lg font-semibold">{data.productivity_patterns?.completion_rate || 78}%</p>
          </div>
          <div>
            <p className="text-adhd-primary-100 text-sm">Energy-Performance Correlation</p>
            <p className="text-lg font-semibold">{((data.productivity_patterns?.energy_correlation || 0.85) * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Task Impact Statistics */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Rock/Pebbles/Sand Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card border-l-4 border-rock-500">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-rock-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Rocks Completed</p>
                <p className="text-2xl font-bold text-rock-600">
                  {data.task_statistics?.rocks_completed || 23}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card border-l-4 border-pebbles-500">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-pebbles-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Pebbles Completed</p>
                <p className="text-2xl font-bold text-pebbles-600">
                  {data.task_statistics?.pebbles_completed || 67}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card border-l-4 border-sand-500">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-sand-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Sand Completed</p>
                <p className="text-2xl font-bold text-sand-600">
                  {data.task_statistics?.sand_completed || 66}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card border-l-4 border-adhd-primary-500">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-adhd-primary-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Completed</p>
                <p className="text-2xl font-bold text-adhd-primary-600">
                  {data.task_statistics?.total_completed || 156}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Trends */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Performance</h2>
        <div className="card">
          <div className="space-y-4">
            {(data.weekly_trends || []).map((day: any) => (
              <div key={day.day} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-gray-600">
                  {day.day}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600">Tasks:</span>
                        <span className="font-medium">{day.completed}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-adhd-primary-500 h-2 rounded-full" 
                          style={{ width: `${(day.completed / 15) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600">Energy:</span>
                        <span className="font-medium">{day.energy}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-adhd-secondary-500 h-2 rounded-full" 
                          style={{ width: `${(day.energy / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADHD-Specific Recommendations */}
      <div className="card bg-gradient-to-r from-adhd-secondary-50 to-pebbles-50 border-l-4 border-adhd-secondary-500">
        <div className="flex items-start gap-3">
          <Brain className="h-6 w-6 text-adhd-secondary-600 mt-1" />
          <div>
            <h3 className="font-semibold text-adhd-secondary-900 mb-2">ADHD-Friendly Recommendations</h3>
            <ul className="text-sm text-adhd-secondary-700 space-y-2">
              <li>• Your peak focus time is {data.productivity_patterns?.best_time_of_day || '10:00 AM - 12:00 PM'} - schedule rocks during this window</li>
              <li>• You complete tasks best when your energy is high - track your energy patterns</li>
              <li>• Consider breaking tasks longer than {data.productivity_patterns?.average_focus_duration || 45} minutes into chunks</li>
              <li>• Your completion rate is {data.productivity_patterns?.completion_rate || 78}% - celebrate this success! 🎉</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
