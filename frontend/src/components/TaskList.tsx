'use client'
// frontend/src/components/TaskList.tsx
import React, { useState, useEffect } from 'react';
import { Task } from '../types/task';
import TaskItem from './TaskItem';
import { taskApi } from '../lib/api';

interface TaskListProps {}

const TaskList: React.FC<TaskListProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await taskApi.getTasks(filter);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Completed
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {filter === 'completed'
            ? 'No completed tasks yet.'
            : filter === 'pending'
              ? 'No pending tasks. Great job!'
              : 'No tasks yet. Add your first task!'}
        </div>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;