import { beforeEach, describe, expect, it } from 'vitest'
import type { ICaptureWebhookProps } from '@/contracts/webhooks.contract'
import { WebhooksInMemoryRepository } from '../repositories/in-memory-repository/webhooks.in-memory.repository.js'
import { CaptureWebhookUseCase } from './capture-webhook.use-case.js'

describe('CaptureWebhookUseCase', () => {
  let repository: WebhooksInMemoryRepository
  let sut: CaptureWebhookUseCase

  beforeEach(() => {
    repository = new WebhooksInMemoryRepository()
    sut = new CaptureWebhookUseCase(repository)
  })

  it('should capture a webhook with valid data', async () => {
    const props: ICaptureWebhookProps = {
      method: 'POST',
      ip: '192.168.1.1',
      pathname: '/webhook/test',
      headers: { 'content-type': 'application/json' },
      body: '{"key": "value"}',
    }

    const result = await sut.execute(props)

    expect(result.id).toBeDefined()
  })

  it('should capture webhook with all optional fields', async () => {
    const props: ICaptureWebhookProps = {
      method: 'POST',
      ip: '192.168.1.1',
      pathname: '/webhook/test',
      statusCode: 201,
      contentType: 'application/json',
      contentLength: 100,
      queryParams: { page: '1' },
      headers: { 'content-type': 'application/json' },
      body: '{"key": "value"}',
    }

    const result = await sut.execute(props)

    expect(result.id).toBeDefined()
  })

  it('should capture webhook with minimal data', async () => {
    const props: ICaptureWebhookProps = {
      method: 'GET',
      ip: '192.168.1.1',
      pathname: '/webhook/test',
      headers: {},
    }

    const result = await sut.execute(props)

    expect(result.id).toBeDefined()
  })
})
