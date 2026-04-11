import { Badge } from './ui/badge'

export const WebhookDetailHeader = () => {
  return (
    <div className="space-y-4 border-zinc-700 border-b p-6">
      <div className="flex items-center gap-3">
        <Badge>POST</Badge>
        <span className="font-medium text-lg text-zinc-300">/videos/status</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <span className="">From IP</span>
          <span className="font-mono underline underline-offset-4">38.0.101.76</span>
        </div>
        <span className="h-4 w-px bg-zinc-700" />
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span>at</span>
          <span>April 11th, 16pm</span>
        </div>
      </div>
    </div>
  )
}
