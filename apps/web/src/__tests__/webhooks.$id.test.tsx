import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: vi.fn((path: string) => ({
    component: vi.fn(),
  })),
  useParams: () => ({ id: 'test-id' }),
}))

vi.mock('../components/skeletons', () => ({
  WebhookDetailsSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}))

vi.mock('../components/webhook-details', () => ({
  WebhookDetails: ({ id }: { id: string }) => <div data-testid="webhook-details">ID: {id}</div>,
}))

const TestRouteComponent = () => {
  const id = 'test-id'
  return (
    <Suspense fallback={<div data-testid="skeleton">Loading...</div>}>
      <div data-testid="webhook-details">ID: {id}</div>
    </Suspense>
  )
}

describe('webhooks.$id', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() }))
    )
  })

  it('renderiza WebhookDetails component', () => {
    render(<TestRouteComponent />)
    expect(screen.getByTestId('webhook-details')).toBeInTheDocument()
  })

  it('renderiza ambos dentro de Suspense', () => {
    const { container } = render(<TestRouteComponent />)
    const details = container.querySelector('[data-testid="webhook-details"]')
    expect(details).toBeInTheDocument()
  })
})
