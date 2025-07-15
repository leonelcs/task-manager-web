'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, EnergyLogCreate } from '@/lib/api';
import { Battery, BatteryLow, Zap, Clock, MessageCircle } from 'lucide-react';

export default function EnergyLogger() {
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [duration, setDuration] = useState<number>(60);
  const [notes, setNotes] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  const queryClient = useQueryClient();

  const logEnergyMutation = useMutation({
    mutationFn: (energyData: EnergyLogCreate) => api.logEnergyLevel(energyData),
    onSuccess: () => {
      // Reset form
      setNotes('');
      setIsExpanded(false);
      // Refresh energy log data if we have it cached
      queryClient.invalidateQueries({ queryKey: ['energy-log'] });
    },
    onError: (error) => {
      console.error('Failed to log energy level:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const energyData: EnergyLogCreate = {
      energy_level: energyLevel,
      duration_minutes: duration,
      notes: notes.trim() || undefined
    };

    logEnergyMutation.mutate(energyData);
  };

  const energyLevels = [
    {
      value: 'low' as const,
      label: 'Low Energy',
      icon: BatteryLow,
      color: 'text-red-500',
      bgColor: 'bg-red-50 border-red-200',
      description: 'Perfect for easy, routine tasks'
    },
    {
      value: 'medium' as const,
      label: 'Medium Energy',
      icon: Battery,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 border-yellow-200',
      description: 'Good for regular tasks and planning'
    },
    {
      value: 'high' as const,
      label: 'High Energy',
      icon: Zap,
      color: 'text-green-500',
      bgColor: 'bg-green-50 border-green-200',
      description: 'Ready for complex, challenging work'
    }
  ];

  return (
    <div className="card border-l-4 border-adhd-primary-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Zap className="h-6 w-6 text-adhd-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Energy Level Tracker</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-adhd-primary-600 hover:text-adhd-primary-700"
        >
          {isExpanded ? 'Collapse' : 'Quick Log'}
        </button>
      </div>

      {!isExpanded ? (
        <div className="grid grid-cols-3 gap-2">
          {energyLevels.map((level) => {
            const Icon = level.icon;
            return (
              <button
                key={level.value}
                onClick={() => {
                  setEnergyLevel(level.value);
                  const energyData: EnergyLogCreate = {
                    energy_level: level.value,
                    duration_minutes: 60
                  };
                  logEnergyMutation.mutate(energyData);
                }}
                disabled={logEnergyMutation.isPending}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200 text-center
                  ${level.bgColor} hover:shadow-md
                  ${logEnergyMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                `}
              >
                <Icon className={`h-6 w-6 mx-auto mb-1 ${level.color}`} />
                <div className="text-sm font-medium text-gray-700">{level.label.split(' ')[0]}</div>
              </button>
            );
          })}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Energy Level
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {energyLevels.map((level) => {
                const Icon = level.icon;
                return (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setEnergyLevel(level.value)}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-200
                      ${energyLevel === level.value 
                        ? `${level.bgColor} border-current shadow-md scale-105` 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${energyLevel === level.value ? level.color : 'text-gray-400'}`} />
                    <div className="text-sm font-medium text-gray-700">{level.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{level.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="h-4 w-4 inline mr-1" />
                Expected Duration (minutes)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="input w-full"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MessageCircle className="h-4 w-4 inline mr-1" />
                Notes (optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's affecting your energy?"
                className="input w-full"
                maxLength={100}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={logEnergyMutation.isPending}
              className="btn-primary flex items-center"
            >
              {logEnergyMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Log Energy Level
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {logEnergyMutation.isSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ⚡ Energy level logged successfully! This helps the AI understand your patterns.
          </p>
        </div>
      )}

      {logEnergyMutation.isError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Failed to log energy level. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}
