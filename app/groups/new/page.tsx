'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Save, Users, Settings, Target, Zap, Heart, Shield } from 'lucide-react';
import Link from 'next/link';

export default function NewGroupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    adhd_settings: {
      group_focus_sessions: true,
      shared_energy_tracking: false,
      group_dopamine_celebrations: true,
      collaborative_task_chunking: true,
      group_break_reminders: true,
      accountability_features: true
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.createGroup(formData);
      router.push('/groups');
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setIsSubmitting(false);
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
      adhd_settings: {
        ...prev.adhd_settings,
        [setting]: value
      }
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/groups" className="p-2 hover:bg-gray-100 rounded-md">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New ADHD Support Group</h1>
          <p className="text-gray-600">Build a supportive community for your ADHD journey</p>
        </div>
      </div>

      {/* ADHD Benefits Info */}
      <div className="card bg-gradient-to-r from-adhd-primary-50 to-adhd-secondary-50 border-l-4 border-adhd-primary-500">
        <div className="flex items-start gap-3">
          <Heart className="h-6 w-6 text-adhd-primary-600 mt-1" />
          <div>
            <h3 className="font-semibold text-adhd-primary-900 mb-2">Why Create an ADHD Support Group?</h3>
            <ul className="text-sm text-adhd-primary-700 space-y-1">
              <li>• Reduced isolation and increased understanding</li>
              <li>• Shared accountability and mutual motivation</li>
              <li>• Community-driven dopamine celebrations</li>
              <li>• Collaborative task management and body doubling</li>
              <li>• Safe space for ADHD-specific challenges</li>
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
                  checked={formData.adhd_settings.group_focus_sessions}
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
                  checked={formData.adhd_settings.shared_energy_tracking}
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
                  checked={formData.adhd_settings.group_dopamine_celebrations}
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
                  checked={formData.adhd_settings.collaborative_task_chunking}
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
                  checked={formData.adhd_settings.group_break_reminders}
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
                  checked={formData.adhd_settings.accountability_features}
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

        {/* Community Guidelines Preview */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Guidelines (Preview)</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <ul className="text-sm text-gray-700 space-y-2">
              <li>🤝 <strong>Support over judgment:</strong> We celebrate neurodivergent differences</li>
              <li>🎯 <strong>Progress over perfection:</strong> Every small step counts</li>
              <li>💬 <strong>Understanding over criticism:</strong> We assume positive intent</li>
              <li>🌟 <strong>Celebration over comparison:</strong> Your journey is unique</li>
              <li>⚡ <strong>Energy-aware communication:</strong> Respect different energy levels</li>
            </ul>
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
            {isSubmitting ? 'Creating Group...' : 'Create Group'}
          </button>
        </div>
      </form>
    </div>
  );
}
