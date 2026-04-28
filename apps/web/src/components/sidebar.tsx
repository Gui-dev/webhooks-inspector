import { Copy } from 'lucide-react'
import { Suspense } from 'react'
import { WebhooksListSkeleton } from './skeletons'
import { IconButton } from './ui/icon-button'
import { Logo } from './ui/logo'
import { WebhooksList } from './webhooks-list'

export const Sidebar = () => {
  return (
    <div className="flex h-full flex-col bg-zinc-950">
      <div className="flex items-center justify-center border-zinc-700 border-b px-3 py-3 md:px-4 md:py-5">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
      </div>

      <div className="flex items-center gap-2 border-zinc-700 border-b bg-zinc-800 px-3 py-3 md:px-4 md:py-5">
        <div className="flex min-w-0 flex-1 items-center gap-1 font-mono text-xs text-zinc-300">
          <span className="truncate text-[10px] md:text-xs">http://localhost:3333/capture</span>
        </div>
        <IconButton icon={<Copy className="size-3 md:size-4" />} aria-label="Copy URL" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={<WebhooksListSkeleton />}>
          <WebhooksList />
        </Suspense>
      </div>
    </div>
  )
}
