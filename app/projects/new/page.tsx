'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api, Group } from '@/lib/api';
import { ArrowLeft, Save, Settings, Target, Users, Calendar, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import DatePicker from '@/components/DatePicker';

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        delete projectData.shared_group_id;
      }

      await api.createProject(projectData);
      router.push('/projects');
    } catch (error) {
      console.error('Failed to create project:', error);
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/projects" className="p-2 hover:bg-gray-100 rounded-md">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600">Organize your tasks with ADHD-friendly project management</p>
        </div>
      </div>

      {/* ADHD Benefits Info */}
      <div className="card bg-gradient-to-r from-adhd-primary-50 to-pebbles-50 border-l-4 border-adhd-primary-500">
        <div className="flex items-start gap-3">
          <Target className="h-6 w-6 text-adhd-primary-600 mt-1" />
          <div>
            <h3 className="font-semibold text-adhd-primary-900 mb-2">Why Create Projects?</h3>
            <ul className="text-sm text-adhd-primary-700 space-y-1">
              <li>• Break down overwhelming goals into manageable chunks</li>
              <li>• Visual organization prevents tasks from getting lost</li>
              <li>• Track progress for dopamine-boosting wins</li>
              <li>• Collaborate with others for accountability</li>
              <li>• Context switching made easier with clear boundaries</li>
            </ul>
          </div>
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

        {/* ADHD Tips */}
        <div className="border-t pt-6">
          <div className="bg-adhd-secondary-50 border border-adhd-secondary-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <FolderOpen className="h-5 w-5 text-adhd-secondary-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-adhd-secondary-900 mb-2">
                  ADHD Project Success Tips
                </p>
                <ul className="text-adhd-secondary-700 space-y-1">
                  <li>• Start with 3-5 main tasks to avoid overwhelm</li>
                  <li>• Use specific, action-oriented project names</li>
                  <li>• Set realistic deadlines with buffer time</li>
                  <li>• Consider linking to a support group for accountability</li>
                  <li>• Break down complex projects into smaller sub-projects</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Link href="/projects" className="btn-secondary">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Creating Project...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
