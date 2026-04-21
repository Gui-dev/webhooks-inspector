import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-bold text-lg text-zinc-200">No webhooks selected</h2>
        <p className="max-w-md text-sm text-zinc-400">Select a webhook to get started</p>
      </div>
    </div>
  )
}
