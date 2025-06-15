import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProjectColor(projectType: string, index: number = 0): string {
  const colors = {
    personal: ['#3b82f6', '#1d4ed8', '#2563eb'],
    shared: ['#22c55e', '#16a34a', '#15803d'],
    public: ['#f59e0b', '#d97706', '#b45309']
  };
  
  const typeColors = colors[projectType as keyof typeof colors] || colors.personal;
  return typeColors[index % typeColors.length];
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}
