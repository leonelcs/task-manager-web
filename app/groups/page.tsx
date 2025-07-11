'use client';

import { useGroups } from '@/hooks/useGroups';
import { Group } from '@/lib/api';
import GroupCard from '@/components/GroupCard';
import { Plus, Users } from 'lucide-react';
import Link from 'next/link';

export default function GroupsPage() {
  const { groups, isLoading } = useGroups();

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
