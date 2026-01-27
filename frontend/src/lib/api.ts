// frontend/src/lib/api.ts
import { Task, TaskCreate, TaskUpdate } from '../types/task';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// Helper function to get JWT token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to set JWT token in localStorage
const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// Helper function to remove JWT token from localStorage
const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// Helper function to create headers with JWT token
const getAuthHeaders = (includeContentType: boolean = true) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {};

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Authentication API functions
export const authApi = {
  // Login user and get JWT token
  login: async (email: string, password: string): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Login failed: ${response.status}`);
      }

      const data = await response.json();

      // Store the token for future requests
      if (data.access_token) {
        setAuthToken(data.access_token);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register a new user
  register: async (name: string, email: string, password: string): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Registration failed: ${response.status}`);
      }

      const data = await response.json();

      // Store the token for future requests
      if (data.access_token) {
        setAuthToken(data.access_token);
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    // Remove the token from localStorage
    removeAuthToken();
  },

  // Verify token validity
  verifyToken: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }
};

// Task API functions
export const taskApi = {
  // Get all tasks for the authenticated user
  getTasks: async (status?: 'pending' | 'completed' | 'all'): Promise<Task[]> => {
    try {
      const params = status ? `?status=${status}` : '';
      const response = await fetch(`${API_BASE_URL}/api/tasks${params}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          removeAuthToken();
          window.location.href = '/login';
        }
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData: TaskCreate): Promise<Task> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          removeAuthToken();
          window.location.href = '/login';
        }
        throw new Error(`Failed to create task: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Get a specific task
  getTaskById: async (taskId: number): Promise<Task> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          removeAuthToken();
          window.location.href = '/login';
        }
        throw new Error(`Failed to fetch task: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (taskId: number, taskData: TaskUpdate): Promise<Task> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          removeAuthToken();
          window.location.href = '/login';
        }
        throw new Error(`Failed to update task: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (taskId: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          removeAuthToken();
          window.location.href = '/login';
        }
        throw new Error(`Failed to delete task: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Toggle task completion
  toggleTaskCompletion: async (taskId: number, completed?: boolean): Promise<Task> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(completed !== undefined ? { completed } : {}),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          removeAuthToken();
          window.location.href = '/login';
        }
        throw new Error(`Failed to toggle task completion: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  },
};