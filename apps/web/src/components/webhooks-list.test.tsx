import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WebhooksList } from './webhooks-list'

const renderWithQuery = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('WebhooksList', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn(),
      }))
    )
  })

  it('renders container with correct classes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            webhooks: [],
            nextCursor: null,
          }),
      })
    )

    const { container } = renderWithQuery(<WebhooksList />)

    await waitFor(() => {
      expect(container.firstChild).toHaveClass('flex-1', 'overflow-y-auto')
    })
  })

  it('fetches correct endpoint', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          webhooks: [],
          nextCursor: null,
        }),
    })
    vi.stubGlobal('fetch', fetchSpy)

    renderWithQuery(<WebhooksList />)

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled()
      const calledUrl = fetchSpy.mock.calls[0][0] as URL
      expect(calledUrl.pathname).toBe('/api/webhooks')
    })
  })
})
