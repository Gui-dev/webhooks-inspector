import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SectionTitle } from './section-title'

describe('SectionTitle', () => {
  it('renders children as title', () => {
    render(<SectionTitle>My Title</SectionTitle>)
    expect(screen.getByText('My Title')).toBeInTheDocument()
  })

  it('renders as h3 element', () => {
    const { container } = render(<SectionTitle>Test</SectionTitle>)
    expect(container.querySelector('h3')).toBeInTheDocument()
  })

  it('applies default CSS classes', () => {
    const { container } = render(<SectionTitle>Test</SectionTitle>)
    const h3 = container.querySelector('h3')
    expect(h3).toHaveClass('font-semibold', 'text-base', 'text-zinc-100')
  })

  it('merges custom className', () => {
    const { container } = render(<SectionTitle className="custom">Test</SectionTitle>)
    const h3 = container.querySelector('h3')
    expect(h3).toHaveClass('custom')
  })
})
