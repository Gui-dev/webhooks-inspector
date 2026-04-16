import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './badge'

describe('Badge', () => {
  it('renderiza o children corretamente', () => {
    render(<Badge>POST</Badge>)
    expect(screen.getByText('POST')).toBeInTheDocument()
  })

  it('aplica classes CSS padrões', () => {
    const { container } = render(<Badge>Test</Badge>)
    const span = container.firstChild as HTMLElement
    expect(span).toHaveClass('rounded-lg', 'border', 'bg-zinc-800')
  })

  it('mescla className customizada', () => {
    const { container } = render(<Badge className="custom-class">Test</Badge>)
    const span = container.firstChild as HTMLElement
    expect(span).toHaveClass('custom-class')
    expect(span).toHaveClass('rounded-lg')
  })
})
