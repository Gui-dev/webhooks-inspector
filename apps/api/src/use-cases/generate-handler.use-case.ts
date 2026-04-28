import type { IWebhooksContract } from '@/contracts/webhooks.contract'

interface IGenerateHandlerUseCaseProps {
  ids: string[]
}

export class GenerateHandlerUseCase {
  constructor(private readonly webhooksRepository: IWebhooksContract) {}

  public async execute({ ids }: IGenerateHandlerUseCaseProps): Promise<{ code: string }> {
    const result = await this.webhooksRepository.getManyWebhooksById(ids)

    const webhooksBodies = result.map(webhook => webhook.body).join('\n\n')

    return {
      code: webhooksBodies,
    }
  }
}
