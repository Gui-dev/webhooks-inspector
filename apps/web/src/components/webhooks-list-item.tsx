import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Trash2Icon } from 'lucide-react'
import { Checkbox } from './ui/checkbox'
import { IconButton } from './ui/icon-button'

dayjs.extend(relativeTime)

interface IWebhooksListItemProps {
  webhook: {
    id: string
    method: string
    pathname: string
    createdAt: Date
  }
}

export const WebhooksListItem = ({ webhook }: IWebhooksListItemProps) => {
  const queryClient = useQueryClient()
  const { mutate: deleteWebhook } = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`http://localhost:3333/api/webhooks/${id}`, {
        method: 'DELETE',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['webhooks'],
      })
    },
  })
  return (
    <div className="group rounded-lg transition-colors duration-150 hover:bg-zinc-700/30">
      <div className="flex items-start gap-3 px-4 py-2.5">
        <Checkbox />
        <Link
          to="/webhooks/$id"
          params={{ id: webhook.id }}
          className="flex min-w-0 flex-1 items-start gap-3"
        >
          <span className="w-12 shrink-0 text-right font-semibold text-xs text-zinc-300">
            {webhook.method}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs text-zinc-200 leading-tight">
              {webhook.pathname}
            </p>
            <p className="texti-zinc-500 mt-1 font-medium text-xs">
              {dayjs(webhook.createdAt).fromNow()}
            </p>
          </div>
        </Link>
        <IconButton
          icon={<Trash2Icon className="size-3.5 text-zinc-400" />}
          className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          onClick={() => deleteWebhook(webhook.id)}
        />
      </div>
    </div>
  )
}
