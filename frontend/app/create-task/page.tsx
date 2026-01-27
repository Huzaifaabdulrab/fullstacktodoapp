// frontend/app/create-task/page.tsx
'use client';

import React, { useState } from 'react';
import TaskForm from '@/src/components/TaskForm';

const CreateTaskPage = () => {
  // In a real app, this would come from authentication context
  const [userId, setUserId] = useState<string>('user123'); // Placeholder user ID

  const handleTaskCreated = () => {
    // Redirect to tasks page or show success message
    alert('Task created successfully!');
    // In a real app, you might redirect to the tasks page
    // router.push('/tasks');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <TaskForm userId={userId} onTaskCreated={handleTaskCreated} />
    </div>
  );
};

export default CreateTaskPage;