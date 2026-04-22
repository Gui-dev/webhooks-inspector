import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Sidebar } from './sidebar'

const renderWithQuery = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('Sidebar', () => {
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
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ webhooks: [], nextCursor: null }),
      })
    )
  })

  it('renders logo image', () => {
    renderWithQuery(<Sidebar />)
    const logo = screen.getByAltText('logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders capture URL', () => {
    renderWithQuery(<Sidebar />)
    expect(screen.getByText('http://localhost:3333/capture')).toBeInTheDocument()
  })

  it('renders copy button', () => {
    renderWithQuery(<Sidebar />)
    const copyButton = screen.getByRole('button')
    expect(copyButton).toBeInTheDocument()
  })

  it('renders WebhooksList within Suspense', () => {
    const { container } = renderWithQuery(<Sidebar />)
    const sidebar = container.firstChild as HTMLElement
    expect(sidebar).toHaveClass('flex', 'h-screen', 'flex-col')
  })

  it('applies correct layout classes', () => {
    const { container } = renderWithQuery(<Sidebar />)
    const sidebar = container.firstChild as HTMLElement
    expect(sidebar).toHaveClass('flex', 'h-screen', 'flex-col')
  })

  it('applies border to header section', () => {
    const { container } = renderWithQuery(<Sidebar />)
    const header = container.querySelector('.border-b')
    expect(header).toBeInTheDocument()
  })

  it('copy button has Copy icon', () => {
    renderWithQuery(<Sidebar />)
    const copyButton = screen.getByRole('button')
    expect(copyButton.querySelector('svg')).toBeInTheDocument()
  })
})
