'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { X, Mail, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

interface InviteProjectMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

export default function InviteProjectMembersModal({
  isOpen,
  onClose,
  projectId,
  projectName
}: InviteProjectMembersModalProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('collaborator');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const queryClient = useQueryClient();

  const inviteMutation = useMutation({
    mutationFn: (data: { user_email: string; message?: string; role?: string }) =>
      api.inviteToProject(projectId, data),
    onSuccess: () => {
      setSuccessMessage('Invitation sent successfully! 🎉');
      setEmail('');
      setMessage('');
      setErrors({});
      // Refresh project data to update collaborator count
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      // Auto-close after showing success for 2 seconds
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 2000);
    },
    onError: (error: any) => {
      console.error('Failed to send invitation:', error);
      setErrors({ email: error.response?.data?.detail || 'Failed to send invitation' });
    }
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return false;
    }
    if (!email.endsWith('@gmail.com')) {
      setErrors({ email: 'Only @gmail.com addresses are supported for now' });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    
    if (!validateEmail(email)) {
      return;
    }

    inviteMutation.mutate({
      user_email: email,
      message: message || undefined,
      role
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-adhd-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Invite to {projectName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md"
            disabled={inviteMutation.isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-50 border-l-4 border-green-400 mx-6 mt-4 rounded">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* ADHD-Friendly Info */}
          <div className="bg-adhd-primary-50 border border-adhd-primary-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-adhd-primary-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-adhd-primary-900 mb-1">
                  ADHD-Friendly Project Collaboration
                </p>
                <p className="text-adhd-primary-700">
                  We use Google authentication for easier login and better security.
                  Only @gmail.com addresses are supported currently.
                </p>
              </div>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="collaborator@gmail.com"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-adhd-primary-500 focus:border-adhd-primary-500 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={inviteMutation.isPending}
              required
            />
            {errors.email && (
              <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-adhd-primary-500 focus:border-adhd-primary-500"
              disabled={inviteMutation.isPending}
            >
              <option value="collaborator">Collaborator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Message Input */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Personal Message (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I'd love for you to join our ADHD-friendly project..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-adhd-primary-500 focus:border-adhd-primary-500"
              disabled={inviteMutation.isPending}
            />
            <p className="mt-1 text-xs text-gray-500">
              Add a personal touch to help them understand why you're inviting them
            </p>
          </div>

          {/* ADHD Benefits */}
          <div className="bg-gradient-to-r from-adhd-secondary-50 to-pebbles-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Why join our ADHD project collaboration?
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Shared accountability and mutual support</li>
              <li>• ADHD-friendly task management tools</li>
              <li>• Collaborative dopamine celebrations</li>
              <li>• Understanding of neurodivergent work styles</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={inviteMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviteMutation.isPending || !email}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {inviteMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </div>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
