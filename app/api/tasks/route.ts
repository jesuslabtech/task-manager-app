import { NextRequest, NextResponse } from 'next/server';
import { taskStore } from '@/lib/task-store';
import { logger } from '@/lib/logger';
import { metrics } from '@/lib/metrics';

export async function GET() {
  const startTime = Date.now();
  try {
    logger.debug('GET /api/tasks');
    metrics.incrementRequestCount();
    metrics.incrementTaskOperation('list');

    const tasks = taskStore.getAll();
    const duration = Date.now() - startTime;
    metrics.recordRequestDuration(duration);

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    logger.error('Error fetching tasks', { error });
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  try {
    logger.debug('POST /api/tasks');
    metrics.incrementRequestCount();

    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    metrics.incrementTaskOperation('create');
    const task = taskStore.create(title.trim());
    const duration = Date.now() - startTime;
    metrics.recordRequestDuration(duration);

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    logger.error('Error creating task', { error });
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
