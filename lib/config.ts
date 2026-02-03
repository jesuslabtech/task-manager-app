import { logger } from './logger';

interface Config {
  appName: string;
  logLevel: string;
  jwtSecret: string;
  port: number;
}

function validateConfig(): Config {
  const config: Config = {
    appName: process.env.APP_NAME || 'task-manager',
    logLevel: process.env.LOG_LEVEL || 'info',
    jwtSecret: process.env.JWT_SECRET || '',
    port: parseInt(process.env.PORT || '3000', 10),
  };

  // Validate required secrets
  if (!config.jwtSecret) {
    logger.warn('JWT_SECRET environment variable is not set');
  }

  logger.info('Configuration loaded', {
    appName: config.appName,
    logLevel: config.logLevel,
    port: config.port,
  });

  return config;
}

export const config = validateConfig();
