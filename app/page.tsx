'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, Task, Project } from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import ProjectTag from '@/components/ProjectTag';
import PendingInvitationsNotification from '@/components/PendingInvitationsNotification';
import { getProjectColor } from '@/lib/utils';
import { Plus, Brain, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  const queryClient = useQueryClient();
  
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.getTasks({ status: 'todo' })
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.getProjects({ project_type: ['personal', 'shared', 'public'] })
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => api.getAnalyticsDashboard()
  });

  // Group tasks by impact for ADHD-friendly prioritization
  const tasksByImpact = {
    rock: tasks.filter((task: Task) => task.impact_size === 'rock'),
    pebbles: tasks.filter((task: Task) => task.impact_size === 'pebbles'),
    sand: tasks.filter((task: Task) => task.impact_size === 'sand')
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      await api.completeTask(taskId);
      // Refetch tasks after completion to remove completed task from dashboard
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  if (tasksLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-adhd-primary-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">

      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-adhd-primary-500 to-adhd-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome to your ADHD-friendly workspace! 🧠✨
            </h1>
            <p className="text-adhd-primary-100">
              Focus on what matters most with the Rock/Pebbles/Sand system
            </p>
          </div>
          <Brain className="h-16 w-16 text-adhd-primary-200" />
        </div>
      </div>

      {/* Pending Invitations Notification */}
      <PendingInvitationsNotification />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card border-l-4 border-rock-500">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-rock-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Rocks Today</p>
              <p className="text-2xl font-bold text-rock-600">{tasksByImpact.rock.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card border-l-4 border-pebbles-500">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-pebbles-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-pebbles-600">{projects.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card border-l-4 border-adhd-primary-500">
          <div className="flex items-center">
            <Plus className="h-8 w-8 text-adhd-primary-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-adhd-primary-600">{tasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rock/Pebbles/Sand Task Organization */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Your Tasks by Impact</h2>
          <Link href="/tasks/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Link>
        </div>

        {/* Rocks - Most Important */}
        <div>
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold text-rock-600">🏔️ Rocks (Major Impact)</h3>
            <span className="ml-2 text-sm text-gray-500">
              {tasksByImpact.rock.length} tasks • Focus on 1-2 per day
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasksByImpact.rock.map((task: Task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onComplete={handleTaskComplete}
                projectColor={task.project_id ? getProjectColor('shared', task.project_id) : undefined}
              />
            ))}
            {tasksByImpact.rock.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No rocks today. Add your most impactful tasks here! 🎯
              </div>
            )}
          </div>
        </div>

        {/* Pebbles - Important Progress */}
        <div>
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold text-pebbles-600">🪨 Pebbles (Important Progress)</h3>
            <span className="ml-2 text-sm text-gray-500">
              {tasksByImpact.pebbles.length} tasks • Build momentum
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasksByImpact.pebbles.map((task: Task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onComplete={handleTaskComplete}
                projectColor={task.project_id ? getProjectColor('shared', task.project_id) : undefined}
              />
            ))}
            {tasksByImpact.pebbles.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No pebbles yet. Add tasks that build toward your bigger goals! ⚡
              </div>
            )}
          </div>
        </div>

        {/* Sand - Nice to Have */}
        <div>
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold text-sand-600">⏳ Sand (Nice to Have)</h3>
            <span className="ml-2 text-sm text-gray-500">
              {tasksByImpact.sand.length} tasks • Fill gaps naturally
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasksByImpact.sand.slice(0, 6).map((task: Task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onComplete={handleTaskComplete}
                projectColor={task.project_id ? getProjectColor('personal', task.project_id) : undefined}
              />
            ))}
            {tasksByImpact.sand.length > 6 && (
              <div className="col-span-full text-center">
                <Link href="/tasks" className="text-adhd-primary-600 hover:text-adhd-primary-700">
                  View {tasksByImpact.sand.length - 6} more sand tasks →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Active Projects</h2>
          <Link href="/projects" className="text-adhd-primary-600 hover:text-adhd-primary-700">
            View all →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {projects.slice(0, 8).map((project: Project, index: number) => (
            <ProjectTag 
              key={project.id} 
              project={project} 
              color={getProjectColor(project.project_type, index)}
            />
          ))}
          {projects.length === 0 && (
            <div className="text-gray-500">
              No active projects. <Link href="/projects/new" className="text-adhd-primary-600">Create your first project</Link>
            </div>
          )}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
