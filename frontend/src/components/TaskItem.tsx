'use client'
// frontend/src/components/TaskItem.tsx
import React from 'react';
import { Task } from '../types/task';
import { taskApi } from '../lib/api';

interface TaskItemProps {
  task: Task;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdate, onTaskDelete }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [title, setTitle] = React.useState(task.title);
  const [description, setDescription] = React.useState(task.description || '');

  const handleToggleCompletion = async () => {
    try {
      const updatedTask = await taskApi.toggleTaskCompletion(task.id);
      onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleEdit = async () => {
    try {
      const updatedTask = await taskApi.updateTask(task.id, { title, description: description || undefined });
      onTaskUpdate(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(task.id);
        onTaskDelete(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <div className={`p-4 mb-3 rounded-lg border ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} shadow-sm`}>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            placeholder="Task title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            placeholder="Task description"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setTitle(task.title);
                setDescription(task.description || '');
              }}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleCompletion}
              className="mt-1 mr-3 h-5 w-5"
            />
            <div className="flex-1">
              <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-600'} mt-1`}>
                  {task.description}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Created: {new Date(task.created_at).toLocaleDateString()}
                {task.updated_at !== task.created_at && (
                  <> | Updated: {new Date(task.updated_at).toLocaleDateString()}</>
                )}
              </p>
            </div>
            <div className="flex space-x-2 ml-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-700"
                title="Edit task"
              >
                ✏️
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;