import { logger } from './logger';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

class TaskStore {
  private tasks: Map<string, Task> = new Map();

  constructor() {
    logger.info('TaskStore initialized');
  }

  getAll(): Task[] {
    return Array.from(this.tasks.values());
  }

  getById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  create(title: string): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.tasks.set(task.id, task);
    logger.info('Task created', { taskId: task.id });
    return task;
  }

  update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const task = this.tasks.get(id);
    if (!task) {
      logger.warn('Task not found for update', { taskId: id });
      return null;
    }
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    logger.info('Task updated', { taskId: id });
    return updatedTask;
  }

  delete(id: string): boolean {
    const deleted = this.tasks.delete(id);
    if (deleted) {
      logger.info('Task deleted', { taskId: id });
    } else {
      logger.warn('Task not found for deletion', { taskId: id });
    }
    return deleted;
  }

  count(): number {
    return this.tasks.size;
  }
}

export const taskStore = new TaskStore();
