import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { api, Project } from '@/lib/api';

interface UseProjectsParams {
  project_type?: string | string[];
  status?: string;
}

export const useProjects = (params: UseProjectsParams = {}) => {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['projects', params],
    queryFn: () => api.getProjects(params),
    staleTime: 0, // Always consider data stale
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const createProjectMutation = useMutation({
    mutationFn: api.createProject,
    onSuccess: () => {
      // Invalidate all project queries
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.refetchQueries({ queryKey: ['projects'] });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ projectId, updates }: { projectId: string; updates: Partial<Project> }) =>
      api.updateProject(projectId, updates),
    onMutate: async ({ projectId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      // Snapshot previous value
      const previousProjects = queryClient.getQueryData(['projects', params]);

      // Optimistically update
      queryClient.setQueryData(['projects', params], (oldData: Project[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(project => 
          project.id === projectId ? { ...project, ...updates } : project
        );
      });

      return { previousProjects };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects', params], context.previousProjects);
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: api.deleteProject,
    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousProjects = queryClient.getQueryData(['projects', params]);

      queryClient.setQueryData(['projects', params], (oldData: Project[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter(project => project.id !== projectId);
      });

      return { previousProjects };
    },
    onError: (err, projectId, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects', params], context.previousProjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    projects: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    refetch: projectsQuery.refetch,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
  };
};
