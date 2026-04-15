import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface IScetionDataTableProps extends ComponentProps<'div'> {
  data: Array<{ key: string; value: string }>
}

export const SectionDataTable = ({ data, className, ...props }: IScetionDataTableProps) => {
  return (
    <div
      className={twMerge('overflow-hidden rounded-lg border border-zinc-700', className)}
      {...props}
    >
      <table className="w-full">
        <tbody className="w-full">
          {data.map(({ key, value }) => (
            <tr key={key} className="border-zinc-700 border-b last:border-0">
              <td className="border-zinc-700 border-r bg-zinc-800/50 p-3 font-medium text-sm text-zinc-400">
                {key}
              </td>
              <td className="p-3 font-mono text-sm text-zinc-300">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
