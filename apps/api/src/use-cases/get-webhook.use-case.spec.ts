import { beforeEach, describe, expect, it } from 'vitest'
import { WebhooksInMemoryRepository } from '../repositories/in-memory-repository/webhooks.in-memory.repository.js'
import { GetWebhookUseCase } from './get-webhook.use-case.js'

describe('GetWebhookUseCase', () => {
  let repository: WebhooksInMemoryRepository
  let sut: GetWebhookUseCase

  beforeEach(() => {
    repository = new WebhooksInMemoryRepository()
    sut = new GetWebhookUseCase(repository)
  })

  it('should return webhook when id exists', async () => {
    const webhook = {
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
      createdAt: new Date(),
    }

    repository.add(webhook)

    const result = await sut.execute(webhook.id)

    expect(result).toBeDefined()
    expect(result?.id).toBe(webhook.id)
    expect(result?.method).toBe('POST')
    expect(result?.pathname).toBe('/webhook/test')
  })

  it('should throw error when webhook not found', async () => {
    await expect(sut.execute('non-existent-id')).rejects.toThrow('Webhook not found')
  })
})
