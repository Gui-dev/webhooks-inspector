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
    <div className="space-y-3 border-zinc-700 border-b p-4 md:space-y-4 md:p-6">
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <Badge data-testid="webhook-method">{method}</Badge>
        <span
          className="font-medium text-base text-zinc-300 md:text-lg"
          data-testid="webhook-pathname"
        >
          {pathname}
        </span>
      </div>
      <div className="flex flex-col gap-1 text-xs text-zinc-400 md:flex-row md:items-center md:gap-2 md:text-sm">
        <div className="flex items-center gap-1">
          <span className="">From IP</span>
          <span className="font-mono underline underline-offset-4" data-testid="webhook-ip">
            {ip}
          </span>
        </div>
        <span className="hidden h-4 w-px bg-zinc-700 md:block" />
        <div className="flex items-center gap-2">
          <span>at</span>
          <span>{dayjs(createdAt).format('HH:mm:ss DD/MM/YYYY')}</span>
        </div>
      </div>
    </div>
  )
}
