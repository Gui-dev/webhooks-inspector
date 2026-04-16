import type { IWebhooksContract, WebhooksSelect } from '@/contracts/webhooks.contract'
import { NotFoundError } from '@/errors/not-found.error'

export class GetWebhookUseCase {
  constructor(private readonly webhooksRepository: IWebhooksContract) {}

  public async execute(id: string): Promise<WebhooksSelect | undefined> {
    const webhook = await this.webhooksRepository.getWebhook(id)

    if (!webhook) {
      throw new NotFoundError('Webhook not found')
    }

    return webhook
  }
}
