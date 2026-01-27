// frontend/app/test-api/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { taskApi } from '@/lib/api';
import { Task } from '../types/task';

const TestApiPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Using a placeholder user ID for testing
  const userId = 'user123';

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const tasksData = await taskApi.getTasks(userId);
      setTasks(tasksData);
      setMessage(`Successfully fetched ${tasksData.length} tasks`);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setMessage('Error fetching tasks: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createTestTask = async () => {
    setLoading(true);
    try {
      const newTask = await taskApi.createTask(userId, {
        title: 'Test Task',
        description: 'This is a test task created from the frontend'
      });
      setMessage('Successfully created task with ID: ' + newTask.id);
      // Refresh the list
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      setMessage('Error creating task: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">API Integration Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={fetchTasks}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch Tasks'}
            </button>
            <button
              onClick={createTestTask}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Test Task'}
            </button>
          </div>
          
          {message && (
            <div className={`p-4 rounded mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Current Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 italic">No tasks found. Create a test task to see it appear here.</p>
          ) : (
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="border border-gray-200 p-4 rounded">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>ID: {task.id}</span>
                    <span>User: {task.user_id}</span>
                    <span>Status: {task.completed ? 'Completed' : 'Pending'}</span>
                    <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestApiPage;