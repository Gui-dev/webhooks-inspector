import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WebhookDetails } from './webhook-details'

const mockWebhookData = {
  id: '0192de10-d163-7000-9380-9f6c6b5d4a3b',
  ip: '192.168.1.1',
  statusCode: 200,
  method: 'POST',
  pathname: '/api/users',
  body: '{"name": "John", "email": "john@example.com"}',
  contentType: 'application/json',
  contentLength: 46,
  queryParams: { page: '1', limit: '10' },
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer token',
  },
  createdAt: '2024-01-15T10:30:00.000Z',
}

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const renderWithQuery = (ui: React.ReactElement) => {
  const queryClient = createQueryClient()
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('WebhookDetails', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders loading state then shows data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockWebhookData),
      })
    )

    renderWithQuery(<WebhookDetails id={mockWebhookData.id} />)

    await waitFor(() => {
      expect(screen.getAllByText('POST').length).toBeGreaterThan(0)
      expect(screen.getByText('/api/users')).toBeInTheDocument()
    })
  })

  it('displays overview data correctly', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockWebhookData),
      })
    )

    renderWithQuery(<WebhookDetails id={mockWebhookData.id} />)

    await waitFor(() => {
      expect(screen.getByText('Status Code')).toBeInTheDocument()
      expect(screen.getByText('200')).toBeInTheDocument()
    })
  })

  it('displays headers correctly', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockWebhookData),
      })
    )

    renderWithQuery(<WebhookDetails id={mockWebhookData.id} />)

    await waitFor(() => {
      expect(screen.getByText('Headers')).toBeInTheDocument()
      expect(screen.getByText('Content-Type')).toBeInTheDocument()
    })
  })

  it('displays query params when present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockWebhookData),
      })
    )

    renderWithQuery(<WebhookDetails id={mockWebhookData.id} />)

    await waitFor(() => {
      expect(screen.getByText('Query Params')).toBeInTheDocument()
    })
  })

  it('displays body when present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockWebhookData),
      })
    )

    renderWithQuery(<WebhookDetails id={mockWebhookData.id} />)

    await waitFor(() => {
      expect(screen.getByText('Body')).toBeInTheDocument()
    })
  })

  it('does not display query params when absent', async () => {
    const dataWithoutQueryParams = {
      ...mockWebhookData,
      queryParams: null,
    }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(dataWithoutQueryParams),
      })
    )

    renderWithQuery(<WebhookDetails id={mockWebhookData.id} />)

    await waitFor(() => {
      expect(screen.queryByText('Query Params')).not.toBeInTheDocument()
    })
  })

  it('does not display body when absent', async () => {
    const dataWithoutBody = {
      ...mockWebhookData,
      body: null,
    }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(dataWithoutBody),
      })
    )

    renderWithQuery(<WebhookDetails id={mockWebhookData.id} />)

    await waitFor(() => {
      expect(screen.queryByText('Body')).not.toBeInTheDocument()
    })
  })
})
