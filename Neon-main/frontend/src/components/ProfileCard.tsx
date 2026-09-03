'use client';

import React, { useState } from 'react';
import { User, api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { User as UserIcon, Mail, Calendar, Edit3, Trash2, ShieldCheck } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

interface ProfileCardProps {
  user: User;
  onProfileUpdated: () => void;
}

export default function ProfileCard({ user, onProfileUpdated }: ProfileCardProps) {
  const { logout } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await api.deleteAccount();
      await logout();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl font-bold shadow-inner">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-emerald-400/20 text-emerald-200 rounded-full border border-emerald-400/30">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Logged In
                </span>
              </div>
              <p className="text-indigo-100 text-sm">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center px-3.5 py-2 text-sm font-medium bg-white text-indigo-700 rounded-xl hover:bg-indigo-50 transition shadow-sm"
            >
              <Edit3 className="w-4 h-4 mr-1.5" />
              Edit Profile
            </button>
            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="inline-flex items-center px-3.5 py-2 text-sm font-medium bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 border border-rose-400/30 rounded-xl transition"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2 text-slate-600">
          <UserIcon className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500">ID:</span>
          <span className="font-mono text-xs text-slate-700 truncate max-w-[150px]">{user._id}</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-600">
          <Mail className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500">Email:</span>
          <span className="font-medium text-slate-700 truncate">{user.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500">Joined:</span>
          <span className="font-medium text-slate-700">{formattedDate}</span>
        </div>
      </div>

      {isEditOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditOpen(false)}
          onSuccess={() => {
            setIsEditOpen(false);
            onProfileUpdated();
          }}
        />
      )}

      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-900 mb-2">Delete Account</h3>
            <p className="text-sm text-center text-slate-500 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            {deleteError && (
              <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-200">
                {deleteError}
              </div>
            )}
            <div className="flex space-x-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-sm"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
