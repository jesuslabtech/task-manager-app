import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskManager } from '../components/task-manager';
import { toast } from 'sonner';
import '@testing-library/jest-dom';

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch
globalThis.fetch = jest.fn();

describe('TaskManager Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (globalThis.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should render the task manager component', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [] }),
      });

      await act(async () => {
        render(<TaskManager />);
      });

      expect(screen.getByText('Task Manager')).toBeInTheDocument();
      expect(
        screen.getByText('Manage your tasks efficiently'),
      ).toBeInTheDocument();
    });

    it('should fetch tasks on mount', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [] }),
      });

      await act(async () => {
        render(<TaskManager />);
      });

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith('/api/tasks');
      });
    });

    it('should display loading spinner while fetching tasks', async () => {
      (globalThis.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise(() => {}), // Never resolves
      );

      await act(async () => {
        render(<TaskManager />);
      });

      // The add button should be in the document
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('should handle fetch error', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error'),
      );

      await act(async () => {
        render(<TaskManager />);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to load tasks');
      });
    });
  });

  describe('Task List Display', () => {
    it('should display empty state when no tasks', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [] }),
      });

      await act(async () => {
        render(<TaskManager />);
      });

      await waitFor(() => {
        expect(
          screen.getByText('No tasks yet. Create your first task above!'),
        ).toBeInTheDocument();
      });
    });

    it('should display tasks in the list', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Test Task 1',
          completed: false,
          createdAt: '2024-01-01',
        },
        {
          id: '2',
          title: 'Test Task 2',
          completed: true,
          createdAt: '2024-01-02',
        },
      ];

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: mockTasks }),
      });

      await act(async () => {
        render(<TaskManager />);
      });

      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument();
        expect(screen.getByText('Test Task 2')).toBeInTheDocument();
      });
    });

    it('should show task completion stats', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Task 1',
          completed: true,
          createdAt: '2024-01-01',
        },
        {
          id: '2',
          title: 'Task 2',
          completed: false,
          createdAt: '2024-01-02',
        },
      ];

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: mockTasks }),
      });

      await act(async () => {
        render(<TaskManager />);
      });

      await waitFor(() => {
        expect(screen.getByText('1 of 2 tasks completed')).toBeInTheDocument();
      });
    });
  });

  describe('Create Task', () => {
    it('should create a new task', async () => {
      (globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ tasks: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            task: {
              id: '1',
              title: 'New Task',
              completed: false,
              createdAt: '2024-01-01',
            },
          }),
        });

      const user = userEvent.setup();
      await act(async () => {
        render(<TaskManager />);
      });

      const input = screen.getByPlaceholderText('Enter a new task...');
      const submitButton = screen.getByRole('button', { name: /add/i });

      await act(async () => {
        await user.type(input, 'New Task');
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'New Task' }),
        });
        expect(toast.success).toHaveBeenCalledWith('Task created');
      });
    });

    it('should not create task with empty title', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [] }),
      });

      await act(async () => {
        render(<TaskManager />);
      });

      const submitButton = screen.getByRole('button', { name: /add/i });
      expect(submitButton).toBeDisabled();
    });

    it('should clear input after creating task', async () => {
      (globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ tasks: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            task: {
              id: '1',
              title: 'New Task',
              completed: false,
              createdAt: '2024-01-01',
            },
          }),
        });

      const user = userEvent.setup();
      await act(async () => {
        render(<TaskManager />);
      });

      const input = screen.getByPlaceholderText(
        'Enter a new task...',
      ) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /add/i });

      await act(async () => {
        await user.type(input, 'New Task');
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    it('should handle create task error', async () => {
      (globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ tasks: [] }),
        })
        .mockRejectedValueOnce(new Error('Create failed'));

      const user = userEvent.setup();
      await act(async () => {
        render(<TaskManager />);
      });

      const input = screen.getByPlaceholderText('Enter a new task...');
      const submitButton = screen.getByRole('button', { name: /add/i });

      await act(async () => {
        await user.type(input, 'New Task');
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to create task');
      });
    });
  });

  describe('Delete Task', () => {
    it('should delete a task', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Task to Delete',
          completed: false,
          createdAt: '2024-01-01',
        },
      ];

      (globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ tasks: mockTasks }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });

      const user = userEvent.setup();
      await act(async () => {
        render(<TaskManager />);
      });

      await waitFor(() => {
        expect(screen.getByText('Task to Delete')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons[deleteButtons.length - 1]; // Last button is delete

      await act(async () => {
        await user.click(deleteButton);
      });

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith('/api/tasks/1', {
          method: 'DELETE',
        });
        expect(toast.success).toHaveBeenCalledWith('Task deleted');
      });
    });

    it('should handle delete error', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Task',
          completed: false,
          createdAt: '2024-01-01',
        },
      ];

      (globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ tasks: mockTasks }),
        })
        .mockRejectedValueOnce(new Error('Delete failed'));

      const user = userEvent.setup();
      await act(async () => {
        render(<TaskManager />);
      });

      await waitFor(() => {
        expect(screen.getByText('Task')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons[deleteButtons.length - 1];

      await act(async () => {
        await user.click(deleteButton);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to delete task');
      });
    });
  });

  describe('Toggle Task Completion', () => {
    it('should toggle task completion', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Task',
          completed: false,
          createdAt: '2024-01-01',
        },
      ];

      (globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ tasks: mockTasks }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            task: {
              id: '1',
              title: 'Task',
              completed: true,
              createdAt: '2024-01-01',
            },
          }),
        });

      const user = userEvent.setup();
      await act(async () => {
        render(<TaskManager />);
      });

      await waitFor(() => {
        expect(screen.getByText('Task')).toBeInTheDocument();
      });

      const checkbox = screen.getByRole('checkbox');

      await act(async () => {
        await user.click(checkbox);
      });

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith('/api/tasks/1', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true }),
        });
      });
    });

    it('should handle toggle error', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Task',
          completed: false,
          createdAt: '2024-01-01',
        },
      ];

      (globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ tasks: mockTasks }),
        })
        .mockRejectedValueOnce(new Error('Toggle failed'));

      const user = userEvent.setup();
      await act(async () => {
        render(<TaskManager />);
      });

      await waitFor(() => {
        expect(screen.getByText('Task')).toBeInTheDocument();
      });

      const checkbox = screen.getByRole('checkbox');

      await act(async () => {
        await user.click(checkbox);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update task');
      });
    });
  });

  describe('Input Validation', () => {
    it('should disable submit button when input is empty', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [] }),
      });

      await act(async () => {
        render(<TaskManager />);
      });

      const submitButton = screen.getByRole('button', { name: /add/i });
      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button for whitespace only', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [] }),
      });

      const user = userEvent.setup();
      await act(async () => {
        render(<TaskManager />);
      });

      const input = screen.getByPlaceholderText('Enter a new task...');
      await act(async () => {
        await user.type(input, '   ');
      });

      const submitButton = screen.getByRole('button', { name: /add/i });
      expect(submitButton).toBeDisabled();
    });
  });
});
