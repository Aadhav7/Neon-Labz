'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api, User } from '@/lib/api';
import ProfileCard from '@/components/ProfileCard';
import UserList from '@/components/UserList';

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {user && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Your Account</h2>
          <ProfileCard
            user={user}
            onProfileUpdated={async () => {
              await refreshUser();
              fetchUsers();
            }}
          />
        </section>
      )}

      <section>
        <UserList
          users={users}
          loading={loadingUsers}
          onRefresh={fetchUsers}
          currentUserId={user?._id}
        />
      </section>
    </div>
  );
}
