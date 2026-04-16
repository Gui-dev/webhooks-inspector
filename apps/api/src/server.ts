import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { env } from '@webhooks/env'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { deleteWebhook } from './routes/delete-webhook.route'
import { getWebhook } from './routes/get-webhook.route'
import { listWebhook } from './routes/list-webhook.route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

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

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 HTTP server running on http://localhost:3333')
    console.log('📚️ Documentation running on http://localhost:3333/docs')
  })
