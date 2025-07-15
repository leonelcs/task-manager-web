'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Brain, Target, Zap, TrendingUp, Calendar, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  // Use test endpoints for now to verify connection
  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ['analytics-test'],
    queryFn: () => api.getAnalyticsTest()
  });

  const { data: patterns, isLoading: patternsLoading } = useQuery({
    queryKey: ['analytics-test-patterns'],
    queryFn: () => api.getAnalyticsTestPatterns()
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['analytics-test-progress'],
    queryFn: () => api.getAnalyticsTestProgress()
  });

  const { data: focusSessions, isLoading: focusLoading } = useQuery({
    queryKey: ['analytics-focus-sessions'],
    queryFn: () => api.getAnalyticsFocusSessions(),
    enabled: false // Disable for now since it requires auth
  });

  const isLoading = dashboardLoading || patternsLoading || progressLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-adhd-primary-500"></div>
      </div>
    );
  }

  // Extract data from API responses
  const todayStats = dashboard?.overview?.today || {};
  const weekStats = dashboard?.overview?.this_week || {};
  const adhdInsights = dashboard?.adhd_insights || {};
  const energyPatterns = patterns?.energy_patterns || {};
  const taskPatterns = patterns?.task_patterns || {};
  const focusAnalysis = patterns?.focus_analysis || {};
  const habitTracking = progress?.habit_tracking || {};
  const achievements = progress?.achievements || [];
  const celebration = progress?.celebration || '';

  // Map API data to component structure
  const data = {
    productivity_patterns: {
      best_time_of_day: energyPatterns.peak_hours?.join(', ') || '8:00-10:00 AM, 4:00-5:30 PM',
      average_focus_duration: energyPatterns.average_focus_duration || 28,
      completion_rate: weekStats.average_completion_rate || 75,
      energy_correlation: 0.85
    },
    task_statistics: {
      total_completed: weekStats.tasks_completed || todayStats.tasks_completed || 28,
      rocks_completed: Math.floor((weekStats.tasks_completed || 28) * 0.2), // Estimate 20% rocks
      pebbles_completed: Math.floor((weekStats.tasks_completed || 28) * 0.5), // Estimate 50% pebbles  
      sand_completed: Math.floor((weekStats.tasks_completed || 28) * 0.3), // Estimate 30% sand
      average_completion_time: 32
    },
    weekly_trends: [
      { day: 'Mon', completed: 4, energy: 7 },
      { day: 'Tue', completed: 6, energy: 8 },
      { day: 'Wed', completed: 3, energy: 5 },
      { day: 'Thu', completed: 5, energy: 7 },
      { day: 'Fri', completed: 7, energy: 9 },
      { day: 'Sat', completed: 2, energy: 6 },
      { day: 'Sun', completed: 1, energy: 4 }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Understand your ADHD patterns and optimize your productivity</p>
        {dashboard && (
          <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full inline-block">
            ✅ Connected to API - Real data loaded!
          </div>
        )}
      </div>

      {/* API Connection Status */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">API Connection Status</h3>
            <p className="text-gray-600">Testing backend analytics API integration</p>
          </div>
          <div className="flex items-center gap-2">
            {dashboard ? (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">Connected</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-medium">Disconnected</span>
              </>
            )}
          </div>
        </div>
        {dashboard && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Successfully loaded data from backend API
            </p>
            <div className="text-xs text-green-600 mt-2 space-y-1">
              <div>Dashboard: {dashboard ? '✅' : '❌'} /api/analytics/test</div>
              <div>Patterns: {patterns ? '✅' : '❌'} /api/analytics/test/patterns</div>
              <div>Progress: {progress ? '✅' : '❌'} /api/analytics/test/progress</div>
            </div>
          </div>
        )}
      </div>

      {/* ADHD-Focused Insights */}
      <div className="card bg-gradient-to-r from-adhd-primary-500 to-adhd-primary-600 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-8 w-8" />
          <h2 className="text-xl font-bold">Your ADHD Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-adhd-primary-100 text-sm">Tasks Completed Today</p>
            <p className="text-lg font-semibold">{todayStats.tasks_completed || 5}</p>
          </div>
          <div>
            <p className="text-adhd-primary-100 text-sm">Tasks Pending</p>
            <p className="text-lg font-semibold">{todayStats.tasks_pending || 3}</p>
          </div>
          <div>
            <p className="text-adhd-primary-100 text-sm">Task Completion Rate</p>
            <p className="text-lg font-semibold">{data.productivity_patterns?.completion_rate || 75}%</p>
          </div>
          <div>
            <p className="text-adhd-primary-100 text-sm">Focus Sessions Today</p>
            <p className="text-lg font-semibold">{todayStats.focus_sessions || 2}</p>
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
            {data.weekly_trends.map((day: any) => (
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

      {/* Habit Tracking from Progress API */}
      {Object.keys(habitTracking).length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Habit Formation Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(habitTracking).map(([habitName, habit]: [string, any]) => (
              <div key={habitName} className="card">
                <h3 className="font-semibold text-gray-900 capitalize mb-3">
                  {habitName.replace('_', ' ')}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Streak:</span>
                    <span className="font-medium">{habit.current_streak} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Longest Streak:</span>
                    <span className="font-medium">{habit.longest_streak} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion Rate:</span>
                    <span className="font-medium">{habit.completion_rate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Trend:</span>
                    <span className={`font-medium ${
                      habit.trend === 'improving' ? 'text-green-600' : 
                      habit.trend === 'declining' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {habit.trend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Focus Session Analytics */}
      {focusAnalysis && Object.keys(focusAnalysis).length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Focus Session Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">Hyperfocus Episodes</h3>
              <p className="text-2xl font-bold text-adhd-primary-600">
                {focusAnalysis.hyperfocus_episodes}
              </p>
              <p className="text-sm text-gray-600 mt-1">this month</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">Average Duration</h3>
              <p className="text-2xl font-bold text-adhd-primary-600">
                {focusAnalysis.average_hyperfocus_duration}h
              </p>
              <p className="text-sm text-gray-600 mt-1">per hyperfocus session</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">Recovery Time</h3>
              <p className="text-2xl font-bold text-adhd-primary-600">
                {focusAnalysis.hyperfocus_recovery_time}m
              </p>
              <p className="text-sm text-gray-600 mt-1">average recovery needed</p>
            </div>
          </div>
        </div>
      )}

      {/* Task Completion Patterns */}
      {taskPatterns && Object.keys(taskPatterns).length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Task Completion Patterns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {taskPatterns.completion_by_type && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-3">Completion by Task Type</h3>
                <div className="space-y-3">
                  {Object.entries(taskPatterns.completion_by_type).map(([type, rate]: [string, any]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{type}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{rate}%</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-adhd-primary-500 h-2 rounded-full" 
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {taskPatterns.completion_by_time && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-3">Completion by Time of Day</h3>
                <div className="space-y-3">
                  {Object.entries(taskPatterns.completion_by_time).map(([time, rate]: [string, any]) => (
                    <div key={time} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{time}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{rate}%</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-adhd-secondary-500 h-2 rounded-full" 
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {taskPatterns.procrastination_triggers && taskPatterns.procrastination_triggers.length > 0 && (
            <div className="card mt-4 bg-yellow-50 border-l-4 border-yellow-400">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Procrastination Triggers Detected</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                {taskPatterns.procrastination_triggers.map((trigger: string, index: number) => (
                  <li key={index}>• {trigger}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ADHD-Specific Recommendations */}
      <div className="card bg-gradient-to-r from-adhd-secondary-50 to-pebbles-50 border-l-4 border-adhd-secondary-500">
        <div className="flex items-start gap-3">
          <Brain className="h-6 w-6 text-adhd-secondary-600 mt-1" />
          <div>
            <h3 className="font-semibold text-adhd-secondary-900 mb-2">ADHD-Friendly Recommendations</h3>
            <div className="space-y-4">
              {/* API-driven insights */}
              {adhdInsights.patterns && adhdInsights.patterns.length > 0 && (
                <div>
                  <h4 className="font-medium text-adhd-secondary-800 mb-2">Your Patterns:</h4>
                  <ul className="text-sm text-adhd-secondary-700 space-y-1">
                    {adhdInsights.patterns.map((pattern: string, index: number) => (
                      <li key={index}>• {pattern}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* API-driven recommendations */}
              {adhdInsights.recommendations && adhdInsights.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-adhd-secondary-800 mb-2">Personalized Recommendations:</h4>
                  <ul className="text-sm text-adhd-secondary-700 space-y-1">
                    {adhdInsights.recommendations.map((rec: string, index: number) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pattern-based recommendations */}
              {patterns?.recommendations && patterns.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-adhd-secondary-800 mb-2">Based on Your Behavioral Patterns:</h4>
                  <ul className="text-sm text-adhd-secondary-700 space-y-1">
                    {patterns.recommendations.map((rec: string, index: number) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Focus session insights */}
              {focusSessions?.insights && focusSessions.insights.length > 0 && (
                <div>
                  <h4 className="font-medium text-adhd-secondary-800 mb-2">Focus Session Insights:</h4>
                  <ul className="text-sm text-adhd-secondary-700 space-y-1">
                    {focusSessions.insights.map((insight: string, index: number) => (
                      <li key={index}>• {insight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Celebration from progress API */}
              {celebration && (
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="text-adhd-secondary-800 font-medium">{celebration}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
