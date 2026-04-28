import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WebhookDetailHeader } from './webhook-detail-header'

describe('WebhookDetailHeader', () => {
  const defaultProps = {
    method: 'POST',
    pathname: '/api/users',
    ip: '192.168.1.1',
    createdAt: new Date('2024-01-15T10:30:00Z'),
  }

  it('renders method in badge', () => {
    render(<WebhookDetailHeader {...defaultProps} />)
    expect(screen.getByText('POST')).toBeInTheDocument()
  })

  it('renders pathname', () => {
    render(<WebhookDetailHeader {...defaultProps} />)
    expect(screen.getByText('/api/users')).toBeInTheDocument()
  })

  it('renders IP address', () => {
    render(<WebhookDetailHeader {...defaultProps} />)
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument()
  })

  it('renders formatted date', () => {
    render(<WebhookDetailHeader {...defaultProps} />)
    expect(screen.getByText(/\d{2}:\d{2}:\d{2} \d{2}\/\d{2}\/\d{4}/)).toBeInTheDocument()
  })

  it('renders From IP label', () => {
    render(<WebhookDetailHeader {...defaultProps} />)
    expect(screen.getByText('From IP')).toBeInTheDocument()
  })

  it('renders at label', () => {
    render(<WebhookDetailHeader {...defaultProps} />)
    expect(screen.getByText('at')).toBeInTheDocument()
  })

  it('applies correct CSS classes to container', () => {
    const { container } = render(<WebhookDetailHeader {...defaultProps} />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass(
      'space-y-3',
      'border-zinc-700',
      'border-b',
      'p-4',
      'md:space-y-4',
      'md:p-6'
    )
  })

  it('renders divider between method and pathname', () => {
    const { container } = render(<WebhookDetailHeader {...defaultProps} />)
    expect(container.firstChild?.childNodes[0]).toBeInTheDocument()
  })
})
