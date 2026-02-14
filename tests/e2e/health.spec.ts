import { test, expect } from '@playwright/test';

test.describe('Health check', () => {
  test('should return 200 from /health', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.status()).toBe(200);
  });
});
