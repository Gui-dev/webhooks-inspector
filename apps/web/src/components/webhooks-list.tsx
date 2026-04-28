import * as Dialog from '@radix-ui/react-dialog'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Loader2, Wand2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { webhookListSchema } from '../http/schemas/webhook'
import { CodeBlock } from './ui/code-block'
import { WebhooksListItem } from './webhooks-list-item'

export const WebhooksList = () => {
  const [generateHandlerCode, setGenerateHandlerCode] = useState<string | null>(null)
  const [checkedWebhooksIds, setCheckedWebhooksIds] = useState<string[]>([])
  const [isGenerateHandlerLoading, setIsGenerateHandlerLoading] = useState(false)
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

  const handleCheckWebhook = (webhookId: string) => {
    if (checkedWebhooksIds.includes(webhookId)) {
      setCheckedWebhooksIds(state => {
        return state.filter(id => id !== webhookId)
      })
    } else {
      setCheckedWebhooksIds(state => [...state, webhookId])
    }
  }

  const handleGenerateHandler = async () => {
    try {
      setIsGenerateHandlerLoading(true)
      const result = await fetch('http://localhost:3333/api/generate', {
        method: 'POST',
        body: JSON.stringify({ webhooksIds: checkedWebhooksIds }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const { code } = await result.json()

      setGenerateHandlerCode(code)
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerateHandlerLoading(false)
    }
  }

  console.log('generateHandlerCode', generateHandlerCode)

  const hasAnyWebhookChecked = checkedWebhooksIds.length > 0

  return (
    <>
      <div className="relative flex-1 overflow-y-auto" data-testid="webhooks-list">
        <div className="space-y-1 p-2">
          {webhooks.map(webhook => {
            return (
              <WebhooksListItem
                key={webhook.id}
                webhook={webhook}
                onWebhookChecked={handleCheckWebhook}
                isWebhookChecked={checkedWebhooksIds.includes(webhook.id)}
              />
            )
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

        {hasAnyWebhookChecked && (
          <div className="fixed right-auto bottom-3 left-auto px-3">
            <button
              type="button"
              className="flex h-8 cursor-pointer items-center justify-center gap-1 rounded-full bg-indigo-600 text-white sm:w-full lg:w-96 lg:min-w-80 lg:max-w-96"
              onClick={handleGenerateHandler}
            >
              {isGenerateHandlerLoading && <Loader2 className="size-4 animate-spin" />}
              {!isGenerateHandlerLoading && (
                <>
                  <Wand2 className="size-4" /> <span>Gerar Handler</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {generateHandlerCode && (
        <Dialog.Root defaultOpen>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed top-1/2 left-1/2 flex max-h-[85vh] w-[90vw] max-w-125 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 rounded-md bg-gray1 p-6.25 shadow-[--shadow-6] focus:outline-none data-[state=open]:animate-contentShow">
              <Dialog.Title className="font-bold font-mono text-2xl text-zinc-200">
                Handler gerado com sucesso!
              </Dialog.Title>
              <div className="max-h-140 w-150 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 p-4">
                <CodeBlock code={generateHandlerCode} />
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </>
  )
}
