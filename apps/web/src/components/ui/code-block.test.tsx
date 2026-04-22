import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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

  it('renders without crashing', async () => {
    const { container } = render(<CodeBlock code="test code" />)
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  it('renders with default CSS classes', async () => {
    const { container } = render(<CodeBlock code="test code" />)
    await waitFor(() => {
      const div = container.firstChild as HTMLElement
      expect(div).toHaveClass('relative', 'rounded-lg', 'border', 'border-zinc-700')
    })
  })

  it('accepts custom className', async () => {
    const { container } = render(<CodeBlock code="test" className="custom-class" />)
    await waitFor(() => {
      const div = container.firstChild as HTMLElement
      expect(div).toHaveClass('custom-class')
    })
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

  it('renders container even with empty code', async () => {
    const { container } = render(<CodeBlock code="" />)
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  it('passes additional props to container', async () => {
    const { container } = render(<CodeBlock code="test" data-testid="code-block" />)
    await waitFor(() => {
      expect(container.firstChild).toHaveAttribute('data-testid', 'code-block')
    })
  })
})
