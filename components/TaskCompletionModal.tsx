'use client';

import { useState } from 'react';
import { X, Clock, CheckCircle } from 'lucide-react';

interface TaskCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (duration: number, notes?: string) => void;
  taskTitle: string;
  estimatedDuration?: number;
}

export default function TaskCompletionModal({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
  estimatedDuration
}: TaskCompletionModalProps) {
  const [actualDuration, setActualDuration] = useState(estimatedDuration || 30);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actualDuration < 1) {
      alert('Please enter a valid duration (at least 1 minute)');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onConfirm(actualDuration, notes.trim() || undefined);
      handleClose();
    } catch (error) {
      console.error('Failed to complete task:', error);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setActualDuration(estimatedDuration || 30);
    setNotes('');
    setIsSubmitting(false);
    onClose();
  };

  const durationComparison = estimatedDuration ? 
    actualDuration > estimatedDuration ? 
      `${actualDuration - estimatedDuration} min over estimate` :
      actualDuration < estimatedDuration ?
        `${estimatedDuration - actualDuration} min under estimate` :
        'Right on target! 🎯' : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Task Completed! 🎉
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-1">Completed Task</h3>
            <p className="text-green-700 text-sm">{taskTitle}</p>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-1" />
              How long did this task actually take?
            </label>
            <div className="relative">
              <input
                type="number"
                id="duration"
                min="1"
                value={actualDuration}
                onChange={(e) => setActualDuration(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-adhd-primary-500 focus:border-adhd-primary-500"
                placeholder="Enter minutes"
                required
                disabled={isSubmitting}
              />
              <span className="absolute right-3 top-2 text-gray-500 text-sm">minutes</span>
            </div>
            
            {estimatedDuration && (
              <div className="mt-2 text-sm">
                <p className="text-gray-600">
                  Estimated: {estimatedDuration} minutes
                </p>
                {durationComparison && (
                  <p className={`font-medium ${
                    actualDuration > estimatedDuration ? 'text-orange-600' :
                    actualDuration < estimatedDuration ? 'text-blue-600' :
                    'text-green-600'
                  }`}>
                    {durationComparison}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Completion Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-adhd-primary-500 focus:border-adhd-primary-500"
              rows={3}
              placeholder="How did it go? Any insights or challenges?"
              disabled={isSubmitting}
            />
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            💡 <strong>ADHD Tip:</strong> This data helps improve future time estimates and builds awareness of your productivity patterns!
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || actualDuration < 1}
            >
              {isSubmitting ? 'Completing...' : 'Complete Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
