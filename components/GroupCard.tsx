import { Group } from '@/lib/api';
import { formatDateEuropean } from '@/lib/dateUtils';
import { Users, Calendar, Settings, Edit } from 'lucide-react';
import Link from 'next/link';

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
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
          <span>Created {formatDateEuropean(group.created_at)}</span>
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
