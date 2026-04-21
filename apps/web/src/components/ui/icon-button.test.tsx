import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Trash2 } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import { IconButton } from './icon-button'

describe('IconButton', () => {
  it('renders provided icon', () => {
    render(<IconButton icon={<Trash2 data-testid="icon" />} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('applies small size variant', () => {
    const { container } = render(<IconButton icon={<Trash2 />} size="sm" />)
    const button = container.querySelector('button')
    expect(button).toHaveClass('size-6')
  })

  it('applies large size variant', () => {
    const { container } = render(<IconButton icon={<Trash2 />} size="lg" />)
    const button = container.querySelector('button')
    expect(button).toHaveClass('size-10')
  })

  it('triggers onClick on click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<IconButton icon={<Trash2 />} onClick={onClick} />)

    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })

  it('has default button type', () => {
    const { container } = render(<IconButton icon={<Trash2 />} />)
    const button = container.querySelector('button')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('applies medium size by default', () => {
    const { container } = render(<IconButton icon={<Trash2 />} />)
    const button = container.querySelector('button')
    expect(button).toHaveClass('size-8')
  })
})
