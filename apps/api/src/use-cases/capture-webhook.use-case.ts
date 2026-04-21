import type { ICaptureWebhookProps, IWebhooksContract } from '@/contracts/webhooks.contract'

interface ICaptureWebhookUseCaseResponse {
  id: string
}

export class CaptureWebhookUseCase {
  constructor(private readonly webhooksRepository: IWebhooksContract) {}

  public async execute(props: ICaptureWebhookProps): Promise<ICaptureWebhookUseCaseResponse> {
    const result = await this.webhooksRepository.captureWebhook(props)

    return {
      id: result[0].id,
    }
  }
}
