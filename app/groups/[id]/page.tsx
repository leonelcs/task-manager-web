'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ArrowLeft, Edit, Users, Calendar, Settings, Target, Zap, Shield, Heart, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import InviteMembersModal from '@/components/InviteMembersModal';

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = parseInt(params.id as string);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { data: group, isLoading } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => api.getGroup(groupId),
    enabled: !!groupId
  });

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
    <>
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/groups" className="p-2 hover:bg-gray-100 rounded-md">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
            <p className="text-gray-600">ADHD Support Group</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="btn-secondary"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Members
          </button>
          <Link href={`/groups/${groupId}/edit`} className="btn-primary">
            <Edit className="h-4 w-4 mr-2" />
            Edit Group
          </Link>
        </div>
      </div>

      {/* Group Overview */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">About This Group</h2>
            {group.description && (
              <p className="text-gray-700 mb-4">{group.description}</p>
            )}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            group.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {group.is_active ? 'Active' : 'Inactive'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-adhd-primary-50 rounded-md">
            <Users className="h-6 w-6 text-adhd-primary-600" />
            <div>
              <p className="text-sm text-adhd-primary-700">Members</p>
              <p className="text-xl font-semibold text-adhd-primary-900">{group.member_count}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-adhd-secondary-50 rounded-md">
            <Target className="h-6 w-6 text-adhd-secondary-600" />
            <div>
              <p className="text-sm text-adhd-secondary-700">Projects</p>
              <p className="text-xl font-semibold text-adhd-secondary-900">{group.project_count || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-pebbles-50 rounded-md">
            <Calendar className="h-6 w-6 text-pebbles-600" />
            <div>
              <p className="text-sm text-pebbles-700">Created</p>
              <p className="text-sm font-semibold text-pebbles-900">
                {new Date(group.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ADHD Features */}
      {group.adhd_settings && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-adhd-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900">ADHD Features</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.adhd_settings.group_focus_sessions && (
              <div className="flex items-start gap-3 p-4 bg-adhd-primary-50 rounded-md border-l-4 border-adhd-primary-500">
                <Target className="h-6 w-6 text-adhd-primary-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-adhd-primary-900 mb-1">Group Focus Sessions</h3>
                  <p className="text-sm text-adhd-primary-700">
                    Body doubling sessions to work together and stay focused through shared energy and accountability.
                  </p>
                </div>
              </div>
            )}

            {group.adhd_settings.shared_energy_tracking && (
              <div className="flex items-start gap-3 p-4 bg-adhd-secondary-50 rounded-md border-l-4 border-adhd-secondary-500">
                <Zap className="h-6 w-6 text-adhd-secondary-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-adhd-secondary-900 mb-1">Shared Energy Tracking</h3>
                  <p className="text-sm text-adhd-secondary-700">
                    Members can share their energy levels to better coordinate collaboration and support.
                  </p>
                </div>
              </div>
            )}

            {group.adhd_settings.group_dopamine_celebrations && (
              <div className="flex items-start gap-3 p-4 bg-pebbles-50 rounded-md border-l-4 border-pebbles-500">
                <div className="text-2xl mt-1">🎉</div>
                <div>
                  <h3 className="font-semibold text-pebbles-900 mb-1">Group Dopamine Celebrations</h3>
                  <p className="text-sm text-pebbles-700">
                    Collective celebration of wins and achievements to amplify positive reinforcement and motivation.
                  </p>
                </div>
              </div>
            )}

            {group.adhd_settings.collaborative_task_chunking && (
              <div className="flex items-start gap-3 p-4 bg-rock-50 rounded-md border-l-4 border-rock-500">
                <Users className="h-6 w-6 text-rock-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-rock-900 mb-1">Collaborative Task Chunking</h3>
                  <p className="text-sm text-rock-700">
                    Work together to break down complex tasks into manageable pieces using collective wisdom.
                  </p>
                </div>
              </div>
            )}

            {group.adhd_settings.group_break_reminders && (
              <div className="flex items-start gap-3 p-4 bg-sand-50 rounded-md border-l-4 border-sand-500">
                <div className="text-2xl mt-1">⏰</div>
                <div>
                  <h3 className="font-semibold text-sand-900 mb-1">Group Break Reminders</h3>
                  <p className="text-sm text-sand-700">
                    Gentle reminders to take breaks and avoid hyperfocus burnout through community care.
                  </p>
                </div>
              </div>
            )}

            {group.adhd_settings.accountability_features && (
              <div className="flex items-start gap-3 p-4 bg-adhd-primary-50 rounded-md border-l-4 border-adhd-primary-500">
                <Shield className="h-6 w-6 text-adhd-primary-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-adhd-primary-900 mb-1">Accountability Features</h3>
                  <p className="text-sm text-adhd-primary-700">
                    Supportive check-ins and progress sharing to help members stay on track with their goals.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Community Guidelines */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">Community Guidelines</h2>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">🤝</span>
                <div>
                  <h4 className="font-medium text-gray-900">Support over judgment</h4>
                  <p className="text-sm text-gray-600">We celebrate neurodivergent differences and provide unconditional support</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-lg">🎯</span>
                <div>
                  <h4 className="font-medium text-gray-900">Progress over perfection</h4>
                  <p className="text-sm text-gray-600">Every small step counts and deserves recognition</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-lg">💬</span>
                <div>
                  <h4 className="font-medium text-gray-900">Understanding over criticism</h4>
                  <p className="text-sm text-gray-600">We assume positive intent and respond with empathy</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">🌟</span>
                <div>
                  <h4 className="font-medium text-gray-900">Celebration over comparison</h4>
                  <p className="text-sm text-gray-600">Your unique journey and achievements matter</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-lg">⚡</span>
                <div>
                  <h4 className="font-medium text-gray-900">Energy-aware communication</h4>
                  <p className="text-sm text-gray-600">We respect different energy levels and availability</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-lg">🔒</span>
                <div>
                  <h4 className="font-medium text-gray-900">Safe space commitment</h4>
                  <p className="text-sm text-gray-600">What's shared in the group stays in the group</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-gradient-to-r from-adhd-primary-50 to-adhd-secondary-50 border-l-4 border-adhd-primary-500">
        <div className="flex items-start gap-3">
          <Target className="h-6 w-6 text-adhd-primary-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-adhd-primary-900 mb-2">Ready to Get Started?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-adhd-primary-800">For New Members:</h4>
                <ul className="text-sm text-adhd-primary-700 space-y-1">
                  <li>• Introduce yourself to the group</li>
                  <li>• Share your ADHD journey and goals</li>
                  <li>• Join your first focus session</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-adhd-primary-800">For Active Members:</h4>
                <ul className="text-sm text-adhd-primary-700 space-y-1">
                  <li>• Check in on group progress</li>
                  <li>• Celebrate recent wins together</li>
                  <li>• Schedule collaborative work sessions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Invite Members Modal */}
    <InviteMembersModal
      isOpen={isInviteModalOpen}
      onClose={() => setIsInviteModalOpen(false)}
      groupId={groupId}
      groupName={group.name}
    />
    </>
  );
}
