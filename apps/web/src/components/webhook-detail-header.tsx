import dayjs from 'dayjs'
import { Badge } from './ui/badge'

interface IWebhookDetailHeaderProps {
  method: string
  pathname: string
  ip: string
  createdAt: Date
}

export const WebhookDetailHeader = ({
  method,
  pathname,
  ip,
  createdAt,
}: IWebhookDetailHeaderProps) => {
  return (
    <div className="space-y-4 border-zinc-700 border-b p-6">
      <div className="flex items-center gap-3">
        <Badge>{method}</Badge>
        <span className="font-medium text-lg text-zinc-300">{pathname}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <span className="">From IP</span>
          <span className="font-mono underline underline-offset-4">{ip}</span>
        </div>
        <span className="h-4 w-px bg-zinc-700" />
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span>at</span>
          <span>{dayjs(createdAt).format('HH:mm:ss DD/MM/YYYY')}</span>
        </div>
      </div>
    </div>
  )
}
