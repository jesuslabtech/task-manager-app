import { TaskStore } from '../lib/task-store';

describe('TaskStore', () => {
  let taskStore: TaskStore;

  beforeEach(() => {
    taskStore = new TaskStore();
  });

  describe('create', () => {
    it('should create a new task with a title', () => {
      const task = taskStore.create('Test Task');

      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.completed).toBe(false);
      expect(task.createdAt).toBeDefined();
    });

    it('should generate unique IDs for each task', () => {
      const task1 = taskStore.create('Task 1');
      const task2 = taskStore.create('Task 2');

      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe('getAll', () => {
    it('should return empty array when no tasks exist', () => {
      const tasks = taskStore.getAll();

      expect(tasks).toEqual([]);
    });

    it('should return all created tasks', () => {
      taskStore.create('Task 1');
      taskStore.create('Task 2');
      taskStore.create('Task 3');

      const tasks = taskStore.getAll();

      expect(tasks).toHaveLength(3);
      expect(tasks.map(t => t.title)).toEqual(['Task 1', 'Task 2', 'Task 3']);
    });
  });

  describe('getById', () => {
    it('should return undefined for non-existent task', () => {
      const task = taskStore.getById('non-existent-id');

      expect(task).toBeUndefined();
    });

    it('should return task by ID', () => {
      const createdTask = taskStore.create('Test Task');
      const foundTask = taskStore.getById(createdTask.id);

      expect(foundTask).toEqual(createdTask);
    });
  });

  describe('update', () => {
    it('should update task title', () => {
      const task = taskStore.create('Original Title');
      const updated = taskStore.update(task.id, { title: 'Updated Title' });

      expect(updated?.title).toBe('Updated Title');
      expect(updated?.completed).toBe(false);
    });

    it('should update task completed status', () => {
      const task = taskStore.create('Test Task');
      const updated = taskStore.update(task.id, { completed: true });

      expect(updated?.completed).toBe(true);
      expect(updated?.title).toBe('Test Task');
    });

    it('should return null when updating non-existent task', () => {
      const result = taskStore.update('non-existent-id', { completed: true });

      expect(result).toBeNull();
    });

    it('should preserve createdAt when updating', () => {
      const task = taskStore.create('Test Task');
      const updated = taskStore.update(task.id, { title: 'Updated' });

      expect(updated?.createdAt).toBe(task.createdAt);
    });
  });

  describe('delete', () => {
    it('should delete existing task', () => {
      const task = taskStore.create('Test Task');
      const deleted = taskStore.delete(task.id);

      expect(deleted).toBe(true);
      expect(taskStore.getById(task.id)).toBeUndefined();
    });

    it('should return false when deleting non-existent task', () => {
      const deleted = taskStore.delete('non-existent-id');

      expect(deleted).toBe(false);
    });

    it('should reduce task count after deletion', () => {
      const task1 = taskStore.create('Task 1');
      taskStore.create('Task 2');

      expect(taskStore.getAll()).toHaveLength(2);

      taskStore.delete(task1.id);

      expect(taskStore.getAll()).toHaveLength(1);
    });
  });
});
