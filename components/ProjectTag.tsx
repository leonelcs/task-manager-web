'use client';

import { Project } from '@/lib/api';

interface ProjectTagProps {
  project: Project;
  color?: string;
  size?: 'sm' | 'md';
}

const projectTypeColors = {
  personal: '#3b82f6',
  shared: '#22c55e', 
  public: '#f59e0b'
};

export default function ProjectTag({ project, color, size = 'sm' }: ProjectTagProps) {
  const tagColor = color || projectTypeColors[project.project_type];
  
  return (
    <span 
      className={`inline-flex items-center px-2 py-1 rounded-full text-white font-medium ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      }`}
      style={{ backgroundColor: tagColor }}
    >
      {project.name}
    </span>
  );
}
