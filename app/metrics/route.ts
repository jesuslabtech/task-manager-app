import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { metrics } from '@/lib/metrics';
import { taskStore } from '@/lib/task-store';

export async function GET() {
  logger.debug('GET /metrics');

  const taskCount = taskStore.count();
  const prometheusMetrics = metrics.getPrometheusMetrics(taskCount);

  return new NextResponse(prometheusMetrics, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; version=0.0.4',
    },
  });
}
