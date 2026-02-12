import { render, screen, waitFor } from '@testing-library/react';
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

globalThis.fetch = jest.fn();

describe('TaskManager Component', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    (globalThis.fetch as jest.Mock).mockClear();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('Initialization', () => {
    it('renders the component', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [] }),
      });

      render(<TaskManager />);

      expect(screen.getByText('Task Manager')).toBeInTheDocument();
      expect(
        screen.getByText('Manage your tasks efficiently'),
      ).toBeInTheDocument();
    });

    it('fetches tasks on mount', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [] }),
      });

      render(<TaskManager />);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith('/api/tasks');
      });
    });

    it('handles fetch error', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error'),
      );

      render(<TaskManager />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to load tasks');
      });
    });
  });

  describe('Delete Task', () => {
    it('deletes a task', async () => {
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
      render(<TaskManager />);

      await screen.findByText('Task to Delete');

      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons[deleteButtons.length - 1];

      await user.click(deleteButton);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith('/api/tasks/1', {
          method: 'DELETE',
        });
        expect(toast.success).toHaveBeenCalledWith('Task deleted');
      });
    });

    it('handles delete error', async () => {
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
      render(<TaskManager />);

      await screen.findByText('Task');

      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons[deleteButtons.length - 1];

      await user.click(deleteButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to delete task');
      });
    });
  });
});
