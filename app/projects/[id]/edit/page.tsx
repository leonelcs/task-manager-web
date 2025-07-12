'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useProjects } from '@/hooks/useProjects';
import { api, Group } from '@/lib/api';
import { ArrowLeft, Save, Settings, Target, Users, Calendar, FolderOpen, Trash2 } from 'lucide-react';
import Link from 'next/link';
import DatePicker from '@/components/DatePicker';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const { updateProject, deleteProject, isUpdating, isDeleting: isDeletingProject } = useProjects();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => api.getProject(projectId),
    enabled: !!projectId
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: () => api.getGroups()
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_type: 'personal' as const,
    status: 'planning' as const,
    is_public_joinable: false,
    max_collaborators: 10,
    shared_group_id: '',
    start_date: '',
    due_date: ''
  });

  // Update form data when project loads
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        project_type: project.project_type || 'personal',
        status: project.status || 'planning',
        is_public_joinable: project.is_public_joinable || false,
        max_collaborators: project.max_collaborators || 10,
        shared_group_id: project.shared_group_id ? project.shared_group_id.toString() : '',
        start_date: project.start_date || '',
        due_date: project.due_date || ''
      });
    }
  }, [project]);

  const updateMutation = {
    mutate: (data: any) => {
      updateProject({ projectId, updates: data });
      router.push(`/projects/${projectId}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const projectData: any = {
        ...formData,
        max_collaborators: parseInt(formData.max_collaborators.toString()),
        start_date: formData.start_date || undefined,
        due_date: formData.due_date || undefined
      };

      // Only include shared_group_id if a group is actually selected
      if (formData.shared_group_id && formData.shared_group_id !== '') {
        projectData.shared_group_id = formData.shared_group_id;
      } else {
        projectData.shared_group_id = null; // Explicitly remove group association
      }

      updateMutation.mutate(projectData);
    } catch (error) {
      console.error('Failed to update project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleDateChange = (field: string) => (isoDate: string | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: isoDate || ''
    }));
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      deleteProject(projectId);
      setShowDeleteModal(false);
      router.push('/projects/');
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setIsDeleting(false);
    }
  };

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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/projects/${projectId}`} className="p-2 hover:bg-gray-100 rounded-md">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
          <p className="text-gray-600">Update your project settings and configuration</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-adhd-primary-500"
              placeholder="e.g. ADHD-Friendly Home Organization"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-adhd-primary-500"
              placeholder="Describe your project's purpose and goals..."
            />
          </div>
        </div>

        {/* Project Settings */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-adhd-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900">Project Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="project_type" className="block text-sm font-medium text-gray-700 mb-1">
                Project Type *
              </label>
              <select
                id="project_type"
                name="project_type"
                required
                value={formData.project_type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-adhd-primary-500"
              >
                <option value="personal">🏠 Personal (Private)</option>
                <option value="shared">👥 Shared (Invite Only)</option>
                <option value="public">🌍 Public (Community)</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-adhd-primary-500"
              >
                <option value="planning">📋 Planning</option>
                <option value="active">🚀 Active</option>
                <option value="on_hold">⏸️ On Hold</option>
                <option value="completed">✅ Completed</option>
                <option value="archived">📦 Archived</option>
              </select>
            </div>
          </div>

          {/* Group Selection */}
          <div className="mt-4">
            <label htmlFor="shared_group_id" className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="inline h-4 w-4 mr-1" />
              Associate with Shared Group (Optional)
            </label>
            <select
              id="shared_group_id"
              name="shared_group_id"
              value={formData.shared_group_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-adhd-primary-500"
            >
              <option value="">No Group</option>
              {groups.map((group: Group) => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.member_count} members)
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Link this project to a support group for shared accountability and collaboration
            </p>
          </div>

          {/* Collaboration Settings */}
          {formData.project_type !== 'personal' && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_public_joinable"
                  name="is_public_joinable"
                  checked={formData.is_public_joinable}
                  onChange={handleChange}
                  className="h-4 w-4 text-adhd-primary-600 focus:ring-adhd-primary-500 border-gray-300 rounded"
                  disabled={formData.project_type === 'personal'}
                />
                <label htmlFor="is_public_joinable" className="ml-2 text-sm text-gray-700">
                  Allow public users to join
                </label>
              </div>

              <div>
                <label htmlFor="max_collaborators" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Collaborators
                </label>
                <input
                  type="number"
                  id="max_collaborators"
                  name="max_collaborators"
                  min="1"
                  max="100"
                  value={formData.max_collaborators}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-adhd-primary-500"
                  disabled={formData.project_type === 'personal'}
                />
              </div>
            </div>
          )}
        </div>

        {/* Timing */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-pebbles-500" />
            <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              id="start_date"
              name="start_date"
              label="Start Date"
              value={formData.start_date}
              onChange={handleDateChange('start_date')}
              showPreview={true}
            />

            <DatePicker
              id="due_date"
              name="due_date"
              label="Due Date"
              value={formData.due_date}
              onChange={handleDateChange('due_date')}
              showPreview={true}
            />
          </div>
        </div>

        {/* Submit & Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Project
          </button>
          
          <div className="flex gap-3">
            <Link href={`/projects/${projectId}`} className="btn-secondary">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting || isUpdating}
              className="btn-primary disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting || isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Project</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "<strong>{project.name}</strong>"? 
                This will permanently remove the project and all associated tasks.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 btn-secondary"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
