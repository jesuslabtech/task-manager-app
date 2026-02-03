import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { config } from '@/lib/config';

export async function GET() {
  logger.debug('GET /ready');

  // Check if required configuration is present
  const isReady = config.appName && config.logLevel;

  if (!isReady) {
    return NextResponse.json(
      {
        status: 'not ready',
        timestamp: new Date().toISOString(),
        message: 'Required configuration missing',
      },
      { status: 503 }
    );
  }

  const readiness = {
    status: 'ready',
    timestamp: new Date().toISOString(),
    app: config.appName,
  };

  return NextResponse.json(readiness, { status: 200 });
}
