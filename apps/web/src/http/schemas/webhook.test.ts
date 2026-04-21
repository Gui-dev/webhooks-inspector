import { describe, expect, it } from 'vitest'
import { webhookDetailsSchema, webhookListItemSchema, webhookListSchema } from './webhook'

const VALID_UUID = '0192de10-d163-7000-9380-9f6c6b5d4a3b'

describe('webhookListItemSchema', () => {
  it('validates valid webhook list item data', () => {
    const validData = {
      id: VALID_UUID,
      method: 'POST',
      pathname: '/api/users',
      createdAt: '2024-01-15T10:30:00Z',
    }
    const result = webhookListItemSchema.parse(validData)
    expect(result.method).toBe('POST')
    expect(result.pathname).toBe('/api/users')
  })

  it('rejects invalid id', () => {
    const invalidData = {
      id: 'not-a-uuid',
      method: 'POST',
      pathname: '/api/users',
      createdAt: '2024-01-15T10:30:00Z',
    }
    expect(() => webhookListItemSchema.parse(invalidData)).toThrow()
  })

  it('rejects missing method', () => {
    const invalidData = {
      id: '01HTMV8YT8B2M8Y2X8Q8YB8Q8B',
      pathname: '/api/users',
      createdAt: '2024-01-15T10:30:00Z',
    }
    expect(() => webhookListItemSchema.parse(invalidData)).toThrow()
  })

  it('rejects missing pathname', () => {
    const invalidData = {
      id: VALID_UUID,
      method: 'POST',
      createdAt: '2024-01-15T10:30:00Z',
    }
    expect(() => webhookListItemSchema.parse(invalidData)).toThrow()
  })
})

describe('webhookListSchema', () => {
  it('validates valid list data', () => {
    const validData = {
      webhooks: [
        {
          id: VALID_UUID,
          method: 'POST',
          pathname: '/api/users',
          createdAt: '2024-01-15T10:30:00Z',
        },
      ],
      nextCursor: 'abc123',
    }
    const result = webhookListSchema.parse(validData)
    expect(result.webhooks).toHaveLength(1)
    expect(result.nextCursor).toBe('abc123')
  })

  it('accepts null nextCursor', () => {
    const validData = {
      webhooks: [],
      nextCursor: null,
    }
    const result = webhookListSchema.parse(validData)
    expect(result.nextCursor).toBeNull()
  })

  it('rejects invalid webhooks array', () => {
    const invalidData = {
      webhooks: 'not-an-array',
      nextCursor: null,
    }
    expect(() => webhookListSchema.parse(invalidData)).toThrow()
  })
})

describe('webhookDetailsSchema', () => {
  it('validates valid details data', () => {
    const validData = {
      id: VALID_UUID,
      ip: '192.168.1.1',
      statusCode: 200,
      method: 'POST',
      pathname: '/api/users',
      body: '{"name": "John"}',
      contentType: 'application/json',
      contentLength: 17,
      queryParams: { page: '1' },
      headers: { 'Content-Type': 'application/json' },
      createdAt: '2024-01-15T10:30:00Z',
    }
    const result = webhookDetailsSchema.parse(validData)
    expect(result.statusCode).toBe(200)
    expect(result.ip).toBe('192.168.1.1')
  })

  it('accepts null body', () => {
    const validData = {
      id: VALID_UUID,
      ip: '192.168.1.1',
      statusCode: 200,
      method: 'POST',
      pathname: '/api/users',
      body: null,
      contentType: null,
      contentLength: null,
      queryParams: null,
      headers: {},
      createdAt: '2024-01-15T10:30:00Z',
    }
    const result = webhookDetailsSchema.parse(validData)
    expect(result.body).toBeNull()
  })

  it('accepts null queryParams', () => {
    const validData = {
      id: VALID_UUID,
      ip: '192.168.1.1',
      statusCode: 200,
      method: 'POST',
      pathname: '/api/users',
      body: null,
      contentType: null,
      contentLength: null,
      queryParams: null,
      headers: {},
      createdAt: '2024-01-15T10:30:00Z',
    }
    const result = webhookDetailsSchema.parse(validData)
    expect(result.queryParams).toBeNull()
  })

  it('rejects invalid statusCode', () => {
    const invalidData = {
      id: VALID_UUID,
      ip: '192.168.1.1',
      statusCode: 'not-a-number',
      method: 'POST',
      pathname: '/api/users',
      body: null,
      contentType: null,
      contentLength: null,
      queryParams: null,
      headers: {},
      createdAt: '2024-01-15T10:30:00Z',
    }
    expect(() => webhookDetailsSchema.parse(invalidData)).toThrow()
  })

  it('rejects missing headers', () => {
    const invalidData = {
      id: VALID_UUID,
      ip: '192.168.1.1',
      statusCode: 200,
      method: 'POST',
      pathname: '/api/users',
      body: null,
      contentType: null,
      contentLength: null,
      queryParams: null,
      createdAt: '2024-01-15T10:30:00Z',
    }
    expect(() => webhookDetailsSchema.parse(invalidData)).toThrow()
  })
})
