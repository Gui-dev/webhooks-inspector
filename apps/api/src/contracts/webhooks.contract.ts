import type { InferSelectModel } from 'drizzle-orm'
import type { webhooks } from '@/db/schema'

export type WebhooksSelect = InferSelectModel<typeof webhooks>

export interface IListWebhooksParams {
  limit: number
  cursor?: string
}

export interface IListWebhooksResponse {
  id: string
  method: string
  pathname: string
  createdAt: Date
}

export interface IWebhooksContract {
  listWebhooks: (params: IListWebhooksParams) => Promise<IListWebhooksResponse[]>
  getWebhook: (id: string) => Promise<WebhooksSelect | undefined>
  deleteWebhook: (id: string) => Promise<void>
}
