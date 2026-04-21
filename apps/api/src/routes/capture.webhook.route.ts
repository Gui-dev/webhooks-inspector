import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { WebhooksRepository } from '@/repositories/webhooks.repository'
import { CaptureWebhookUseCase } from '@/use-cases/capture-webhook.use-case'

export const captureWebhook: FastifyPluginAsyncZod = async app => {
  app.all(
    '/capture/*',
    {
      schema: {
        summary: 'Capture all webhooks',
        tags: ['external'],
        response: {
          200: z.object({
            id: z.uuidv7(),
          }),
        },
      },
    },
    async (request, reply) => {
      const method = request.method
      const ip = request.ip
      const contentType = request.headers['content-type']
      const contentLength = request.headers['content-length']
        ? Number(request.headers['content-length'])
        : null
      const pathname = new URL(request.url).pathname.replace('/capture', '')
      const headers = Object.fromEntries(
        Object.entries(request.headers).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(', ') : value || '',
        ])
      )

      let body: string | null = null

      if (request.body) {
        body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body)
      }

      const webhooksRepository = new WebhooksRepository()
      const captureWebhookUseCase = new CaptureWebhookUseCase(webhooksRepository)
      const { id } = await captureWebhookUseCase.execute({
        method,
        ip,
        pathname,
        statusCode: reply.statusCode,
        contentType,
        contentLength,
        headers,
        body,
      })

      reply.status(200).send({ id })
    }
  )
}
