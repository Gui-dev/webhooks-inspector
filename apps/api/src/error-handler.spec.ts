import type { FastifyInstance } from 'fastify'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'
import { BadRequestError } from '@/_error/bad-request.error'
import { NotFoundError } from '@/_error/not-found.error'
import { errorHandler } from './error-handler'

describe('errorHandler', () => {
  let mockReply: any
  let mockRequest: any

  beforeEach(() => {
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    }
    mockRequest = {}
  })

  it('handles ZodError and returns 400 with validation errors', () => {
    const zodError = new ZodError([
      { code: 'invalid_type', path: ['body', 'id'], message: 'Expected string' },
    ])

    errorHandler(zodError as any, mockRequest as any, mockReply as any)

    expect(mockReply.status).toHaveBeenCalledWith(400)
    expect(mockReply.send).toHaveBeenCalledWith({
      message: 'Validation error',
      errors: expect.any(Object),
    })
  })

  it('handles BadRequestError and returns 400', () => {
    const error = new BadRequestError('Invalid input')

    errorHandler(error as any, mockRequest as any, mockReply as any)

    expect(mockReply.status).toHaveBeenCalledWith(400)
    expect(mockReply.send).toHaveBeenCalledWith({
      message: 'Invalid input',
    })
  })

  it('handles NotFoundError and returns 404', () => {
    const error = new NotFoundError('Webhook not found')

    errorHandler(error as any, mockRequest as any, mockReply as any)

    expect(mockReply.status).toHaveBeenCalledWith(404)
    expect(mockReply.send).toHaveBeenCalledWith({
      message: 'Webhook not found',
    })
  })

  it('handles validation error and returns 400', () => {
    const error = new Error('Validation failed')
    ;(error as any).validation = true

    errorHandler(error as any, mockRequest as any, mockReply as any)

    expect(mockReply.status).toHaveBeenCalledWith(400)
    expect(mockReply.send).toHaveBeenCalledWith({
      message: 'Validation failed',
    })
  })

  it('handles statusCode 400 error and returns 400', () => {
    const error = new Error('Bad request')
    ;(error as any).statusCode = 400

    errorHandler(error as any, mockRequest as any, mockReply as any)

    expect(mockReply.status).toHaveBeenCalledWith(400)
    expect(mockReply.send).toHaveBeenCalledWith({
      message: 'Bad request',
    })
  })

  it('handles unknown error and returns 500', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const error = new Error('Unknown error')

    errorHandler(error as any, mockRequest as any, mockReply as any)

    expect(mockReply.status).toHaveBeenCalledWith(500)
    expect(mockReply.send).toHaveBeenCalledWith({
      message: 'Internal server error',
    })
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
