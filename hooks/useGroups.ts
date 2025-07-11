import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { api, Group } from '@/lib/api';

export const useGroups = () => {
  const queryClient = useQueryClient();

  const groupsQuery = useQuery({
    queryKey: ['groups'],
    queryFn: () => api.getGroups(),
    staleTime: 0, // Always consider data stale
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const createGroupMutation = useMutation({
    mutationFn: api.createGroup,
    onSuccess: () => {
      // Invalidate all group queries
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.refetchQueries({ queryKey: ['groups'] });
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ groupId, updates }: { groupId: string; updates: Partial<Group> }) =>
      api.updateGroup(groupId, updates),
    onMutate: async ({ groupId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['groups'] });

      // Snapshot previous value
      const previousGroups = queryClient.getQueryData(['groups']);

      // Optimistically update
      queryClient.setQueryData(['groups'], (oldData: Group[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(group => 
          group.id === groupId ? { ...group, ...updates } : group
        );
      });

      return { previousGroups };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousGroups) {
        queryClient.setQueryData(['groups'], context.previousGroups);
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: api.deleteGroup,
    onMutate: async (groupId) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] });
      const previousGroups = queryClient.getQueryData(['groups']);

      queryClient.setQueryData(['groups'], (oldData: Group[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter(group => group.id !== groupId);
      });

      return { previousGroups };
    },
    onError: (err, groupId, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(['groups'], context.previousGroups);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  return {
    groups: groupsQuery.data || [],
    isLoading: groupsQuery.isLoading,
    error: groupsQuery.error,
    refetch: groupsQuery.refetch,
    createGroup: createGroupMutation.mutate,
    updateGroup: updateGroupMutation.mutate,
    deleteGroup: deleteGroupMutation.mutate,
    isCreating: createGroupMutation.isPending,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
  };
};
