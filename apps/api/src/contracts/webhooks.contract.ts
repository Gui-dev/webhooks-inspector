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

export interface ICaptureWebhookProps {
  method: string
  ip: string
  pathname: string
  statusCode?: number
  contentType?: string
  contentLength?: number | null
  queryParams?: Record<string, string>
  headers: Record<string, string>
  body?: string | null
}

export interface IWebhooksContract {
  listWebhooks: (params: IListWebhooksParams) => Promise<IListWebhooksResponse[]>
  getWebhook: (id: string) => Promise<WebhooksSelect | undefined>
  getManyWebhooksById: (ids: string[]) => Promise<WebhooksSelect[]>
  deleteWebhook: (id: string) => Promise<void>
  captureWebhook: (props: ICaptureWebhookProps) => Promise<WebhooksSelect[]>
}
