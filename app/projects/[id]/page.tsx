'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ArrowLeft, Edit, Users, Calendar, Settings, Target, Zap, Shield, FolderOpen, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { getProjectColor } from '@/lib/utils';
import InviteProjectMembersModal from '@/components/InviteProjectMembersModal';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => api.getProject(projectId),
    enabled: !!projectId
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-adhd-primary-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-900">Project not found</h2>
        <p className="text-gray-600">The project you're looking for doesn't exist or you don't have access to it.</p>
        <Link href="/projects" className="btn-primary mt-4">
          Back to Projects
        </Link>
      </div>
    );
  }

  const projectColor = getProjectColor(project.project_type, projectId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/projects" className="p-2 hover:bg-gray-100 rounded-md">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600">{project.description || 'No description provided'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href={`/projects/${projectId}/edit`} className="btn-primary">
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
          </Link>
        </div>
      </div>

      {/* Project Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          className="card border-l-4"
          style={{ borderColor: projectColor }}
        >
          <div className="flex items-center gap-3">
            <FolderOpen className="h-6 w-6" style={{ color: projectColor }} />
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-gray-900 capitalize">{project.status}</p>
            </div>
          </div>
        </div>
        
        <div className="card border-l-4 border-adhd-secondary-500">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-adhd-secondary-600" />
            <div>
              <p className="text-sm text-adhd-secondary-700">Collaborators</p>
              <p className="font-semibold text-adhd-secondary-900">{project.collaborator_count}</p>
            </div>
          </div>
        </div>
        
        <div className="card border-l-4 border-pebbles-500">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-pebbles-600" />
            <div>
              <p className="text-sm text-pebbles-700">Tasks</p>
              <p className="font-semibold text-pebbles-900">{project.task_count}</p>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-rock-500">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-rock-600" />
            <div>
              <p className="text-sm text-rock-700">Progress</p>
              <p className="font-semibold text-rock-900">{Math.round(project.completion_percentage)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
          <span className="text-sm text-gray-500">{Math.round(project.completion_percentage)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="h-3 rounded-full transition-all duration-300"
            style={{ 
              width: `${project.completion_percentage}%`,
              backgroundColor: projectColor
            }}
          />
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-adhd-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: projectColor }}>
                  {project.project_type === 'personal' && '🏠 Personal'}
                  {project.project_type === 'shared' && '👥 Shared'}
                  {project.project_type === 'public' && '🌍 Public'}
                </span>
                {project.is_public_joinable && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Public Joinable
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Owner</label>
              <p className="mt-1 text-sm text-gray-900">Project Owner #{project.owner_id}</p>
            </div>

            {project.max_collaborators && (
              <div>
                <label className="text-sm font-medium text-gray-700">Max Collaborators</label>
                <p className="mt-1 text-sm text-gray-900">{project.max_collaborators}</p>
              </div>
            )}

            {project.group_id && (
              <div>
                <label className="text-sm font-medium text-gray-700">Associated Group</label>
                <p className="mt-1 text-sm text-gray-900">Group #{project.group_id}</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-pebbles-500" />
            <h2 className="text-xl font-semibold text-gray-900">Timeline</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Created</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>

            {project.start_date && (
              <div>
                <label className="text-sm font-medium text-gray-700">Start Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(project.start_date).toLocaleDateString()}
                </p>
              </div>
            )}

            {project.due_date && (
              <div>
                <label className="text-sm font-medium text-gray-700">Due Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(project.due_date).toLocaleDateString()}
                </p>
              </div>
            )}

            {project.completed_at && (
              <div>
                <label className="text-sm font-medium text-gray-700">Completed</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(project.completed_at).toLocaleDateString()}
                </p>
              </div>
            )}

            {project.updated_at && (
              <div>
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(project.updated_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADHD Features */}
      {project.adhd_features && Object.keys(project.adhd_features).length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-adhd-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900">ADHD Features</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.adhd_features.use_pomodoro_sessions && (
              <div className="flex items-start gap-3 p-3 bg-adhd-primary-50 rounded-md">
                <Clock className="h-5 w-5 text-adhd-primary-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-adhd-primary-900">Pomodoro Sessions</h4>
                  <p className="text-sm text-adhd-primary-700">Time-boxed focus sessions to maintain concentration</p>
                </div>
              </div>
            )}

            {project.adhd_features.enable_group_accountability && (
              <div className="flex items-start gap-3 p-3 bg-adhd-secondary-50 rounded-md">
                <Users className="h-5 w-5 text-adhd-secondary-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-adhd-secondary-900">Group Accountability</h4>
                  <p className="text-sm text-adhd-secondary-700">Shared responsibility and mutual support</p>
                </div>
              </div>
            )}

            {project.adhd_features.shared_dopamine_rewards && (
              <div className="flex items-start gap-3 p-3 bg-pebbles-50 rounded-md">
                <Zap className="h-5 w-5 text-pebbles-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-pebbles-900">Dopamine Rewards</h4>
                  <p className="text-sm text-pebbles-700">Celebration system for motivation and progress</p>
                </div>
              </div>
            )}

            {project.adhd_features.difficulty_balancing && (
              <div className="flex items-start gap-3 p-3 bg-rock-50 rounded-md">
                <Target className="h-5 w-5 text-rock-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-rock-900">Difficulty Balancing</h4>
                  <p className="text-sm text-rock-700">Smart task distribution to prevent overwhelm</p>
                </div>
              </div>
            )}

            {project.adhd_features.hyperfocus_protection && (
              <div className="flex items-start gap-3 p-3 bg-sand-50 rounded-md">
                <Shield className="h-5 w-5 text-sand-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sand-900">Hyperfocus Protection</h4>
                  <p className="text-sm text-sand-700">Gentle reminders to take breaks and avoid burnout</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Metrics */}
      {project.metrics && Object.keys(project.metrics).length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-rock-500" />
            <h2 className="text-xl font-semibold text-gray-900">Project Metrics</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(project.metrics).map(([key, value]) => (
              <div key={key} className="text-center p-3 bg-gray-50 rounded-md">
                <p className="text-lg font-semibold text-gray-900">{String(value)}</p>
                <p className="text-xs text-gray-600 capitalize">{key.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card bg-gradient-to-r from-adhd-primary-50 to-adhd-secondary-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href={`/tasks/new?project_id=${projectId}`} className="btn-secondary">
            <Target className="h-4 w-4 mr-2" />
            Add Task
          </Link>
          <Link href={`/projects/${projectId}/edit`} className="btn-secondary">
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
          </Link>
          {project.project_type !== 'personal' && (
            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="btn-secondary"
            >
              <Users className="h-4 w-4 mr-2" />
              Invite Collaborators
            </button>
          )}
        </div>
      </div>

      {/* Invite Members Modal */}
      <InviteProjectMembersModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        projectId={projectId}
        projectName={project.name}
      />
    </div>
  );
}
