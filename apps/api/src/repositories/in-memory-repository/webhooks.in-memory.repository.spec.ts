import { beforeEach, describe, expect, it } from 'vitest'
import type { ICaptureWebhookProps, WebhooksSelect } from '@/contracts/webhooks.contract'
import { WebhooksInMemoryRepository } from './webhooks.in-memory.repository'

describe('WebhooksInMemoryRepository', () => {
  let repository: WebhooksInMemoryRepository

  const mockWebhook: WebhooksSelect = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    method: 'POST',
    pathname: '/webhook/test',
    ip: '192.168.1.1',
    statusCode: 200,
    contentType: 'application/json',
    contentLength: 100,
    queryParams: { source: 'test' },
    headers: { 'content-type': 'application/json' },
    body: '{ "event": "test" }',
    createdAt: new Date('2024-01-01T00:00:00Z'),
  }

  beforeEach(() => {
    repository = new WebhooksInMemoryRepository()
  })

  describe('add', () => {
    it('should add webhook to repository', async () => {
      repository.add(mockWebhook)
      await expect(repository.getWebhook(mockWebhook.id)).resolves.toEqual(mockWebhook)
    })
  })

  describe('getWebhook', () => {
    it('should return webhook when id exists', async () => {
      repository.add(mockWebhook)
      const result = await repository.getWebhook(mockWebhook.id)
      expect(result).toEqual(mockWebhook)
    })

    it('should return undefined when id does not exist', async () => {
      const result = await repository.getWebhook('non-existent-id')
      expect(result).toBeUndefined()
    })
  })

  describe('listWebhooks', () => {
    it('should return empty array when no webhooks exist', async () => {
      const result = await repository.listWebhooks({ limit: 10 })
      expect(result).toEqual([])
    })

    it('should return webhooks up to limit', async () => {
      const webhooks = [
        { ...mockWebhook, id: '00000000-0000-0000-0000-000000000001' },
        { ...mockWebhook, id: '00000000-0000-0000-0000-000000000002' },
        { ...mockWebhook, id: '00000000-0000-0000-0000-000000000003' },
      ]
      for (const w of webhooks) {
        repository.add(w)
      }

      const result = await repository.listWebhooks({ limit: 2 })
      expect(result).toHaveLength(2)
    })

    it('should return webhooks with correct shape', async () => {
      repository.add(mockWebhook)
      const result = await repository.listWebhooks({ limit: 10 })

      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('method')
      expect(result[0]).toHaveProperty('pathname')
      expect(result[0]).toHaveProperty('createdAt')
      expect(result[0]).not.toHaveProperty('ip')
      expect(result[0]).not.toHaveProperty('body')
    })

    it('should filter webhooks with cursor', async () => {
      repository.add({ ...mockWebhook, id: '00000000-0000-0000-0000-000000000001' })
      repository.add({ ...mockWebhook, id: '00000000-0000-0000-0000-000000000002' })
      repository.add({ ...mockWebhook, id: '00000000-0000-0000-0000-000000000003' })

      const result = await repository.listWebhooks({
        limit: 10,
        cursor: '00000000-0000-0000-0000-000000000002',
      })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('00000000-0000-0000-0000-000000000001')
    })

    it('should sort webhooks by id descending', async () => {
      repository.add({ ...mockWebhook, id: '00000000-0000-0000-0000-000000000001' })
      repository.add({ ...mockWebhook, id: '00000000-0000-0000-0000-000000000003' })
      repository.add({ ...mockWebhook, id: '00000000-0000-0000-0000-000000000002' })

      const result = await repository.listWebhooks({ limit: 10 })
      expect(result[0].id).toBe('00000000-0000-0000-0000-000000000003')
    })
  })

  describe('deleteWebhook', () => {
    it('should delete webhook by id', async () => {
      repository.add(mockWebhook)
      await repository.deleteWebhook(mockWebhook.id)
      const result = await repository.getWebhook(mockWebhook.id)
      expect(result).toBeUndefined()
    })

    it('should not throw when id does not exist', async () => {
      await expect(repository.deleteWebhook('non-existent-id')).resolves.toBeUndefined()
    })
  })

  describe('captureWebhook', () => {
    it('should create webhook with generated id', async () => {
      const props: ICaptureWebhookProps = {
        method: 'GET',
        ip: '10.0.0.1',
        pathname: '/api/test',
        statusCode: 201,
        headers: {},
        body: null,
      }

      const result = await repository.captureWebhook(props)
      expect(result).toHaveLength(1)
      expect(result[0]).toHaveProperty('id')
      expect(result[0].method).toBe('GET')
      expect(result[0].pathname).toBe('/api/test')
    })

    it('should set default values for optional fields', async () => {
      const props: ICaptureWebhookProps = {
        method: 'POST',
        ip: '10.0.0.1',
        pathname: '/api/test',
        headers: {},
      }

      const result = await repository.captureWebhook(props)
      expect(result[0].statusCode).toBe(200)
      expect(result[0].contentType).toBeNull()
      expect(result[0].contentLength).toBeNull()
    })

    it('should add webhook to repository', async () => {
      const props: ICaptureWebhookProps = {
        method: 'POST',
        ip: '10.0.0.1',
        pathname: '/api/test',
        headers: {},
      }

      const result = await repository.captureWebhook(props)
      const stored = await repository.getWebhook(result[0].id)
      expect(stored).toBeDefined()
    })
  })
})
