class MetricsCollector {
  private requestCount = 0;
  private requestDurations: number[] = [];
  private taskOperations = {
    create: 0,
    delete: 0,
    list: 0,
  };

  incrementRequestCount(): void {
    this.requestCount++;
  }

  recordRequestDuration(duration: number): void {
    this.requestDurations.push(duration);
    // Keep only last 1000 entries
    if (this.requestDurations.length > 1000) {
      this.requestDurations.shift();
    }
  }

  incrementTaskOperation(operation: 'create' | 'delete' | 'list'): void {
    this.taskOperations[operation]++;
  }

  getPrometheusMetrics(taskCount: number): string {
    const avgDuration =
      this.requestDurations.length > 0
        ? this.requestDurations.reduce((a, b) => a + b, 0) / this.requestDurations.length
        : 0;

    return `# HELP http_requests_total The total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total ${this.requestCount}

# HELP http_request_duration_ms Average HTTP request duration in milliseconds
# TYPE http_request_duration_ms gauge
http_request_duration_ms ${avgDuration.toFixed(2)}

# HELP tasks_total The total number of tasks in the system
# TYPE tasks_total gauge
tasks_total ${taskCount}

# HELP task_operations_total The total number of task operations by type
# TYPE task_operations_total counter
task_operations_total{operation="create"} ${this.taskOperations.create}
task_operations_total{operation="delete"} ${this.taskOperations.delete}
task_operations_total{operation="list"} ${this.taskOperations.list}
`;
  }
}

export const metrics = new MetricsCollector();
