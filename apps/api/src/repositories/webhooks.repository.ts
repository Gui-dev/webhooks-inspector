import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { webhooks } from '@/db/schema'
import type { WebhooksSelect } from '../contracts/webhooks.contract'

export class WebhooksRepository {
  public async getWebhook(id: string): Promise<WebhooksSelect | undefined> {
    const [webhook] = await db.select().from(webhooks).where(eq(webhooks.id, id)).limit(1)

    return webhook
  }

  public async listWebhooks(): Promise<WebhooksSelect[]> {
    return db.select().from(webhooks)
  }
}
