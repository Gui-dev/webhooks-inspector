import { NotFoundError } from '@/_error/not-found.error'
import type { IWebhooksContract, WebhooksSelect } from '@/contracts/webhooks.contract'

export class GetWebhookUseCase {
  constructor(private readonly webhooksRepository: IWebhooksContract) {}

  public async execute(id: string): Promise<WebhooksSelect> {
    const webhook = await this.webhooksRepository.getWebhook(id)

    if (!webhook) {
      throw new NotFoundError('Webhook not found')
    }

    return webhook
  }
}
