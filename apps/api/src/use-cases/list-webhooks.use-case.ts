import type {
  IListWebhooksParams,
  IListWebhooksResponse,
  IWebhooksContract,
} from '@/contracts/webhooks.contract'

interface IListWebhooksUseCaseResponse {
  items: IListWebhooksResponse[]
  nextCursor: string | null
}

export class ListWebhooksUseCase {
  constructor(private readonly webhooksRepository: IWebhooksContract) {}

  public async execute({
    limit,
    cursor,
  }: IListWebhooksParams): Promise<IListWebhooksUseCaseResponse> {
    const result = await this.webhooksRepository.listWebhooks({ limit, cursor })
    const hasMore = result.length > limit
    const items = hasMore ? result.slice(0, limit) : result
    const nextCursor = hasMore ? result[result.length - 1].id : null

    return { items, nextCursor }
  }
}
