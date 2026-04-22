import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WebhookDetailsSkeleton } from './webhook-details-skeleton'

describe('WebhookDetailsSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<WebhookDetailsSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies flex column layout', () => {
    const { container } = render(<WebhookDetailsSkeleton />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass('flex', 'h-full', 'flex-col')
  })

  it('accepts custom className', () => {
    const { container } = render(<WebhookDetailsSkeleton className="custom-class" />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass('custom-class')
  })

  it('renders with animation', () => {
    const { container } = render(<WebhookDetailsSkeleton />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('renders skeleton header section', () => {
    const { container } = render(<WebhookDetailsSkeleton />)
    const header = container.querySelector('.space-y-4')
    expect(header).toBeInTheDocument()
  })

  it('renders table skeleton rows', () => {
    const { container } = render(<WebhookDetailsSkeleton />)
    const tables = container.querySelectorAll('table')
    expect(tables.length).toBeGreaterThan(0)
  })

  it('renders badge placeholder', () => {
    const { container } = render(<WebhookDetailsSkeleton />)
    const badge = container.querySelector('.h-6.w-14')
    expect(badge).toBeInTheDocument()
  })

  it('renders code block placeholder', () => {
    const { container } = render(<WebhookDetailsSkeleton />)
    const codeBlock = container.querySelector('.h-32')
    expect(codeBlock).toBeInTheDocument()
  })
})
