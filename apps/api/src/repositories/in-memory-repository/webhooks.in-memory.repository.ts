import type {
  IListWebhooksParams,
  IListWebhooksResponse,
  WebhooksSelect,
} from '@/contracts/webhooks.contract'

export class WebhooksInMemoryRepository {
  private webhooks = new Map<string, WebhooksSelect>()

  public async getWebhook(id: string): Promise<WebhooksSelect | undefined> {
    return this.webhooks.get(id)
  }

  public async listWebhooks({
    limit,
    cursor,
  }: IListWebhooksParams): Promise<IListWebhooksResponse[]> {
    const all = Array.from(this.webhooks.values()).sort((a, b) => b.id.localeCompare(a.id))

    const filtered = cursor ? all.filter(w => w.id < cursor) : all

    return filtered.slice(0, limit).map(w => ({
      id: w.id,
      method: w.method,
      pathname: w.pathname,
      createdAt: w.createdAt,
    }))
  }

  public async deleteWebhook(_id: string): Promise<void> {
    this.webhooks.delete(_id)
  }

  public add(webhook: WebhooksSelect): void {
    this.webhooks.set(webhook.id, webhook)
  }
}
