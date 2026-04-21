import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { CodeBlock } from './code-block'

const mockCodeToHtml = vi.fn().mockResolvedValue('<pre><code>parsed code</code></pre>')

vi.mock('shiki', () => ({
  codeToHtml: (...args: unknown[]) => mockCodeToHtml(...args),
}))

describe('CodeBlock', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockCodeToHtml.mockResolvedValue('<pre><code>parsed code</code></pre>')
  })

  it('renders without crashing', () => {
    const { container } = render(<CodeBlock code="test code" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with default CSS classes', () => {
    const { container } = render(<CodeBlock code="test code" />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('relative', 'rounded-lg', 'border', 'border-zinc-700')
  })

  it('accepts custom className', () => {
    const { container } = render(<CodeBlock code="test" className="custom-class" />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('custom-class')
  })

  it('calls codeToHtml with default json language', async () => {
    render(<CodeBlock code='{"key": "value"}' />)

    await waitFor(() => {
      expect(mockCodeToHtml).toHaveBeenCalledWith(
        '{"key": "value"}',
        expect.objectContaining({ lang: 'json' })
      )
    })
  })

  it('accepts custom language', async () => {
    render(<CodeBlock code="const x = 1" language="javascript" />)

    await waitFor(() => {
      expect(mockCodeToHtml).toHaveBeenCalledWith(
        'const x = 1',
        expect.objectContaining({ lang: 'javascript' })
      )
    })
  })

  it('renders container even with empty code', () => {
    const { container } = render(<CodeBlock code="" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('passes additional props to container', () => {
    const { container } = render(<CodeBlock code="test" data-testid="code-block" />)
    expect(container.firstChild).toHaveAttribute('data-testid', 'code-block')
  })
})
