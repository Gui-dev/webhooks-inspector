import type { ComponentProps, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const iconButton = tv({
  base: 'flex items-center justify-center rounded-lg hover:bg-zinc-700 transition-colors duration-150 cursor-pointer',
  variants: {
    size: {
      sm: 'size-6',
      md: 'size-8',
      lg: 'size-10',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface IIconButtonProps extends ComponentProps<'button'>, VariantProps<typeof iconButton> {
  icon: ReactNode
}

export const IconButton = ({ icon, size, className, ...props }: IIconButtonProps) => {
  return (
    <button type="button" className={iconButton({ size, className })} {...props}>
      {icon}
    </button>
  )
}
