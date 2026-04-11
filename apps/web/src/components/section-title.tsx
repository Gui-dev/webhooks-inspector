import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface SectionTitleProps extends ComponentProps<'h3'> {}

export const SectionTitle = ({ className, ...props }: SectionTitleProps) => {
  return <h3 className={twMerge('font-semibold text-base text-zinc-100', className)} {...props} />
}
