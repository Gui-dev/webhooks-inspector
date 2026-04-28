import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface ISectionDataTableProps extends ComponentProps<'div'> {
  data: Array<{ key: string; value: string }>
}

export const SectionDataTable = ({ data, className, ...props }: ISectionDataTableProps) => {
  return (
    <div
      className={twMerge('overflow-x-auto rounded-lg border border-zinc-700', className)}
      {...props}
    >
      <table className="w-full min-w-[500px]">
        <tbody className="w-full">
          {data.map(({ key, value }) => (
            <tr key={key} className="border-zinc-700 border-b last:border-0">
              <td className="border-zinc-700 border-r bg-zinc-800/50 p-2 font-medium text-sm text-zinc-400 md:p-3">
                {key}
              </td>
              <td className="p-2 font-mono text-xs text-zinc-300 md:p-3 md:text-sm">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
