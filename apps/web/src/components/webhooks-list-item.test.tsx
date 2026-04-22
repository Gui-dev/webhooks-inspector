import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WebhooksListItem } from './webhooks-list-item'

vi.mock('@tanstack/react-router', () => ({
  Link: vi.fn(({ children, to, params }) => (
    <a href={`/${to.replace('$id', params.id)}`}>{children}</a>
  )),
}))

const renderWithQuery = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('WebhooksListItem', () => {
  const mockWebhook = {
    id: '0192de10-d163-7000-9380-9f6c6b5d4a3b',
    method: 'POST',
    pathname: '/api/users',
    createdAt: new Date('2024-01-15T10:30:00Z'),
  }

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

  it('renders webhook method', () => {
    renderWithQuery(<WebhooksListItem webhook={mockWebhook} />)
    expect(screen.getByText('POST')).toBeInTheDocument()
  })

  it('renders webhook pathname', () => {
    renderWithQuery(<WebhooksListItem webhook={mockWebhook} />)
    expect(screen.getByText('/api/users')).toBeInTheDocument()
  })

  it('renders relative time for createdAt', () => {
    renderWithQuery(<WebhooksListItem webhook={mockWebhook} />)
    expect(screen.getByText(/\d+\s+(year|month|day|hour|minute)/)).toBeInTheDocument()
  })

  it('renders delete button', () => {
    renderWithQuery(<WebhooksListItem webhook={mockWebhook} />)
    const deleteButton = screen.getByRole('button')
    expect(deleteButton).toBeInTheDocument()
  })

  it('delete button has Trash2Icon', () => {
    renderWithQuery(<WebhooksListItem webhook={mockWebhook} />)
    const deleteButton = screen.getByRole('button')
    expect(deleteButton.querySelector('svg')).toBeInTheDocument()
  })

  it('renders link to webhook details', () => {
    renderWithQuery(<WebhooksListItem webhook={mockWebhook} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toMatch(new RegExp(`webhooks/${mockWebhook.id}`))
  })

  it('renders checkbox', () => {
    renderWithQuery(<WebhooksListItem webhook={mockWebhook} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('applies hover group styling', () => {
    const { container } = renderWithQuery(<WebhooksListItem webhook={mockWebhook} />)
    const wrapper = container.querySelector('.group')
    expect(wrapper).toBeInTheDocument()
  })

  it('calls delete API on delete click', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })
    )

    renderWithQuery(<WebhooksListItem webhook={mockWebhook} />)

    const deleteButton = screen.getByRole('button')
    await user.click(deleteButton)

    await waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        `http://localhost:3333/api/webhooks/${mockWebhook.id}`,
        expect.objectContaining({ method: 'DELETE' })
      )
    })
  })
})
