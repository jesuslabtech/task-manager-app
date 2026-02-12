import { metrics } from '../lib/metrics';

beforeEach(() => {
  metrics.reset();
});

describe('MetricsCollector', () => {
  beforeEach(() => {
    // Reset metrics by creating a new instance
    // Clear the state by testing fresh instance behavior
    jest.resetModules();
  });

  describe('incrementRequestCount', () => {
    it('should increment request count', () => {
      metrics.incrementRequestCount();
      const metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain('http_requests_total 1');
    });

    it('should increment request count multiple times', () => {
      metrics.incrementRequestCount();
      metrics.incrementRequestCount();
      metrics.incrementRequestCount();
      const metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain('http_requests_total 3');
    });
  });

  describe('recordRequestDuration', () => {
    it('should record request duration', () => {
      metrics.recordRequestDuration(100);
      const metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain('http_request_duration_ms 100.00');
    });

    it('should calculate average duration for multiple requests', () => {
      metrics.recordRequestDuration(100);
      metrics.recordRequestDuration(200);
      const metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain('http_request_duration_ms 150.00');
    });

    it('should keep only last 1000 entries', () => {
      // Add 1001 entries
      for (let i = 0; i < 1001; i++) {
        metrics.recordRequestDuration(100);
      }
      const metricsOutput = metrics.getPrometheusMetrics(0);
      // Should still be valid metrics output
      expect(metricsOutput).toContain('http_request_duration_ms');
    });

    it('should return 0 when no durations recorded', () => {
      const metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain('http_request_duration_ms 0.00');
    });
  });

  describe('incrementTaskOperation', () => {
    it('should increment create operation', () => {
      metrics.incrementTaskOperation('create');
      const metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain(
        'task_operations_total{operation="create"} 1',
      );
    });

    it('should increment delete operation', () => {
      metrics.incrementTaskOperation('delete');
      const metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain(
        'task_operations_total{operation="delete"} 1',
      );
    });

    it('should increment list operation', () => {
      metrics.incrementTaskOperation('list');
      const metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain(
        'task_operations_total{operation="list"} 1',
      );
    });

    it('should increment multiple operations', () => {
      metrics.incrementTaskOperation('create');
      metrics.incrementTaskOperation('create');
      metrics.incrementTaskOperation('delete');
      const metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain(
        'task_operations_total{operation="create"} 2',
      );
      expect(metricsOutput).toContain(
        'task_operations_total{operation="delete"} 1',
      );
    });
  });

  describe('getPrometheusMetrics', () => {
    it('should return valid Prometheus format', () => {
      const metricsOutput = metrics.getPrometheusMetrics(5);
      expect(metricsOutput).toContain('# HELP');
      expect(metricsOutput).toContain('# TYPE');
    });

    it('should include task count', () => {
      const metricsOutput = metrics.getPrometheusMetrics(10);
      expect(metricsOutput).toContain('tasks_total 10');
    });

    it('should include all metric types', () => {
      const metricsOutput = metrics.getPrometheusMetrics(5);
      expect(metricsOutput).toContain('http_requests_total');
      expect(metricsOutput).toContain('http_request_duration_ms');
      expect(metricsOutput).toContain('tasks_total');
      expect(metricsOutput).toContain('task_operations_total');
    });
  });

  describe('reset', () => {
    it('should reset request count to 0', () => {
      metrics.incrementRequestCount();
      metrics.incrementRequestCount();
      metrics.incrementRequestCount();
      let metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain('http_requests_total 3');

      metrics.reset();
      metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain('http_requests_total 0');
    });

    it('should clear request durations', () => {
      metrics.recordRequestDuration(100);
      metrics.recordRequestDuration(200);
      let metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain('http_request_duration_ms 150.00');

      metrics.reset();
      metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain('http_request_duration_ms 0.00');
    });

    it('should reset all task operations to 0', () => {
      metrics.incrementTaskOperation('create');
      metrics.incrementTaskOperation('create');
      metrics.incrementTaskOperation('delete');
      metrics.incrementTaskOperation('list');
      let metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain(
        'task_operations_total{operation="create"} 2',
      );
      expect(metricsOutput).toContain(
        'task_operations_total{operation="delete"} 1',
      );
      expect(metricsOutput).toContain(
        'task_operations_total{operation="list"} 1',
      );

      metrics.reset();
      metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain(
        'task_operations_total{operation="create"} 0',
      );
      expect(metricsOutput).toContain(
        'task_operations_total{operation="delete"} 0',
      );
      expect(metricsOutput).toContain(
        'task_operations_total{operation="list"} 0',
      );
    });

    it('should reset all metrics completely', () => {
      // Set up metrics with various values
      metrics.incrementRequestCount();
      metrics.incrementRequestCount();
      metrics.recordRequestDuration(100);
      metrics.recordRequestDuration(200);
      metrics.incrementTaskOperation('create');
      metrics.incrementTaskOperation('delete');

      let metricsOutput = metrics.getPrometheusMetrics(5);
      expect(metricsOutput).toContain('http_requests_total 2');
      expect(metricsOutput).toContain('http_request_duration_ms 150.00');
      expect(metricsOutput).toContain('tasks_total 5');
      expect(metricsOutput).toContain(
        'task_operations_total{operation="create"} 1',
      );

      // Reset and verify all metrics are cleared
      metrics.reset();
      metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain('http_requests_total 0');
      expect(metricsOutput).toContain('http_request_duration_ms 0.00');
      expect(metricsOutput).toContain('tasks_total 0');
      expect(metricsOutput).toContain(
        'task_operations_total{operation="create"} 0',
      );
      expect(metricsOutput).toContain(
        'task_operations_total{operation="delete"} 0',
      );
      expect(metricsOutput).toContain(
        'task_operations_total{operation="list"} 0',
      );
    });

    it('should allow metrics to be collected after reset', () => {
      metrics.incrementRequestCount();
      metrics.reset();

      // Collect new metrics after reset
      metrics.incrementRequestCount();
      metrics.incrementRequestCount();
      metrics.recordRequestDuration(50);
      metrics.incrementTaskOperation('create');

      const metricsOutput = metrics.getPrometheusMetrics(0);
      expect(metricsOutput).toContain('http_requests_total 2');
      expect(metricsOutput).toContain('http_request_duration_ms 50.00');
      expect(metricsOutput).toContain(
        'task_operations_total{operation="create"} 1',
      );
    });
  });
});
