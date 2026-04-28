import { beforeEach, describe, expect, it } from 'vitest'
import type { WebhooksSelect } from '@/contracts/webhooks.contract'
import { WebhooksInMemoryRepository } from '../repositories/in-memory-repository/webhooks.in-memory.repository.js'
import { GenerateHandlerUseCase } from './generate-handler.use-case.js'

describe('GenerateHandlerUseCase', () => {
  let repository: WebhooksInMemoryRepository
  let sut: GenerateHandlerUseCase

  beforeEach(() => {
    repository = new WebhooksInMemoryRepository()
    sut = new GenerateHandlerUseCase(repository)
  })

  it('should return code from webhooks bodies', async () => {
    const webhook1: WebhooksSelect = {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      method: 'POST',
      pathname: '/webhook/one',
      ip: '192.168.1.1',
      statusCode: 200,
      contentType: 'application/json',
      contentLength: 100,
      queryParams: { event: 'created' },
      headers: { 'content-type': 'application/json' },
      body: '{"event": "user.created", "data": {"id": "1"}}',
      createdAt: new Date('2024-01-01'),
    }
    const webhook2: WebhooksSelect = {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      method: 'POST',
      pathname: '/webhook/two',
      ip: '192.168.1.2',
      statusCode: 200,
      contentType: 'application/json',
      contentLength: 80,
      queryParams: { event: 'updated' },
      headers: { 'content-type': 'application/json' },
      body: '{"event": "user.updated", "data": {"id": "1"}}',
      createdAt: new Date('2024-01-02'),
    }

    repository.add(webhook1)
    repository.add(webhook2)

    const result = await sut.execute({ ids: [webhook1.id, webhook2.id] })

    expect(result.code).toContain(webhook1.body)
    expect(result.code).toContain(webhook2.body)
  })

  it('should return empty code when no webhooks found', async () => {
    const result = await sut.execute({ ids: ['non-existent-id'] })

    expect(result.code).toBe('')
  })

  it('should return code from single webhook', async () => {
    const webhook: WebhooksSelect = {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      method: 'POST',
      pathname: '/webhook/test',
      ip: '192.168.1.1',
      statusCode: 200,
      contentType: 'application/json',
      contentLength: 100,
      queryParams: {},
      headers: { 'content-type': 'application/json' },
      body: '{"event": "test"}',
      createdAt: new Date(),
    }

    repository.add(webhook)

    const result = await sut.execute({ ids: [webhook.id] })

    expect(result.code).toBe(webhook.body)
  })
})
