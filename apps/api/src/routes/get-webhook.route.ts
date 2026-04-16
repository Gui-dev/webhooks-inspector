import { createSelectSchema } from 'drizzle-zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { webhooks } from '@/db/schema'
import { WebhooksRepository } from '@/repositories/webhooks.repository'
import { GetWebhookUseCase } from '@/use-cases/get-webhook.use-case'

export const getWebhook: FastifyPluginAsyncZod = async app => {
  app.get(
    '/webhooks/:id',
    {
      schema: {
        summary: 'Get a specific webhook by id',
        tags: ['webhooks'],
        params: z.object({
          id: z.uuidv7(),
        }),
        response: {
          200: createSelectSchema(webhooks),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const webhookRepository = new WebhooksRepository()
      const getWebhookUseCase = new GetWebhookUseCase(webhookRepository)

      const webhook = await getWebhookUseCase.execute(id)

      reply.status(200).send(webhook)
    }
  )
}
