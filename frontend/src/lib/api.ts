// frontend/src/lib/api.ts
import { Task, TaskCreate, TaskUpdate } from '../types/task';

const API_BASE_URL = 'http://127.0.0.1:8000';

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

  // Verify token validity - currently not implemented in backend
  verifyToken: async (): Promise<boolean> => {
    // For now, just check if we have a token in localStorage
    // In a real app, you would make an API call to verify the token
    const token = getAuthToken();
    if (!token) return false;

    try {
      // Decode the token to check if it's expired
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = parts[1];
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
      const decodedPayload = atob(paddedPayload);
      const parsedPayload = JSON.parse(decodedPayload);

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (parsedPayload.exp && parsedPayload.exp < currentTime) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }
};

// Helper function to decode JWT token and extract user ID
const getUserIdFromToken = (): string | null => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    // Split the token to get the payload part
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decodedPayload = atob(paddedPayload);
    const parsedPayload = JSON.parse(decodedPayload);

    // Return the user ID from the 'sub' claim
    return parsedPayload.sub || null;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

// Task API functions
export const taskApi = {
  // Get all tasks for the authenticated user
  getTasks: async (status?: 'pending' | 'completed' | 'all'): Promise<Task[]> => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const params = status ? `?status=${status}` : '';
      const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks${params}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          removeAuthToken();
          window.location.href = '/login';
        } else if (response.status === 403) {
          // User ID mismatch
          throw new Error('Access denied: Invalid user permissions');
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
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          removeAuthToken();
          window.location.href = '/login';
        } else if (response.status === 403) {
          // User ID mismatch
          throw new Error('Access denied: Invalid user permissions');
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
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${taskId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          removeAuthToken();
          window.location.href = '/login';
        } else if (response.status === 403) {
          // User ID mismatch
          throw new Error('Access denied: Invalid user permissions');
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
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          removeAuthToken();
          window.location.href = '/login';
        } else if (response.status === 403) {
          // User ID mismatch
          throw new Error('Access denied: Invalid user permissions');
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
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          removeAuthToken();
          window.location.href = '/login';
        } else if (response.status === 403) {
          // User ID mismatch
          throw new Error('Access denied: Invalid user permissions');
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
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(completed !== undefined ? { completed } : {}),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          removeAuthToken();
          window.location.href = '/login';
        } else if (response.status === 403) {
          // User ID mismatch
          throw new Error('Access denied: Invalid user permissions');
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