import { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface IWebhookDetailsSkeletonProps extends ComponentProps<'div'> {}

const SkeletonTable = ({ rows = 4 }: { rows?: number }) => {
  const keys = Array.from({ length: rows }, (_, i) => `sk-table-row-${i}`)
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-700">
      <table className="w-full">
        <tbody className="w-full">
          {keys.map(key => (
            <tr key={key} className="border-zinc-700 border-b last:border-0">
              <td className="border-zinc-700 border-r bg-zinc-800/50 p-3">
                <div className="h-4 w-24 animate-pulse rounded bg-zinc-800/50" />
              </td>
              <td className="p-3">
                <div className="h-4 w-32 animate-pulse rounded bg-zinc-800/50" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const WebhookDetailsSkeleton = ({ className, ...props }: IWebhookDetailsSkeletonProps) => {
  return (
    <div className={twMerge('flex h-full flex-col', className)} {...props}>
      <div className="space-y-4 border-zinc-700 border-b p-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-14 animate-pulse rounded bg-zinc-800/50" />
          <div className="h-6 w-40 animate-pulse rounded bg-zinc-800/50" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 animate-pulse rounded bg-zinc-800/50" />
          <div className="h-4 w-28 animate-pulse rounded bg-zinc-800/50" />
          <div className="h-4 w-px bg-zinc-700" />
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-800/50" />
          <div className="h-4 w-32 animate-pulse rounded bg-zinc-800/50" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-6">
          <div className="space-y-4">
            <div className="h-5 w-36 animate-pulse rounded bg-zinc-800/50" />
            <SkeletonTable rows={4} />
          </div>

          <div className="space-y-4">
            <div className="h-5 w-20 animate-pulse rounded bg-zinc-800/50" />
            <SkeletonTable rows={5} />
          </div>

          <div className="space-y-4">
            <div className="h-5 w-28 animate-pulse rounded bg-zinc-800/50" />
            <div className="h-32 w-full animate-pulse rounded-lg border border-zinc-700 bg-zinc-800/50" />
          </div>
        </div>
      </div>
    </div>
  )
}
