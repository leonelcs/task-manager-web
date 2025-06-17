'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, GroupInvitation } from '@/lib/api';
import { Check, X, Users, Mail, Calendar, MessageCircle } from 'lucide-react';

export default function InvitationBanner() {
  const [selectedInvitation, setSelectedInvitation] = useState<GroupInvitation | null>(null);
  const queryClient = useQueryClient();

  const { data: invitationData, isLoading } = useQuery({
    queryKey: ['my-invitations'],
    queryFn: () => api.getPendingInvitations(),
    refetchInterval: 30000, // Check for new invitations every 30 seconds
  });

  const acceptMutation = useMutation({
    mutationFn: (token: string) => api.acceptInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setSelectedInvitation(null);
    },
  });

  const declineMutation = useMutation({
    mutationFn: (token: string) => api.declineInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
      setSelectedInvitation(null);
    },
  });

  if (isLoading) return null;

  const pendingInvitations = invitationData?.invitations?.filter(
    (inv: GroupInvitation) => inv.status === 'pending'
  ) || [];

  if (pendingInvitations.length === 0) return null;

  return (
    <>
      {/* Main Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-1">
                🎉 You have {pendingInvitations.length} group invitation{pendingInvitations.length > 1 ? 's' : ''}!
              </h3>
              <p className="text-green-800 text-sm mb-3">
                You've been invited to join ADHD support groups. Click to view details and respond.
              </p>
              
              {/* Quick preview of invitations */}
              <div className="space-y-2">
                {pendingInvitations.slice(0, 2).map((invitation: GroupInvitation) => (
                  <div
                    key={invitation.id}
                    className="bg-white rounded-md p-3 border border-green-200 cursor-pointer hover:bg-green-25 transition-colors"
                    onClick={() => setSelectedInvitation(invitation)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{invitation.group_name}</h4>
                        <p className="text-sm text-gray-600">
                          From: {invitation.inviter_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            acceptMutation.mutate(invitation.token);
                          }}
                          disabled={acceptMutation.isPending || declineMutation.isPending}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            declineMutation.mutate(invitation.token);
                          }}
                          disabled={acceptMutation.isPending || declineMutation.isPending}
                          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {pendingInvitations.length > 2 && (
                  <p className="text-sm text-green-700 mt-2">
                    And {pendingInvitations.length - 2} more invitation{pendingInvitations.length - 2 > 1 ? 's' : ''}...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Modal */}
      {selectedInvitation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Group Invitation
                </h2>
              </div>
              <button
                onClick={() => setSelectedInvitation(null)}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Group Info */}
              <div className="bg-gradient-to-r from-adhd-primary-50 to-adhd-secondary-50 rounded-lg p-4">
                <h3 className="font-semibold text-adhd-primary-900 mb-2">
                  {selectedInvitation.group_name}
                </h3>
                {selectedInvitation.group_description && (
                  <p className="text-sm text-adhd-primary-700 mb-3">
                    {selectedInvitation.group_description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-adhd-primary-600">
                    <Mail className="h-4 w-4" />
                    <span>From: {selectedInvitation.inviter_name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-adhd-primary-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Sent: {new Date(selectedInvitation.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Message */}
              {selectedInvitation.message && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Personal Message</h4>
                      <p className="text-sm text-gray-700">{selectedInvitation.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ADHD Group Benefits */}
              <div className="bg-gradient-to-r from-adhd-secondary-50 to-pebbles-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  🧠 ADHD Support Group Benefits
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Body doubling and focus sessions for better productivity</li>
                  <li>• Shared accountability and mutual encouragement</li>
                  <li>• ADHD-friendly task management and organization tools</li>
                  <li>• Celebrating wins together for dopamine boosts 🎉</li>
                  <li>• Understanding community that gets your ADHD challenges</li>
                </ul>
              </div>

              {/* Expiry Notice */}
              {selectedInvitation.expires_at && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    ⏰ This invitation expires on{' '}
                    {new Date(selectedInvitation.expires_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setSelectedInvitation(null)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => declineMutation.mutate(selectedInvitation.token)}
                disabled={acceptMutation.isPending || declineMutation.isPending}
                className="px-4 py-2 text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 disabled:opacity-50"
              >
                <X className="h-4 w-4 mr-2 inline" />
                {declineMutation.isPending ? 'Declining...' : 'Decline'}
              </button>
              <button
                onClick={() => acceptMutation.mutate(selectedInvitation.token)}
                disabled={acceptMutation.isPending || declineMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <Check className="h-4 w-4 mr-2 inline" />
                {acceptMutation.isPending ? 'Accepting...' : 'Accept & Join Group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
