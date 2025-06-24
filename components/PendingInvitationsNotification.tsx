'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Bell, Check, X, Users, Clock, Mail } from 'lucide-react';
import { useState } from 'react';

interface Invitation {
  id: string;
  token: string;
  shared_group_id: string;
  invited_email: string;
  role: string;
  status: string;
  message?: string;
  created_at: string;
  expires_at?: string;
  group_name?: string;
  group_description?: string;
  inviter_name?: string;
}

interface InvitationList {
  invitations: Invitation[];
  total: number;
  pending_count: number;
}

export default function PendingInvitationsNotification() {
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  const { data: invitationsData, isLoading } = useQuery<InvitationList>({
    queryKey: ['pending-invitations'],
    queryFn: () => api.getPendingInvitations(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const acceptMutation = useMutation({
    mutationFn: (token: string) => api.acceptInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: (token: string) => api.declineInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-invitations'] });
    },
  });

  const pendingInvitations = invitationsData?.invitations?.filter(
    (inv) => inv.status === 'pending'
  ) || [];

  const handleAccept = async (token: string) => {
    try {
      await acceptMutation.mutateAsync(token);
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    }
  };

  const handleDecline = async (token: string) => {
    try {
      await declineMutation.mutateAsync(token);
    } catch (error) {
      console.error('Failed to decline invitation:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-blue-500 animate-pulse mr-3" />
          <span className="text-blue-700">Checking for invitations...</span>
        </div>
      </div>
    );
  }

  if (!pendingInvitations.length) {
    return null; // Don't show anything if no pending invitations
  }

  return (
    <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <Bell className="h-6 w-6 text-blue-600 mr-3" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingInvitations.length}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                {pendingInvitations.length === 1 
                  ? 'You have a pending invitation!' 
                  : `You have ${pendingInvitations.length} pending invitations!`
                }
              </h3>
              <p className="text-sm text-blue-700">
                Join ADHD support groups to collaborate and stay motivated
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            {isExpanded ? 'Hide' : 'View All'}
          </button>
        </div>

        {/* Invitations List */}
        <div className="space-y-3">
          {/* Always show first invitation */}
          {pendingInvitations.slice(0, 1).map((invitation) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              onAccept={handleAccept}
              onDecline={handleDecline}
              isLoading={acceptMutation.isPending || declineMutation.isPending}
            />
          ))}

          {/* Show remaining invitations if expanded */}
          {isExpanded && pendingInvitations.slice(1).map((invitation) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              onAccept={handleAccept}
              onDecline={handleDecline}
              isLoading={acceptMutation.isPending || declineMutation.isPending}
            />
          ))}

          {/* Show count if collapsed and more than 1 */}
          {!isExpanded && pendingInvitations.length > 1 && (
            <div className="text-center py-2">
              <button
                onClick={() => setIsExpanded(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + {pendingInvitations.length - 1} more invitation{pendingInvitations.length - 1 !== 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface InvitationCardProps {
  invitation: Invitation;
  onAccept: (token: string) => void;
  onDecline: (token: string) => void;
  isLoading: boolean;
}

function InvitationCard({ invitation, onAccept, onDecline, isLoading }: InvitationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = invitation.expires_at 
    ? new Date(invitation.expires_at) < new Date() 
    : false;

  return (
    <div className="bg-white rounded-lg border border-blue-200 p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Users className="h-4 w-4 text-blue-600 mr-2" />
            <h4 className="font-semibold text-gray-900">{invitation.group_name}</h4>
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {invitation.role}
            </span>
          </div>
          
          {invitation.group_description && (
            <p className="text-sm text-gray-600 mb-2">{invitation.group_description}</p>
          )}
          
          {invitation.message && (
            <div className="bg-gray-50 rounded p-2 mb-3">
              <p className="text-xs text-gray-500 mb-1">
                <Mail className="h-3 w-3 inline mr-1" />
                Message from {invitation.inviter_name}:
              </p>
              <p className="text-sm text-gray-700 italic">"{invitation.message}"</p>
            </div>
          )}

          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>Invited {formatDate(invitation.created_at)}</span>
            {invitation.expires_at && (
              <>
                <span className="mx-2">•</span>
                <span className={isExpired ? 'text-red-500' : ''}>
                  {isExpired ? 'Expired' : `Expires ${formatDate(invitation.expires_at)}`}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onAccept(invitation.token)}
            disabled={isLoading || isExpired}
            className="flex items-center px-3 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Check className="h-3 w-3 mr-1" />
            Accept
          </button>
          <button
            onClick={() => onDecline(invitation.token)}
            disabled={isLoading}
            className="flex items-center px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <X className="h-3 w-3 mr-1" />
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
