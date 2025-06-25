'use client';

import { Task } from '@/lib/api';
import { Clock, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  projectColor?: string;
}

const impactConfig = {
  rock: {
    label: '🏔️ Rock',
    color: 'border-rock-500 bg-rock-50',
    description: 'Major impact task'
  },
  pebbles: {
    label: '🪨 Pebbles', 
    color: 'border-pebbles-500 bg-pebbles-50',
    description: 'Important progress task'
  },
  sand: {
    label: '⏳ Sand',
    color: 'border-sand-500 bg-sand-50', 
    description: 'Nice to have task'
  }
};

const priorityConfig = {
  urgent: { label: 'Urgent', color: 'text-red-600', icon: AlertCircle },
  high: { label: 'High', color: 'text-orange-600', icon: AlertCircle },
  medium: { label: 'Medium', color: 'text-yellow-600', icon: Circle },
  low: { label: 'Low', color: 'text-green-600', icon: Circle }
};

export default function TaskCard({ task, onComplete, projectColor }: TaskCardProps) {
  const impact = impactConfig[task.impact_size];
  const priority = priorityConfig[task.priority];
  const PriorityIcon = priority.icon;

  return (
    <div className={cn(
      'card border-l-4 hover:shadow-md transition-shadow',
      impact.color
    )}>
      {/* Project context bar and info */}
      {task.project_name && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span className="font-medium">Project:</span>
            <span className="bg-gray-100 px-2 py-1 rounded-full">{task.project_name}</span>
            {task.project_type && task.project_type !== 'personal' && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.project_type === 'shared' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {task.project_type.toUpperCase()}
              </span>
            )}
          </div>
          {projectColor && (
            <div 
              className="w-full h-1 rounded-full"
              style={{ backgroundColor: projectColor }}
            />
          )}
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          )}
        </div>
        
        <button
          onClick={() => onComplete?.(task.id)}
          className="ml-3 p-1 hover:bg-gray-100 rounded transition-colors"
          disabled={task.status === 'completed'}
        >
          {task.status === 'completed' ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="font-medium">{impact.label}</span>
          <span className="text-gray-500">•</span>
          <span className={priority.color}>{priority.label}</span>
        </div>
        
        {task.estimated_duration && (
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{task.estimated_duration}min</span>
          </div>
        )}
      </div>

      {task.dopamine_reward && (
        <div className="mt-3 p-2 bg-adhd-primary-50 rounded text-sm text-adhd-primary-700">
          <span className="font-medium">Reward:</span> {task.dopamine_reward}
        </div>
      )}
    </div>
  );
}
