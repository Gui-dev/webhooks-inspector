import { desc, eq, inArray, lt } from 'drizzle-orm'
import { db } from '@/db'
import { webhooks } from '@/db/schema'
import type {
  ICaptureWebhookProps,
  IListWebhooksParams,
  IListWebhooksResponse,
  WebhooksSelect,
} from '../contracts/webhooks.contract'

export class WebhooksRepository {
  public async getWebhook(id: string): Promise<WebhooksSelect | undefined> {
    const [webhook] = await db.select().from(webhooks).where(eq(webhooks.id, id)).limit(1)

    return webhook
  }

  public async getManyWebhooksById(ids: string[]): Promise<WebhooksSelect[]> {
    const result = await db.select().from(webhooks).where(inArray(webhooks.id, ids))

    return result
  }

  public async listWebhooks({
    limit,
    cursor,
  }: IListWebhooksParams): Promise<IListWebhooksResponse[]> {
    const result = await db
      .select({
        id: webhooks.id,
        method: webhooks.method,
        pathname: webhooks.pathname,
        createdAt: webhooks.createdAt,
      })
      .from(webhooks)
      .where(cursor ? lt(webhooks.id, cursor) : undefined)
      .orderBy(desc(webhooks.id))
      .limit(limit + 1)

    return result
  }

  public async captureWebhook({
    method,
    ip,
    pathname,
    statusCode,
    contentType,
    contentLength,
    queryParams,
    headers,
    body,
  }: ICaptureWebhookProps): Promise<WebhooksSelect[]> {
    const result = await db
      .insert(webhooks)
      .values({
        method,
        ip,
        pathname,
        statusCode,
        contentType,
        contentLength,
        queryParams,
        headers,
        body,
      })
      .returning()

    return result
  }

  public async deleteWebhook(id: string): Promise<void> {
    await db.delete(webhooks).where(eq(webhooks.id, id))
  }
}
