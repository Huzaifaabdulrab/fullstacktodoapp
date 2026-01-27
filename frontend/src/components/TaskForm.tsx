'use client'
// frontend/src/components/TaskForm.tsx
import React, { useState, useEffect } from 'react';
import { Task, TaskCreate, TaskUpdate } from '../types/task';
import { taskApi } from '../lib/api';

interface TaskFormProps {
  onTaskCreated?: () => void;
  onTaskUpdated?: () => void;
  taskToEdit?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated, onTaskUpdated, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing a task
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
    } else {
      // Reset form when not editing
      setTitle('');
      setDescription('');
    }
  }, [taskToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (taskToEdit) {
        // Update existing task
        await taskApi.updateTask(taskToEdit.id, { title, description: description || undefined });
        if (onTaskUpdated) onTaskUpdated();
      } else {
        // Create new task
        await taskApi.createTask({ title, description: description || undefined });
        setTitle('');
        setDescription('');
        if (onTaskCreated) onTaskCreated();
      }
    } catch (error) {
      console.error('Error saving task:', error);
      alert(`Failed to ${taskToEdit ? 'update' : 'create'} task. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {taskToEdit ? 'Edit Task' : 'Create New Task'}
      </h2>
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
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded text-white font-medium ${
            isSubmitting ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? `${taskToEdit ? 'Updating...' : 'Creating...'} `: `${taskToEdit ? 'Update' : 'Create'} Task`}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;