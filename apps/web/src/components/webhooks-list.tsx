import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { webhookListSchema } from '../http/schemas/webhook'
import { WebhooksListItem } from './webhooks-list-item'

export const WebhooksList = () => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver>(null)
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['webhooks'],
    queryFn: async ({ pageParam }) => {
      const url = new URL('http://localhost:3333/api/webhooks')

      if (pageParam) {
        url.searchParams.set('cursor', pageParam)
      }
      const response = await fetch(url)
      const data = await response.json()

      return webhookListSchema.parse(data)
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  })

  const webhooks = data.pages.flatMap(page => page.webhooks)

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect()
    }

    observer.current = new IntersectionObserver(
      entries => {
        const entry = entries[0]

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        threshold: 0.1,
      }
    )

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage])

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-1 p-2">
        {webhooks.map(webhook => {
          return <WebhooksListItem key={webhook.id} webhook={webhook} />
        })}
      </div>

      {hasNextPage && (
        <div className="p-2" ref={loadMoreRef}>
          {!isFetchingNextPage && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="size-5 animate-spin text-zinc-500" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
