// frontend/app/create-task/page.tsx
'use client';

import React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import TaskForm from '@/src/components/TaskForm';

const CreateTaskPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleTaskCreated = () => {
    // Redirect to tasks page after successful creation
    router.push('/tasks');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <TaskForm onTaskCreated={handleTaskCreated} />
    </div>
  );
};

export default CreateTaskPage;