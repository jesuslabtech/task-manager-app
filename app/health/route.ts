import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { config } from '@/lib/config';

export async function GET() {
  logger.debug('GET /health');

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    app: config.appName,
    uptime: process.uptime(),
  };

  return NextResponse.json(health, { status: 200 });
}
