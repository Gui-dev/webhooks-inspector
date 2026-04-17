import { beforeEach, describe, expect, it } from 'vitest'
import type { WebhooksSelect } from '@/contracts/webhooks.contract'
import { WebhooksInMemoryRepository } from '../repositories/in-memory-repository/webhooks.in-memory.repository.js'
import { ListWebhooksUseCase } from './list-webhooks.use-case.js'

describe('ListWebhooksUseCase', () => {
  let repository: WebhooksInMemoryRepository
  let sut: ListWebhooksUseCase

  beforeEach(() => {
    repository = new WebhooksInMemoryRepository()
    sut = new ListWebhooksUseCase(repository)
  })

  it('should return list of webhooks with default limit', async () => {
    const webhook1: WebhooksSelect = {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      method: 'POST',
      pathname: '/webhook/one',
      ip: '192.168.1.1',
      statusCode: 200,
      contentType: 'application/json',
      contentLength: 100,
      queryParams: {},
      headers: {},
      body: '{}',
      createdAt: new Date('2024-01-01'),
    }
    const webhook2: WebhooksSelect = {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      method: 'GET',
      pathname: '/webhook/two',
      ip: '192.168.1.2',
      statusCode: 200,
      contentType: 'application/json',
      contentLength: 50,
      queryParams: {},
      headers: {},
      body: '',
      createdAt: new Date('2024-01-02'),
    }

    repository.add(webhook1)
    repository.add(webhook2)

    const result = await sut.execute({ limit: 20 })

    expect(result.items).toHaveLength(2)
    expect(result.nextCursor).toBeNull()
  })

  it('should return limited results', async () => {
    for (let i = 0; i < 5; i++) {
      repository.add({
        id: `id-${i}`,
        method: 'POST',
        pathname: `/webhook/${i}`,
        ip: '192.168.1.1',
        statusCode: 200,
        contentType: 'application/json',
        contentLength: 100,
        queryParams: {},
        headers: {},
        body: '{}',
        createdAt: new Date(),
      })
    }

    const result = await sut.execute({ limit: 2 })

    expect(result.items).toHaveLength(2)
    expect(result.nextCursor).toBeDefined()
  })

  it('should return empty list when no webhooks', async () => {
    const result = await sut.execute({ limit: 20 })

    expect(result.items).toHaveLength(0)
    expect(result.nextCursor).toBeNull()
  })
})
