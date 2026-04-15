import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IconButton } from './icon-button'
import { Trash2 } from 'lucide-react'

describe('IconButton', () => {
  it('renderiza o ícone fornecido', () => {
    render(<IconButton icon={<Trash2 data-testid="icon" />} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('aplica variante de tamanho small', () => {
    const { container } = render(<IconButton icon={<Trash2 />} size="sm" />)
    const button = container.querySelector('button')
    expect(button).toHaveClass('size-6')
  })

  it('aplica variante de tamanho large', () => {
    const { container } = render(<IconButton icon={<Trash2 />} size="lg" />)
    const button = container.querySelector('button')
    expect(button).toHaveClass('size-10')
  })

  it('dispara onClick ao clicar', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<IconButton icon={<Trash2 />} onClick={onClick} />)

    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })

  it('tem tipo button padrão', () => {
    const { container } = render(<IconButton icon={<Trash2 />} />)
    const button = container.querySelector('button')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('aplica tamanho médio por padrão', () => {
    const { container } = render(<IconButton icon={<Trash2 />} />)
    const button = container.querySelector('button')
    expect(button).toHaveClass('size-8')
  })
})