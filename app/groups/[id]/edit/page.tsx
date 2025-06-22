'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ArrowLeft, Save, Trash2, Users, Settings, Target, Zap, Heart, Shield, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function EditGroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string; // Now using string instead of parseInt
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: group, isLoading } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => api.getGroup(groupId),
    enabled: !!groupId
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    group_focus_sessions: true,
    shared_energy_tracking: false,
    group_dopamine_celebrations: true,
    collaborative_task_chunking: true,
    group_break_reminders: true,
    accountability_features: true
  });

  // Update form data when group data loads
  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || '',
                description: group.description || '',
        group_focus_sessions: group.group_focus_sessions ?? true,
        shared_energy_tracking: group.shared_energy_tracking ?? false,
        group_dopamine_celebrations: group.group_dopamine_celebrations ?? true,
        collaborative_task_chunking: group.collaborative_task_chunking ?? true,
        group_break_reminders: group.group_break_reminders ?? true,
        accountability_features: group.accountability_features ?? true
      });
    }
  }, [group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.updateGroup(groupId, formData);
      router.push('/groups');
    } catch (error) {
      console.error('Failed to update group:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await api.deleteGroup(groupId);
      router.push('/groups');
    } catch (error) {
      console.error('Failed to delete group:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-adhd-primary-500"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Group not found</h3>
        <Link href="/groups" className="btn-primary">
          Back to Groups
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/groups" className="p-2 hover:bg-gray-100 rounded-md">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Group</h1>
            <p className="text-gray-600">Update your ADHD support group settings</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDeleteModal(true)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
          title="Delete Group"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Group Stats */}
      <div className="card bg-gradient-to-r from-adhd-primary-50 to-adhd-secondary-50 border-l-4 border-adhd-primary-500">
        <div className="flex items-center gap-4">
          <Users className="h-8 w-8 text-adhd-primary-600" />
          <div>
            <h3 className="font-semibold text-adhd-primary-900">{group.member_count} Members</h3>
            <p className="text-sm text-adhd-primary-700">
              Created on {new Date(group.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Group Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-adhd-primary-500"
              placeholder="e.g. ADHD Productivity Partners"
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
              placeholder="Describe your group's purpose and what members can expect..."
            />
          </div>
        </div>

        {/* ADHD-Specific Features */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-adhd-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900">ADHD Features</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-adhd-primary-50 rounded-md">
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  id="group_focus_sessions"
                  checked={formData.group_focus_sessions}
                  onChange={(e) => handleSettingChange('group_focus_sessions', e.target.checked)}
                  className="h-4 w-4 text-adhd-primary-600 focus:ring-adhd-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="group_focus_sessions" className="font-medium text-adhd-primary-900 cursor-pointer">
                  <Target className="inline h-4 w-4 mr-1" />
                  Group Focus Sessions
                </label>
                <p className="text-sm text-adhd-primary-700 mt-1">
                  Body doubling sessions where members work together, reducing start-up difficulty and increasing motivation through shared energy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-adhd-secondary-50 rounded-md">
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  id="shared_energy_tracking"
                  checked={formData.shared_energy_tracking}
                  onChange={(e) => handleSettingChange('shared_energy_tracking', e.target.checked)}
                  className="h-4 w-4 text-adhd-secondary-600 focus:ring-adhd-secondary-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="shared_energy_tracking" className="font-medium text-adhd-secondary-900 cursor-pointer">
                  <Zap className="inline h-4 w-4 mr-1" />
                  Shared Energy Tracking
                </label>
                <p className="text-sm text-adhd-secondary-700 mt-1">
                  Members can share their energy levels to help others understand when they're most available for collaboration.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-pebbles-50 rounded-md">
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  id="group_dopamine_celebrations"
                  checked={formData.group_dopamine_celebrations}
                  onChange={(e) => handleSettingChange('group_dopamine_celebrations', e.target.checked)}
                  className="h-4 w-4 text-pebbles-600 focus:ring-pebbles-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="group_dopamine_celebrations" className="font-medium text-pebbles-900 cursor-pointer">
                  🎉 Group Dopamine Celebrations
                </label>
                <p className="text-sm text-pebbles-700 mt-1">
                  Collective celebration of wins, big and small, to amplify the dopamine reward and build positive momentum.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-rock-50 rounded-md">
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  id="collaborative_task_chunking"
                  checked={formData.collaborative_task_chunking}
                  onChange={(e) => handleSettingChange('collaborative_task_chunking', e.target.checked)}
                  className="h-4 w-4 text-rock-600 focus:ring-rock-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="collaborative_task_chunking" className="font-medium text-rock-900 cursor-pointer">
                  <Users className="inline h-4 w-4 mr-1" />
                  Collaborative Task Chunking
                </label>
                <p className="text-sm text-rock-700 mt-1">
                  Work together to break down complex tasks into manageable pieces, leveraging different perspectives and strengths.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-sand-50 rounded-md">
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  id="group_break_reminders"
                  checked={formData.group_break_reminders}
                  onChange={(e) => handleSettingChange('group_break_reminders', e.target.checked)}
                  className="h-4 w-4 text-sand-600 focus:ring-sand-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="group_break_reminders" className="font-medium text-sand-900 cursor-pointer">
                  ⏰ Group Break Reminders
                </label>
                <p className="text-sm text-sand-700 mt-1">
                  Gentle reminders for the group to take breaks, preventing hyperfocus burnout and maintaining sustainable productivity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-adhd-primary-50 rounded-md">
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  id="accountability_features"
                  checked={formData.accountability_features}
                  onChange={(e) => handleSettingChange('accountability_features', e.target.checked)}
                  className="h-4 w-4 text-adhd-primary-600 focus:ring-adhd-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="accountability_features" className="font-medium text-adhd-primary-900 cursor-pointer">
                  <Shield className="inline h-4 w-4 mr-1" />
                  Accountability Features
                </label>
                <p className="text-sm text-adhd-primary-700 mt-1">
                  Supportive check-ins, progress sharing, and gentle accountability to help members stay on track with their goals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Link href="/groups" className="btn-secondary">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Updating...' : 'Update Group'}
          </button>
        </div>
      </form>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Group</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete "<strong>{group.name}</strong>"? This action cannot be undone.
              </p>
              
              <div className="bg-red-50 p-3 rounded-md">
                <p className="text-sm text-red-700">
                  <strong>This will:</strong>
                </p>
                <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                  <li>Remove all {group.member_count} members from the group</li>
                  <li>Delete all group-specific data and settings</li>
                  <li>Cannot be recovered after deletion</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 mr-2 inline" />
                {isDeleting ? 'Deleting...' : 'Delete Group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
