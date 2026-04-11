import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface IBadgeProps extends ComponentProps<'span'> {}

export const Badge = ({ className, ...props }: IBadgeProps) => {
  return (
    <span
      className={twMerge(
        'rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-1 font-mono font-semibold text-xs text-zinc-100',
        className
      )}
      {...props}
    />
  )
}
