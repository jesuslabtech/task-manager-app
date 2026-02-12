import { config } from '../lib/config';

describe('config', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    // Restore original environment
    process.env = { ...originalEnv };
  });

  it('should load default configuration values', () => {
    expect(config).toBeDefined();
    expect(config.appName).toBe('task-manager');
    expect(config.logLevel).toBe('info');
    expect(config.port).toBe(3000);
  });

  it('should have appName property', () => {
    expect(config.appName).toBeDefined();
    expect(typeof config.appName).toBe('string');
  });

  it('should have logLevel property', () => {
    expect(config.logLevel).toBeDefined();
    expect(['debug', 'info', 'warn', 'error']).toContain(config.logLevel);
  });

  it('should have port property as a number', () => {
    expect(config.port).toBeDefined();
    expect(typeof config.port).toBe('number');
    expect(config.port).toBeGreaterThan(0);
    expect(config.port).toBeLessThan(65536);
  });

  it('should have jwtSecret property', () => {
    expect(config.jwtSecret).toBeDefined();
    expect(typeof config.jwtSecret).toBe('string');
  });
});
