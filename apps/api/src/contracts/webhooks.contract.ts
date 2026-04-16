import type { InferSelectModel } from 'drizzle-orm'
import type { webhooks } from '@/db/schema'

export type WebhooksSelect = InferSelectModel<typeof webhooks>

export interface IWebhooksContract {
  listWebhooks: () => Promise<WebhooksSelect[]>
  getWebhook: (id: string) => Promise<WebhooksSelect | undefined>
}
