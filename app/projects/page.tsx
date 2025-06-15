'use client';

import { useQuery } from '@tanstack/react-query';
import { api, Project } from '@/lib/api';
import ProjectTag from '@/components/ProjectTag';
import { getProjectColor } from '@/lib/utils';
import { Plus, FolderOpen, Users, Calendar, Target } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.getProjects()
  });

  const projectsByType = {
    personal: projects.filter((p: Project) => p.project_type === 'personal'),
    shared: projects.filter((p: Project) => p.project_type === 'shared'),
    public: projects.filter((p: Project) => p.project_type === 'public')
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Organize your tasks across different projects and contexts</p>
        </div>
        <Link href="/projects/new" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card border-l-4 border-adhd-primary-500">
          <div className="flex items-center">
            <FolderOpen className="h-8 w-8 text-adhd-primary-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Personal Projects</p>
              <p className="text-2xl font-bold text-adhd-primary-600">{projectsByType.personal.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card border-l-4 border-adhd-secondary-500">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-adhd-secondary-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Shared Projects</p>
              <p className="text-2xl font-bold text-adhd-secondary-600">{projectsByType.shared.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card border-l-4 border-pebbles-500">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-pebbles-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Public Projects</p>
              <p className="text-2xl font-bold text-pebbles-600">{projectsByType.public.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Projects */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectsByType.personal.map((project: Project, index: number) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              color={getProjectColor('personal', index)}
            />
          ))}
          {projectsByType.personal.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No personal projects yet. <Link href="/projects/new" className="text-adhd-primary-600">Create your first project</Link>
            </div>
          )}
        </div>
      </div>

      {/* Shared Projects */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Shared Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectsByType.shared.map((project: Project, index: number) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              color={getProjectColor('shared', index)}
            />
          ))}
          {projectsByType.shared.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No shared projects yet. Start collaborating with others!
            </div>
          )}
        </div>
      </div>

      {/* Public Projects */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Public Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectsByType.public.map((project: Project, index: number) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              color={getProjectColor('public', index)}
            />
          ))}
          {projectsByType.public.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No public projects yet. Share your work with the community!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, color }: { project: Project; color: string }) {
  return (
    <Link href={`/projects/${project.id}`} className="block">
      <div className="card hover:shadow-md transition-shadow border-l-4" style={{ borderColor: color }}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
            {project.description && (
              <p className="text-sm text-gray-600 mb-2">{project.description}</p>
            )}
          </div>
          <ProjectTag project={project} color={color} />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>{project.task_count} tasks</span>
            <span>{project.collaborator_count} members</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full" 
                style={{ 
                  width: `${project.completion_percentage}%`, 
                  backgroundColor: color 
                }}
              />
            </div>
            <span className="text-xs">{project.completion_percentage}%</span>
          </div>
        </div>

        {project.due_date && (
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Due {new Date(project.due_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
