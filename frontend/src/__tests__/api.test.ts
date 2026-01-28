// frontend/src/__tests__/api.test.ts
import { taskApi } from '../lib/api';

// Mock global fetch
global.fetch = jest.fn();

describe('API Functions', () => {
  beforeEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  describe('taskApi', () => {
    it('should fetch tasks with user ID from token', async () => {
      // Mock token with user ID
      const mockUserId = 'test-user-id';
      const mockToken = `header.${btoa(JSON.stringify({ sub: mockUserId }))}.signature`;
      
      // Mock localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => mockToken),
          setItem: jest.fn(),
          removeItem: jest.fn(),
        },
        writable: true,
      });

      const mockTasks = [{ id: 1, title: 'Test Task', completed: false }];
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      } as Response);

      const tasks = await taskApi.getTasks();
      
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8000/api/${mockUserId}/tasks`,
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`,
          },
        })
      );
      expect(tasks).toEqual(mockTasks);
    });

    it('should create a task with user ID from token', async () => {
      // Mock token with user ID
      const mockUserId = 'test-user-id';
      const mockToken = `header.${btoa(JSON.stringify({ sub: mockUserId }))}.signature`;
      
      // Mock localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => mockToken),
          setItem: jest.fn(),
          removeItem: jest.fn(),
        },
        writable: true,
      });

      const mockTaskData = { title: 'New Task', description: 'Task description' };
      const mockCreatedTask = { id: 1, ...mockTaskData, completed: false };
      
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreatedTask,
      } as Response);

      const createdTask = await taskApi.createTask(mockTaskData);
      
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8000/api/${mockUserId}/tasks`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`,
          },
          body: JSON.stringify(mockTaskData),
        })
      );
      expect(createdTask).toEqual(mockCreatedTask);
    });
  });
});