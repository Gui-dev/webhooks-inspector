import { createSelectSchema } from 'drizzle-zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { webhooks } from '@/db/schema'
import { WebhooksRepository } from '@/repositories/webhooks.repository'
import { ListWebhooksUseCase } from '@/use-cases/list-webhooks.use-case'

export const listWebhook: FastifyPluginAsyncZod = async app => {
  app.get(
    '/webhooks',
    {
      schema: {
        summary: 'List all webhooks',
        tags: ['webhooks'],
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(20),
          cursor: z.string().optional(),
        }),
        response: {
          200: z.object({
            webhooks: z.array(
              createSelectSchema(webhooks).pick({
                id: true,
                method: true,
                pathname: true,
                createdAt: true,
              })
            ),
            nextCursor: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { limit, cursor } = request.query

      const webhookRepository = new WebhooksRepository()
      const listWebhooksUseCase = new ListWebhooksUseCase(webhookRepository)
      const { items: webhooks, nextCursor } = await listWebhooksUseCase.execute({ limit, cursor })

      reply.status(200).send({ webhooks, nextCursor })
    }
  )
}
