import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { buildApp } from '../app.js'

const NON_EXISTENT_UUID = '019db73f-cdde-7c85-ba75-bb1e754a1405'

describe('Webhook API E2E', () => {
  let app: Awaited<ReturnType<typeof buildApp>>
  let request: ReturnType<typeof supertest>

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
    request = supertest(app.server)
  })

  afterAll(() => app.close())

  describe('GET /api/webhooks', () => {
    it('returns 200 with webhooks array', async () => {
      const response = await request.get('/api/webhooks')
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('webhooks')
      expect(Array.isArray(response.body.webhooks)).toBe(true)
    })

    it('returns 200 with nextCursor', async () => {
      const response = await request.get('/api/webhooks')
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('nextCursor')
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

  describe('GET /api/webhooks/:id', () => {
    it('returns 200 for existing webhook', async () => {
      const createResponse = await request.post('/api/capture/test-get-webhook')
      expect(createResponse.status).toBe(200)
      const { id } = createResponse.body

      const response = await request.get(`/api/webhooks/${id}`)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id', id)
    })

    it('returns 400 for non-existent webhook', async () => {
      const response = await request.get('/api/webhooks/NON_EXISTENT_UUID')
      expect(response.status).toBe(400)
    })

    it('returns 400 for invalid UUID', async () => {
      const response = await request.get('/api/webhooks/not-a-uuid')
      expect(response.status).toBe(400)
    })
  })

  describe('DELETE /api/webhooks/:id', () => {
    it('returns 204 for existing webhook', async () => {
      const createResponse = await request.post('/api/capture/test-delete')
      expect(createResponse.status).toBe(200)
      const { id } = createResponse.body

      const response = await request.delete(`/api/webhooks/${id}`)
      expect(response.status).toBe(204)
    })

    it('returns 400 for non-existent webhook', async () => {
      const response = await request.delete('/api/webhooks/NON_EXISTENT_UUID')
      expect(response.status).toBe(400)
    })

    it('returns 400 for invalid UUID', async () => {
      const response = await request.delete('/api/webhooks/not-a-uuid')
      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/capture/*', () => {
    it('returns 200 with id for POST request', async () => {
      const response = await request.post('/api/capture/test-webhook').send({ test: 'data' })
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
    })

    it('captures GET request', async () => {
      const response = await request.get('/api/capture/test-get')
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
    })

    it('captures PUT request', async () => {
      const response = await request.put('/api/capture/test-put').send({ test: 'data' })
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
    })

    it('captures DELETE request', async () => {
      const response = await request.delete('/api/capture/test-delete')
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
    })

    it('captures request with headers', async () => {
      const response = await request
        .post('/api/capture/test-headers')
        .set('Content-Type', 'application/json')
        .set('X-Custom-Header', 'test-value')
        .send({ test: 'data' })
      expect(response.status).toBe(200)
    })

    it('captures request with query params', async () => {
      const response = await request.post('/api/capture/test-query?foo=bar&baz=qux')
      expect(response.status).toBe(200)
    })
  })
})
