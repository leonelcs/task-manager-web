'use client';

import { useQuery } from '@tanstack/react-query';
import { api, Group } from '@/lib/api';
import { Plus, Users, Calendar, Settings, Edit } from 'lucide-react';
import Link from 'next/link';

export default function GroupsPage() {
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => api.getGroups()
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-adhd-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ADHD Support Groups</h1>
          <p className="text-gray-600">Connect with others and build accountability partnerships</p>
        </div>
        <Link href="/groups/new" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Link>
      </div>

      {/* ADHD-Friendly Features Info */}
      <div className="card bg-gradient-to-r from-adhd-primary-50 to-adhd-secondary-50 border-l-4 border-adhd-primary-500">
        <div className="flex items-start gap-3">
          <Users className="h-6 w-6 text-adhd-primary-600 mt-1" />
          <div>
            <h3 className="font-semibold text-adhd-primary-900 mb-2">ADHD-Focused Group Features</h3>
            <ul className="text-sm text-adhd-primary-700 space-y-1">
              <li>• Body doubling and focus sessions</li>
              <li>• Shared energy level tracking</li>
              <li>• Group dopamine celebrations</li>
              <li>• Collaborative task chunking</li>
              <li>• Accountability check-ins</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group: Group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
          <p className="text-gray-600 mb-4">
            Join or create your first ADHD support group to connect with others
          </p>
          <Link href="/groups/new" className="btn-primary">
            Create Your First Group
          </Link>
        </div>
      )}
    </div>
  );
}

function GroupCard({ group }: { group: Group }) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/groups/${group.id}`} className="hover:text-adhd-primary-600">
              <h3 className="font-semibold text-gray-900">{group.name}</h3>
            </Link>
            <Link 
              href={`/groups/${group.id}/edit`}
              className="p-1 text-gray-400 hover:text-adhd-primary-600 hover:bg-adhd-primary-50 rounded"
              title="Edit group"
            >
              <Edit className="h-4 w-4" />
            </Link>
          </div>
          {group.description && (
            <p className="text-sm text-gray-600 mb-2">{group.description}</p>
          )}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          group.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {group.is_active ? 'Active' : 'Inactive'}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{group.member_count} members</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>Created {new Date(group.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* ADHD Features */}
      <div className="border-t pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-4 w-4 text-adhd-primary-500" />
          <span className="text-sm font-medium text-adhd-primary-700">ADHD Features:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {group.group_focus_sessions && (
            <span className="text-xs bg-adhd-primary-100 text-adhd-primary-700 px-2 py-1 rounded">
              Focus Sessions
            </span>
          )}
          {group.shared_energy_tracking && (
            <span className="text-xs bg-adhd-secondary-100 text-adhd-secondary-700 px-2 py-1 rounded">
              Energy Tracking
            </span>
          )}
          {group.group_dopamine_celebrations && (
            <span className="text-xs bg-pebbles-100 text-pebbles-700 px-2 py-1 rounded">
              Celebrations
            </span>
          )}
          {group.accountability_features && (
            <span className="text-xs bg-rock-100 text-rock-700 px-2 py-1 rounded">
              Accountability
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
