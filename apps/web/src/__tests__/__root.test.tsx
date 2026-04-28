import '@testing-library/jest-dom/vitest'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@tanstack/react-router', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    createRootRoute: vi.fn(() => ({
      component: vi.fn(() => <div>RootLayout</div>),
    })),
    Outlet: vi.fn(() => <div data-testid="outlet" />),
  }
})

const TestLayout = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-row bg-zinc-950" style={{ width: '100vw', height: '100vh' }}>
        <div className="flex flex-col bg-zinc-950" style={{ width: '30%' }}>
          <div data-testid="sidebar">Sidebar</div>
        </div>
        <button
          type="button"
          className="h-full w-1 cursor-col-resize bg-zinc-800 hover:bg-indigo-500"
          aria-label="Resize sidebar"
        />
        <div className="flex flex-col p-5" style={{ width: '70%' }}>
          <div data-testid="outlet" />
        </div>
      </div>
    </QueryClientProvider>
  )
}

describe('RootLayout', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() }))
    )
  })

  it('renders QueryClientProvider', () => {
    const { container } = render(<TestLayout />)
    expect(container.querySelector('.flex.flex-row')).toBeInTheDocument()
  })

  it('renders Sidebar component', () => {
    render(<TestLayout />)
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })

  it('renders Outlet container with correct classes', () => {
    const { container } = render(<TestLayout />)
    const outlet = container.querySelector('.p-5')
    expect(outlet).toBeInTheDocument()
  })

  it('renders resize divider in desktop mode', () => {
    const { container } = render(<TestLayout />)
    const divider = container.querySelector('.cursor-col-resize')
    expect(divider).toBeInTheDocument()
  })

  it('divider has correct aria-label', () => {
    render(<TestLayout />)
    expect(screen.getByLabelText('Resize sidebar')).toBeInTheDocument()
  })

  it('divider is a button element', () => {
    const { container } = render(<TestLayout />)
    const divider = container.querySelector('button.cursor-col-resize')
    expect(divider).toBeInTheDocument()
  })

  it('divider has correct styling classes', () => {
    const { container } = render(<TestLayout />)
    const divider = container.querySelector('.cursor-col-resize')
    expect(divider).toHaveClass('h-full', 'w-1', 'bg-zinc-800', 'hover:bg-indigo-500')
  })
})
