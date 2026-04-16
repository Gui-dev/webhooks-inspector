import type { WebhooksSelect } from '@/contracts/webhooks.contract'

export class WebhooksInMemoryRepository {
  private webhooks = new Map<string, WebhooksSelect>()

  public async getWebhook(id: string): Promise<WebhooksSelect | undefined> {
    return this.webhooks.get(id)
  }

  public async listWebhooks(): Promise<WebhooksSelect[]> {
    return Array.from(this.webhooks.values())
  }

  public async deleteWebhook(_id: string): Promise<void> {
    this.webhooks.delete(_id)
  }

  public add(webhook: WebhooksSelect): void {
    this.webhooks.set(webhook.id, webhook)
  }
}
