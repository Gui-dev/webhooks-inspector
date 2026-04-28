import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { errorHandler } from './error-handler'
import { captureWebhook } from './routes/capture.webhook.route'
import { deleteWebhook } from './routes/delete-webhook.route'
import { generateHandler } from './routes/generate-handler.route'
import { getWebhook } from './routes/get-webhook.route'
import { listWebhook } from './routes/list-webhook.route'

export async function buildApp() {
  const app = fastify().withTypeProvider<ZodTypeProvider>()

  app.setSerializerCompiler(serializerCompiler)
  app.setValidatorCompiler(validatorCompiler)

  app.setErrorHandler(errorHandler)

  app.register(fastifyCors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Webhook Inspector',
        description: 'API for capturing and inspecting webhooks',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })

  app.register(ScalarApiReference, {
    routePrefix: '/docs',
  })

  app.register(listWebhook, { prefix: '/api' })
  app.register(getWebhook, { prefix: '/api' })
  app.register(deleteWebhook, { prefix: '/api' })
  app.register(captureWebhook, { prefix: '/api' })
  app.register(generateHandler, { prefix: '/api' })

  return app
}
