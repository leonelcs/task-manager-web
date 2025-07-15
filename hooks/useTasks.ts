import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { api, Task } from '@/lib/api';

export const useTasks = (filters: any) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => {
      const { show_completed, ...apiFilters } = filters;
      return api.getTasks(apiFilters);
    },
    staleTime: 0, // Always consider data stale
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const createTaskMutation = useMutation({
    mutationFn: api.createTask,
    onSuccess: () => {
      // Invalidate all task queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.refetchQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) =>
      api.updateTask(taskId, updates),
    onMutate: async ({ taskId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(['tasks', filters]);

      // Optimistically update
      queryClient.setQueryData(['tasks', filters], (oldData: Task[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        );
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', filters], context.previousTasks);
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: api.deleteTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks', filters]);

      queryClient.setQueryData(['tasks', filters], (oldData: Task[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter(task => task.id !== taskId);
      });

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', filters], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const completeTaskMutation = useMutation({
    mutationFn: ({ taskId, completionData }: { taskId: string; completionData?: { actual_duration?: number; completion_notes?: string } }) => 
      api.completeTask(taskId, completionData),
    onMutate: async ({ taskId }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks', filters]);

      queryClient.setQueryData(['tasks', filters], (oldData: Task[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(task => 
          task.id === taskId ? { ...task, status: 'completed' as const } : task
        );
      });

      return { previousTasks };
    },
    onError: (err, { taskId }, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', filters], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    refetch: tasksQuery.refetch,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    completeTask: completeTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    isCompleting: completeTaskMutation.isPending,
  };
};
