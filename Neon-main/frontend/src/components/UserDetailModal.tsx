'use client';

import React from 'react';
import { User } from '@/lib/api';
import { X, Mail, Calendar } from 'lucide-react';

interface UserDetailModalProps {
  user: User | null;
  onClose: () => void;
}

export default function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  if (!user) return null;

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
            <p className="text-sm text-slate-500">Registered User</p>
          </div>
        </div>

        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-sm">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
              User ID
            </span>
            <span className="font-mono text-xs text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 block truncate">
              {user._id}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
              Email Address
            </span>
            <span className="font-medium text-slate-800 flex items-center">
              <Mail className="w-4 h-4 mr-1.5 text-slate-400" />
              {user.email}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
              Account Created
            </span>
            <span className="font-medium text-slate-800 flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
              {formattedDate}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
