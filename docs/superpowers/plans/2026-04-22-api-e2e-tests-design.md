# API E2E Tests with Supertest Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add end-to-end tests for API routes using supertest, covering all CRUD operations for webhooks.

**Architecture:** Tests will create an isolated Fastify app instance for each test file, using an in-memory SQLite database (or mocked repository) to avoid database dependencies. Each test will make actual HTTP requests through supertest and verify responses.

**Tech Stack:** supertest, fastify, vitest (already configured)

---

## File Structure

```
apps/api/src/
├── e2e/
│   ├── helpers/
│   │   └── app.ts          # Create test app instance
│   └── webhooks.e2e.spec.ts  # All webhook route tests
└── server.ts              # Main app factory (needs extraction)
```

---

## Tasks

### Task 1: Extract app factory from server.ts

**Files:**
- Modify: `apps/api/src/server.ts`
- Create: `apps/api/src/app.ts`

- [ ] **Step 1: Create app.ts with factory function**

```typescript
import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { errorHandler } from './error-handler'
import { captureWebhook } from './routes/capture.webhook.route'
import { deleteWebhook } from './routes/delete-webhook.route'
import { getWebhook } from './routes/get-webhook.route'
import { listWebhook } from './routes/list-webhook.route'

export async function buildApp() {
  const app = fastify().withTypeProvider<ZodTypeProvider>()

  app.setSerializerCompiler(serializerCompiler)
  app.setValidatorCompiler(validatorCompiler)

  app.setErrorHandler(errorHandler)

  app.register(fastifyCors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Webhook Inspector',
        description: 'API for capturing and inspecting webhooks',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })

  app.register(ScalarApiReference, {
    routePrefix: '/docs',
  })

  app.register(listWebhook, { prefix: '/api' })
  app.register(getWebhook, { prefix: '/api' })
  app.register(deleteWebhook, { prefix: '/api' })
  app.register(captureWebhook, { prefix: '/api' })

  return app
}
```

- [ ] **Step 2: Update server.ts to use factory**

```typescript
import { buildApp } from './app.js'
import { env } from '@webhooks/env'

buildApp()
  .then(app => {
    app.listen({
      port: env.PORT,
      host: '0.0.0.0',
    })
  })
  .then(() => {
    console.log('🚀 HTTP server running on http://localhost:3333')
    console.log('📚️ Documentation running on http://localhost:3333/docs')
  })
```

- [ ] **Step 3: Run lint check**

Run: `npx biome check apps/api/src/app.ts`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/app.ts apps/api/src/server.ts
git commit -m "refactor(api): extract app factory for testability"
```

---

### Task 2: Create supertest helper and test setup

**Files:**
- Create: `apps/api/src/e2e/helpers/app.ts`
- Modify: `apps/api/vitest.config.ts`

- [ ] **Step 1: Create e2e helper for supertest**

```typescript
import type { FastifyInstance } from 'fastify'
import buildApp from '../app.js'

export async function buildTestApp(): Promise<FastifyInstance> {
  const app = await buildApp()
  await app.ready()
  return app
}

export { supertest from 'supertest' }
```

- [ ] **Step 2: Install supertest**

Run: `cd apps/api && pnpm add -D supertest @types/supertest`
Expected: Package installed

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/e2e/helpers/app.ts apps/api/package.json pnpm-lock.yaml
git commit -m "chore(api): add supertest for e2e tests"
```

---

### Task 3: Create webhook e2e tests

**Files:**
- Create: `apps/api/src/e2e/webhooks.e2e.spec.ts`

- [ ] **Step 1: Write test for list webhooks endpoint**

```typescript
import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import supertest from 'supertest'
import { buildTestApp } from './helpers/app.js'

describe('GET /api/webhooks', () => {
  let app: Awaited<ReturnType<typeof buildTestApp>>
  let request: ReturnType<typeof supertest>

  beforeAll(async () => {
    app = await buildTestApp()
    request = supertest(app.server)
  })

  afterAll(() => app.close())

  it('returns 200 with webhooks array', async () => {
    const response = await request.get('/api/webhooks')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('webhooks')
    expect(Array.isArray(response.body.webhooks)).toBe(true)
  })

  it('supports pagination with limit query param', async () => {
    const response = await request.get('/api/webhooks?limit=5')
    expect(response.status).toBe(200)
    expect(response.body.webhooks.length).toBeLessThanOrEqual(5)
  })

  it('returns 200 with valid cursor', async () => {
    const listResponse = await request.get('/api/webhooks?limit=1')
    if (listResponse.body.webhooks.length > 0) {
      const cursor = listResponse.body.webhooks[0].id
      const response = await request.get(`/api/webhooks?limit=10&cursor=${cursor}`)
      expect(response.status).toBe(200)
    }
  })
})
```

- [ ] **Step 2: Write test for get webhook endpoint**

```typescript
it('returns 200 for existing webhook', async () => {
  const createResponse = await request.post('/api/capture/test-webhook')
  expect(createResponse.status).toBe(200)
  const { id } = createResponse.body

  const response = await request.get(`/api/webhooks/${id}`)
  expect(response.status).toBe(200)
  expect(response.body).toHaveProperty('id', id)
})

it('returns 404 for non-existent webhook', async () => {
  const response = await request.get('/api/webhooks/00000000-0000-0000-0000-000000000000')
  expect(response.status).toBe(404)
})
```

- [ ] **Step 3: Write test for delete webhook endpoint**

```typescript
describe('DELETE /api/webhooks/:id', () => {
  it('returns 204 for existing webhook', async () => {
    const createResponse = await request.post('/api/capture/test-delete')
    const { id } = createResponse.body

    const response = await request.delete(`/api/webhooks/${id}`)
    expect(response.status).toBe(204)
  })

  it('returns 204 even for non-existent webhook', async () => {
    const response = await request.delete('/api/webhooks/00000000-0000-0000-0000-000000000000')
    expect(response.status).toBe(204)
  })
})
```

- [ ] **Step 4: Write test for capture webhook endpoint**

```typescript
describe('POST /api/capture/*', () => {
  it('returns 200 with id', async () => {
    const response = await request.post('/api/capture/test-webhook').send({ test: 'data' })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
  })

  it('captures GET request', async () => {
    const response = await request.get('/api/capture/test-get')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
  })
})
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd apps/api && pnpm test`
Expected: All e2e tests pass

- [ ] **Step 6: Commit**

```bash
git add apps/api/src/e2e/webhooks.e2e.spec.ts
git commit -m "test(api): add e2e tests for webhook endpoints"
```

---

## Dependencies

- `supertest` - HTTP assertions
- `fastify` - Already installed

## Notes

1. Tests use `app.server` to get the underlying Node HTTP server for supertest
2. Each test file should call `app.close()` in `afterAll` to prevent port conflicts
3. For CI, consider using a test database or transaction rollback between tests