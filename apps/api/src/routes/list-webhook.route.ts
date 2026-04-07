import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const listWebhook: FastifyPluginAsyncZod = async app => {
  app.get(
    '/webhooks',
    {
      schema: {
        summary: 'List all webhooks',
        tags: ['webhooks'],
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(20),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              method: z.string(),
            })
          ),
        },
      },
    },
    async (_request, reply) => {
      reply.status(200).send([{ id: '2', method: 'POST' }])
    }
  )
}
