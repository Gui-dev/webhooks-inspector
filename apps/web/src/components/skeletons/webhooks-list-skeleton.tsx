import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface IWebhooksListSkeletonProps extends ComponentProps<'div'> {}
const SKELETON_KEYS = [
  'sk-list-1',
  'sk-list-2',
  'sk-list-3',
  'sk-list-4',
  'sk-list-5',
  'sk-list-6',
  'sk-list-7',
  'sk-list-8',
  'sk-list-9',
  'sk-list-10',
] as const

export const WebhooksListSkeleton = ({ className, ...props }: IWebhooksListSkeletonProps) => {
  return (
    <div
      className={twMerge('flex h-full flex-col', className)}
      data-testid="webhooks-skeleton"
      {...props}
    >
      <div className="flex h-full animate-pulse flex-col gap-4 p-6">
        {SKELETON_KEYS.map(key => (
          <div key={key} className="flex items-center gap-4">
            <div className="h-6 w-6 animate-pulse rounded bg-zinc-800/50" />
            <div className="flex min-w-0 flex-1 animate-pulse flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="h-5 w-12 animate-pulse rounded bg-zinc-800/50" />
                <div className="h-5 min-w-0 flex-1 animate-pulse rounded bg-zinc-800/50" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-24 animate-pulse rounded bg-zinc-800/50" />
                <div className="h-4 w-32 animate-pulse rounded bg-zinc-800/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
