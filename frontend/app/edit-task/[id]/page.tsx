// frontend/app/edit-task/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Task, TaskUpdate } from '../../../src/types/task';
import { taskApi } from '../../../src/lib/api';

const EditTaskPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const taskId = parseInt(id);
  
  // In a real app, this would come from authentication context
  const [userId, setUserId] = useState<string>('user123'); // Placeholder user ID
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const taskData = await taskApi.getTaskById(userId, taskId);
      setTask(taskData);
      setTitle(taskData.title);
      setDescription(taskData.description || '');
    } catch (error) {
      console.error('Error fetching task:', error);
      alert('Failed to load task');
      router.push('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    const taskUpdate: TaskUpdate = {
      title,
      description: description || undefined
    };

    setIsSubmitting(true);
    try {
      await taskApi.updateTask(userId, taskId, taskUpdate);
      alert('Task updated successfully!');
      router.push('/tasks');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading task...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Task not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description (optional)"
              rows={3}
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-2 px-4 rounded text-white font-medium ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? 'Updating...' : 'Update Task'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="py-2 px-4 rounded bg-gray-300 text-gray-700 font-medium hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskPage;