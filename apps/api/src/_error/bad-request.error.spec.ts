import { describe, expect, it } from 'vitest'
import { BadRequestError } from './bad-request.error'

describe('BadRequestError', () => {
  it('should create error with message', () => {
    const error = new BadRequestError('Invalid request')
    expect(error.message).toBe('Invalid request')
  })

  it('should have name property set to BadRequestError', () => {
    const error = new BadRequestError('Bad request')
    expect(error.name).toBe('BadRequestError')
  })

  it('should be instance of Error', () => {
    const error = new BadRequestError('Bad request')
    expect(error).toBeInstanceOf(Error)
  })

  it('should be instance of BadRequestError', () => {
    const error = new BadRequestError('Bad request')
    expect(error).toBeInstanceOf(BadRequestError)
  })

  it('should have stack trace', () => {
    const error = new BadRequestError('Bad request')
    expect(error.stack).toBeDefined()
  })
})
