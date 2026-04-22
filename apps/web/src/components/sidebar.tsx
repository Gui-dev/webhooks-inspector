import { Copy } from 'lucide-react'
import { Suspense } from 'react'
import { WebhooksListSkeleton } from './skeletons'
import { IconButton } from './ui/icon-button'
import { WebhooksList } from './webhooks-list'

export const Sidebar = () => {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-zinc-700 border-b px-4 py-5">
        <div className="flex items-center justify-center">
          <img src="/logo.png" alt="logo" className="w-full" />
        </div>
      </div>

      <div className="flex items-center gap-2 border-zinc-700 border-b bg-zinc-800 px-4 py-5">
        <div className="flex min-w-0 flex-1 items-center gap-1 font-mono text-xs text-zinc-300">
          <span className="truncate">http://localhost:3333/capture</span>
        </div>
        <IconButton icon={<Copy className="size-4" />} />
      </div>

      <Suspense fallback={<WebhooksListSkeleton />}>
        <WebhooksList />
      </Suspense>
    </div>
  )
}
