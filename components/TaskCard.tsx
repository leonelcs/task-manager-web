'use client';

import { Task } from '@/lib/api';
import { Clock, CheckCircle, Circle, AlertCircle, MoreVertical, Edit, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef, useCallback } from 'react';
import { formatForDateInput, parseFromDateInput, formatDateEuropean } from '@/lib/dateUtils';
import DatePicker from '@/components/DatePicker';

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
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

export default function TaskCard({ task, onComplete, onUpdate, onDelete, projectColor }: TaskCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    impact_size: task.impact_size,
    estimated_duration: task.estimated_duration || '',
    due_date: task.due_date || ''
  });
  const actionsRef = useRef<HTMLDivElement>(null);
  const impact = impactConfig[task.impact_size];
  const priority = priorityConfig[task.priority];
  const PriorityIcon = priority.icon;

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showActions]);

  const handleEdit = () => {
    setIsEditing(true);
    setShowActions(false);
  };

  const handleSaveEdit = useCallback(async () => {
    try {
      const updates: Partial<Task> = {};
      
      // Only include changed fields
      if (editForm.title !== task.title) updates.title = editForm.title;
      if (editForm.description !== (task.description || '')) updates.description = editForm.description;
      if (editForm.priority !== task.priority) updates.priority = editForm.priority;
      if (editForm.impact_size !== task.impact_size) updates.impact_size = editForm.impact_size;
      if (editForm.estimated_duration !== (task.estimated_duration || '')) {
        updates.estimated_duration = editForm.estimated_duration ? parseInt(editForm.estimated_duration.toString()) : undefined;
      }
      if (editForm.due_date !== (task.due_date || '')) {
        updates.due_date = editForm.due_date || undefined;
      }

      if (Object.keys(updates).length > 0) {
        await onUpdate?.(task.id, updates);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }, [editForm, task, onUpdate]);

  const handleCancelEdit = useCallback(() => {
    // Reset form to original values
    setEditForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      impact_size: task.impact_size,
      estimated_duration: task.estimated_duration || '',
      due_date: task.due_date || ''
    });
    setIsEditing(false);
  }, [task]);

  const handleDateChange = (isoDate: string | null) => {
    setEditForm(prev => ({ 
      ...prev, 
      due_date: isoDate || '' 
    }));
  };

  // Handle keyboard shortcuts for edit mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditing) {
        if (event.key === 'Escape') {
          handleCancelEdit();
        } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
          handleSaveEdit();
        }
      }
    };

    if (isEditing) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isEditing, handleCancelEdit, handleSaveEdit]);

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
        {isEditing ? (
          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-adhd-primary-500"
                placeholder="Task title"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-adhd-primary-500"
                placeholder="Task description"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Impact</label>
                <select
                  value={editForm.impact_size}
                  onChange={(e) => setEditForm(prev => ({ ...prev, impact_size: e.target.value as Task['impact_size'] }))}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-adhd-primary-500"
                >
                  <option value="rock">🏔️ Rock</option>
                  <option value="pebbles">🪨 Pebbles</option>
                  <option value="sand">⏳ Sand</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-adhd-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={editForm.estimated_duration}
                onChange={(e) => setEditForm(prev => ({ ...prev, estimated_duration: e.target.value }))}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-adhd-primary-500"
                placeholder="15"
                min="1"
              />
            </div>
            
            <DatePicker
              label="Due Date"
              value={editForm.due_date}
              onChange={handleDateChange}
              showPreview={false}
              className="text-sm"
            />
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-adhd-primary-500 text-white text-sm px-3 py-1 rounded hover:bg-adhd-primary-600 transition-colors"
                title="Save changes (Ctrl/Cmd + Enter)"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                title="Cancel editing (Escape)"
              >
                Cancel
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              Tip: Ctrl/Cmd + Enter to save, Escape to cancel
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-1 ml-3">
              <button
                onClick={() => onComplete?.(task.id)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                disabled={task.status === 'completed'}
              >
                {task.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {(onUpdate || onDelete) && (
                <div className="relative" ref={actionsRef}>
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  {showActions && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                      {onUpdate && (
                        <button
                          onClick={() => {
                            setShowActions(false);
                            handleEdit();
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            setShowActions(false);
                            onDelete(task.id);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <>
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
            
            {task.due_date && (
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Due {formatDateEuropean(task.due_date)}</span>
              </div>
            )}
          </div>

          {task.dopamine_reward && (
            <div className="mt-3 p-2 bg-adhd-primary-50 rounded text-sm text-adhd-primary-700">
              <span className="font-medium">Reward:</span> {task.dopamine_reward}
            </div>
          )}
        </>
      )}
    </div>
  );
}
