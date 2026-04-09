import { createFileRoute } from '@tanstack/react-router'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { Sidebar } from '../components/sidebar'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="h-screen bg-zinc-950">
      <Group orientation="horizontal">
        <Panel defaultSize="20%" minSize="15%" maxSize="40%">
          <Sidebar />
        </Panel>
        <Separator className="w-px bg-zinc-800" />
        <Panel defaultSize="80%" minSize="60%" className="p-5">
          Editor
        </Panel>
      </Group>
    </div>
  )
}
