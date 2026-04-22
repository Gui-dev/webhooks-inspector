import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SectionDataTable } from './section-data-table'

describe('SectionDataTable', () => {
  const mockData = [
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Authorization', value: 'Bearer token123' },
  ]

  it('renders all data rows', () => {
    render(<SectionDataTable data={mockData} />)

    expect(screen.getByText('Content-Type')).toBeInTheDocument()
    expect(screen.getByText('application/json')).toBeInTheDocument()
    expect(screen.getByText('Authorization')).toBeInTheDocument()
    expect(screen.getByText('Bearer token123')).toBeInTheDocument()
  })

  it('renders keys in first column', () => {
    const { container } = render(<SectionDataTable data={mockData} />)
    const cells = container.querySelectorAll('td')
    expect(cells[0]).toHaveTextContent('Content-Type')
    expect(cells[2]).toHaveTextContent('Authorization')
  })

  it('renders values in second column', () => {
    const { container } = render(<SectionDataTable data={mockData} />)
    const cells = container.querySelectorAll('td')
    expect(cells[1]).toHaveTextContent('application/json')
    expect(cells[3]).toHaveTextContent('Bearer token123')
  })

  it('applies default CSS classes to container', () => {
    const { container } = render(<SectionDataTable data={mockData} />)
    const table = container.querySelector('table')
    expect(table?.parentElement).toHaveClass(
      'overflow-hidden',
      'rounded-lg',
      'border',
      'border-zinc-700'
    )
  })

  it('accepts custom className', () => {
    const { container } = render(<SectionDataTable data={mockData} className="custom-class" />)
    const table = container.querySelector('table')
    expect(table?.parentElement).toHaveClass('custom-class')
  })

  it('renders border between key and value cells', () => {
    const { container } = render(<SectionDataTable data={mockData} />)
    const cells = container.querySelectorAll('td')
    expect(cells[0]).toHaveClass('border-zinc-700', 'border-r')
  })

  it('renders border below rows except last', () => {
    const { container } = render(<SectionDataTable data={mockData} />)
    const rows = container.querySelectorAll('tr')
    expect(rows[0]).toHaveClass('border-zinc-700', 'border-b')
    expect(rows[1]).toHaveClass('border-zinc-700', 'border-b')
  })

  it('handles empty data array', () => {
    const { container } = render(<SectionDataTable data={[]} />)
    expect(container.querySelector('tbody')?.children.length).toBe(0)
  })

  it('renders single row data', () => {
    const singleData = [{ key: 'Host', value: 'localhost:3333' }]
    const { container } = render(<SectionDataTable data={singleData} />)
    const rows = container.querySelectorAll('tr')
    expect(rows).toHaveLength(1)
  })
})
