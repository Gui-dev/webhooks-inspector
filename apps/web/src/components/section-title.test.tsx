import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SectionTitle } from './section-title'

describe('SectionTitle', () => {
  it('renderiza children como título', () => {
    render(<SectionTitle>Meu Título</SectionTitle>)
    expect(screen.getByText('Meu Título')).toBeInTheDocument()
  })

  it('renderiza como elemento h3', () => {
    const { container } = render(<SectionTitle>Test</SectionTitle>)
    expect(container.querySelector('h3')).toBeInTheDocument()
  })

  it('aplica classes CSS padrões', () => {
    const { container } = render(<SectionTitle>Test</SectionTitle>)
    const h3 = container.querySelector('h3')
    expect(h3).toHaveClass('font-semibold', 'text-base', 'text-zinc-100')
  })

  it('mescla className customizada', () => {
    const { container } = render(<SectionTitle className="custom">Test</SectionTitle>)
    const h3 = container.querySelector('h3')
    expect(h3).toHaveClass('custom')
  })
})