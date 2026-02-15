# Task Manager - Production-Ready Next.js Application

A production-ready fullstack task management application built with Next.js, featuring comprehensive operational endpoints for Kubernetes deployment.


See the gitops repository of this application: https://github.com/jesuslabtech/task-manager-gitops

## Features

### Application Features

- ✅ List all tasks
- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Delete tasks
- ✅ Modern, responsive UI with shadcn/ui components

### Operational Features

- 🏥 Health check endpoint (`/health`)
- 🔄 Readiness probe endpoint (`/ready`)
- 📊 Prometheus metrics endpoint (`/metrics`)
- 📝 Structured JSON logging
- 🛑 Graceful shutdown on SIGTERM
- ⚙️ Environment-based configuration
- 🔒 Secure secret management

## Prerequisites

- Node.js 18+
- npm or yarn

## Local Development

### 1. Clone and Install

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
APP_NAME=task-manager
LOG_LEVEL=debug
JWT_SECRET=your-secret-key-here
PORT=3000
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Test Operational Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Readiness check
curl http://localhost:3000/ready

# Prometheus metrics
curl http://localhost:3000/metrics
```

## Production Build

### Build for Production

```bash
npm run build
npm start
```

Or use the custom server with graceful shutdown:

```bash
npm run build
node server.js
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t task-manager:latest .
```

### Run Docker Container

```bash
docker run -p 3000:3000 \
  -e APP_NAME=task-manager \
  -e LOG_LEVEL=info \
  -e JWT_SECRET=your-secret-key \
  task-manager:latest
```

## Kubernetes Deployment

### Example Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: task-manager
spec:
  replicas: 3
  selector:
    matchLabels:
      app: task-manager
  template:
    metadata:
      labels:
        app: task-manager
    spec:
      containers:
        - name: task-manager
          image: task-manager:latest
          ports:
            - containerPort: 3000
          env:
            - name: APP_NAME
              value: 'task-manager'
            - name: LOG_LEVEL
              value: 'info'
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: task-manager-secrets
                  key: jwt-secret
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
          resources:
            requests:
              memory: '256Mi'
              cpu: '250m'
            limits:
              memory: '512Mi'
              cpu: '500m'
---
apiVersion: v1
kind: Service
metadata:
  name: task-manager
spec:
  selector:
    app: task-manager
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

### Create Kubernetes Secret

```bash
kubectl create secret generic task-manager-secrets \
  --from-literal=jwt-secret=your-secret-key-here
```

### Apply Deployment

```bash
kubectl apply -f deployment.yaml
```

## API Endpoints

### Task Management

- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task
  - Body: `{ "title": "Task title" }`
- `PATCH /api/tasks/:id` - Update a task
  - Body: `{ "title": "New title", "completed": true }`
- `DELETE /api/tasks/:id` - Delete a task

### Operational

- `GET /health` - Health check (liveness probe)
- `GET /ready` - Readiness check (readiness probe)
- `GET /metrics` - Prometheus metrics

## Environment Variables

### Required Configuration

| Variable    | Description                              | Default        |
| ----------- | ---------------------------------------- | -------------- |
| `APP_NAME`  | Application name for logging             | `task-manager` |
| `LOG_LEVEL` | Logging level (error, warn, info, debug) | `info`         |

### Required Secrets

| Variable     | Description                | Default                 |
| ------------ | -------------------------- | ----------------------- |
| `JWT_SECRET` | Secret key for JWT signing | (none - warning logged) |

### Optional

| Variable   | Description                           | Default      |
| ---------- | ------------------------------------- | ------------ |
| `PORT`     | Server port                           | `3000`       |
| `NODE_ENV` | Environment (development, production) | `production` |

## Logging

All logs are output in structured JSON format:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "INFO",
  "app": "task-manager",
  "message": "Task created",
  "meta": {
    "taskId": "abc-123"
  }
}
```

## Metrics

The `/metrics` endpoint exposes Prometheus-compatible metrics:

- `http_requests_total` - Total HTTP requests
- `http_request_duration_ms` - Average request duration
- `tasks_total` - Current number of tasks
- `task_operations_total` - Task operations by type (create, delete, list)

## Architecture

- **Frontend**: React with Next.js App Router, shadcn/ui components
- **Backend**: Next.js API Routes (Route Handlers)
- **Storage**: In-memory (Map-based store)
- **Logging**: Structured JSON logging
- **Metrics**: Prometheus-compatible metrics

## Project Structure

```
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts          # GET, POST /api/tasks
│   │       └── [id]/route.ts     # DELETE, PATCH /api/tasks/:id
│   ├── health/route.ts           # Health check endpoint
│   ├── ready/route.ts            # Readiness endpoint
│   ├── metrics/route.ts          # Prometheus metrics
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── task-manager.tsx          # Main task UI component
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── config.ts                 # Configuration management
│   ├── logger.ts                 # Structured logging
│   ├── metrics.ts                # Metrics collection
│   └── task-store.ts             # In-memory task storage
├── server.js                     # Custom server with graceful shutdown
├── Dockerfile                    # Docker configuration
└── README.md
```

## License

MIT
