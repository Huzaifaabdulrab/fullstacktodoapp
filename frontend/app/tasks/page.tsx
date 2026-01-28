// frontend/app/tasks/page.tsx
'use client';

import React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import TaskList from '@/src/components/TaskList';
import { useRouter } from 'next/navigation';

const TasksPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading tasks...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskList />
    </div>
  );
};

export default TasksPage;