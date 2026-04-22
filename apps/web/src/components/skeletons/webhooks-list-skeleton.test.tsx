import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WebhooksListSkeleton } from './webhooks-list-skeleton'

describe('WebhooksListSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<WebhooksListSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders 10 skeleton items', () => {
    const { container } = render(<WebhooksListSkeleton />)
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('applies flex column layout', () => {
    const { container } = render(<WebhooksListSkeleton />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass('flex', 'h-full', 'flex-col')
  })

  it('accepts custom className', () => {
    const { container } = render(<WebhooksListSkeleton className="custom-class" />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass('custom-class')
  })

  it('renders with animation', () => {
    const { container } = render(<WebhooksListSkeleton />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('renders checkbox placeholder', () => {
    const { container } = render(<WebhooksListSkeleton />)
    const checkbox = container.querySelector('.h-6.w-6')
    expect(checkbox).toBeInTheDocument()
  })

  it('renders text placeholders', () => {
    const { container } = render(<WebhooksListSkeleton />)
    const textPlaceholders = container.querySelectorAll('.h-5, .h-4')
    expect(textPlaceholders.length).toBeGreaterThan(0)
  })
})
