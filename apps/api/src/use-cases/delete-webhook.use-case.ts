import { NotFoundError } from '@/_error/not-found.error'
import type { IWebhooksContract } from '@/contracts/webhooks.contract'

export class DeleteWebhookUseCase {
  constructor(private readonly webhooksRepository: IWebhooksContract) {}

  public async execute(id: string): Promise<void> {
    const webhook = await this.webhooksRepository.getWebhook(id)

    if (!webhook) {
      throw new NotFoundError('Webhook not found')
    }

    await this.webhooksRepository.deleteWebhook(id)
  }
}
