import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('renderiza sem quebrar', () => {
    const { container } = render(<Checkbox />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renderiza com role checkbox', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('chama onCheckedChange ao clicar', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('é unchecked por padrão', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('mostra estado checked após clicar', async () => {
    const user = userEvent.setup()
    render(<Checkbox />)

    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})