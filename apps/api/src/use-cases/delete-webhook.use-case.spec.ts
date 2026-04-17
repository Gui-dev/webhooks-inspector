import { beforeEach, describe, expect, it } from 'vitest'
import { NotFoundError } from '@/_error/not-found.error'
import type { WebhooksSelect } from '@/contracts/webhooks.contract'
import { WebhooksInMemoryRepository } from '../repositories/in-memory-repository/webhooks.in-memory.repository.js'
import { DeleteWebhookUseCase } from './delete-webhook.use-case.js'

describe('DeleteWebhookUseCase', () => {
  let repository: WebhooksInMemoryRepository
  let sut: DeleteWebhookUseCase

  beforeEach(() => {
    repository = new WebhooksInMemoryRepository()
    sut = new DeleteWebhookUseCase(repository)
  })

  it('should delete webhook when id exists', async () => {
    const webhook: WebhooksSelect = {
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

    await sut.execute(webhook.id)

    const deleted = await repository.getWebhook(webhook.id)
    expect(deleted).toBeUndefined()
  })

  it('should throw NotFoundError when webhook not found', async () => {
    await expect(sut.execute('non-existent-id')).rejects.toThrow(NotFoundError)
  })
})
