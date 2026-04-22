import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { BadRequestError } from './_error/bad-request.error'
import { NotFoundError } from './_error/not-found.error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      message: error.message,
    })
  }

  if (error.validation || error.statusCode === 400) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  console.log('ERROR_500: ', error)

  return reply.status(500).send({
    message: 'Internal server error',
  })
}
