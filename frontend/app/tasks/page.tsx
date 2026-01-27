// frontend/app/tasks/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import TaskList from '@/src/components/TaskList';

const TasksPage = () => {
  // In a real app, this would come from authentication context
  const [userId, setUserId] = useState<string>('user123'); // Placeholder user ID

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskList userId={userId} />
    </div>
  );
};

export default TasksPage;