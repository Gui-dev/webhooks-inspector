import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './badge'

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>POST</Badge>)
    expect(screen.getByText('POST')).toBeInTheDocument()
  })

  it('applies default CSS classes', () => {
    const { container } = render(<Badge>Test</Badge>)
    const span = container.firstChild as HTMLElement
    expect(span).toHaveClass('rounded-lg', 'border', 'bg-zinc-800')
  })

  it('merges custom className', () => {
    const { container } = render(<Badge className="custom-class">Test</Badge>)
    const span = container.firstChild as HTMLElement
    expect(span).toHaveClass('custom-class')
    expect(span).toHaveClass('rounded-lg')
  })
})
