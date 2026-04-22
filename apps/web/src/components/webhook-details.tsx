import { useSuspenseQuery } from '@tanstack/react-query'
import { webhookDetailsSchema } from '../http/schemas/webhook'
import { SectionDataTable } from './section-data-table'
import { SectionTitle } from './section-title'
import { CodeBlock } from './ui/code-block'
import { WebhookDetailHeader } from './webhook-detail-header'

interface IWebhookDetailsProps {
  id: string
}

export const WebhookDetails = ({ id }: IWebhookDetailsProps) => {
  const { data } = useSuspenseQuery({
    queryKey: ['webhooks', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/api/webhooks/${id}`)
      const data = await response.json()

      return webhookDetailsSchema.parse(data)
    },
  })

  const overviewData = [
    { key: 'Method', value: data.method },
    { key: 'Status Code', value: data.statusCode.toString() },
    { key: 'Content Type', value: data.contentType || 'application/json' },
    { key: 'Content Length', value: `${data.contentLength || 0} bytes` },
  ]
  const headers = Object.entries(data.headers).map(([key, value]) => {
    return { key, value: String(value) }
  })

  const queryParams = Object.entries(data.queryParams || {}).map(([key, value]) => {
    return { key, value: String(value) }
  })

  return (
    <div className="flex h-full flex-col" data-testid="webhook-details">
      <WebhookDetailHeader
        method={data.method}
        pathname={data.pathname}
        ip={data.ip}
        createdAt={data.createdAt}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-6">
          <div className="space-y-4">
            <SectionTitle>Request Overview</SectionTitle>
            <SectionDataTable data={overviewData} />
          </div>

          <div className="space-y-4">
            <SectionTitle>Headers</SectionTitle>
            <SectionDataTable data={headers} />
          </div>

          {queryParams.length > 0 && (
            <div className="space-y-4">
              <SectionTitle>Query Params</SectionTitle>
              <SectionDataTable data={queryParams} />
            </div>
          )}

          {!!data.body && (
            <div className="space-y-4">
              <SectionTitle>Body</SectionTitle>
              <CodeBlock code={data.body} />
            </div>
          )}

          <div></div>
        </div>
      </div>
    </div>
  )
}
