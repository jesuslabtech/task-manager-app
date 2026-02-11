import { NextRequest, NextResponse } from 'next/server';
import { taskStore } from '@/lib/task-store';
import { logger } from '@/lib/logger';
import { metrics } from '@/lib/metrics';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const startTime = Date.now();
  try {
    const { id } = await params;
    logger.debug('DELETE /api/tasks/:id', { id });
    metrics.incrementRequestCount();

    const deleted = taskStore.delete(id);
    const duration = Date.now() - startTime;
    metrics.recordRequestDuration(duration);

    if (!deleted) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    metrics.incrementTaskOperation('delete');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logger.error('Error deleting task', { error });
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const startTime = Date.now();
  try {
    const { id } = await params;
    logger.debug('PATCH /api/tasks/:id', { id });
    metrics.incrementRequestCount();

    const body = await request.json();
    const { title, completed } = body;

    const updates: { title?: string; completed?: boolean } = {};
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Title must be a non-empty string' },
          { status: 400 },
        );
      }
      updates.title = title.trim();
    }
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return NextResponse.json(
          { error: 'Completed must be a boolean' },
          { status: 400 },
        );
      }
      updates.completed = completed;
    }

    const task = taskStore.update(id, updates);
    const duration = Date.now() - startTime;
    metrics.recordRequestDuration(duration);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    logger.error('Error updating task', { error });
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 },
    );
  }
}
