import { describe, expect, it } from 'vitest'
import { NotFoundError } from './not-found.error'

describe('NotFoundError', () => {
  it('should create error with message', () => {
    const error = new NotFoundError('Resource not found')
    expect(error.message).toBe('Resource not found')
  })

  it('should have name property set to NotFoundError', () => {
    const error = new NotFoundError('Not found')
    expect(error.name).toBe('NotFoundError')
  })

  it('should be instance of Error', () => {
    const error = new NotFoundError('Not found')
    expect(error).toBeInstanceOf(Error)
  })

  it('should be instance of NotFoundError', () => {
    const error = new NotFoundError('Not found')
    expect(error).toBeInstanceOf(NotFoundError)
  })

  it('should have stack trace', () => {
    const error = new NotFoundError('Not found')
    expect(error.stack).toBeDefined()
  })
})
