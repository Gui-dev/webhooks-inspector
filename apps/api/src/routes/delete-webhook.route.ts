import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { WebhooksRepository } from '@/repositories/webhooks.repository'
import { DeleteWebhookUseCase } from '@/use-cases/delete-webhook.use-case'

export const deleteWebhook: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/webhooks/:id',
    {
      schema: {
        summary: 'Delete a specific webhook by id',
        tags: ['webhooks'],
        params: z.object({
          id: z.uuidv7(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const webhookRepository = new WebhooksRepository()
      const deleteWebhookUseCase = new DeleteWebhookUseCase(webhookRepository)

      await deleteWebhookUseCase.execute(id)

      reply.status(204).send()
    }
  )
}
