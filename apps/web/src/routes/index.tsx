import { createFileRoute } from '@tanstack/react-router'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { SectionTitle } from '../components/section-title'
import { Sidebar } from '../components/sidebar'
import { WebhookDetailHeader } from '../components/webhook-detail-header'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const _overviewData = [
    { key: 'Method', value: 'POST' },
    { key: 'Status Code', value: '200' },
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Content-Length', value: '23456 bytes' },
  ]

  return (
    <div className="h-screen bg-zinc-950">
      <Group orientation="horizontal">
        <Panel defaultSize="20%" minSize="15%" maxSize="40%">
          <Sidebar />
        </Panel>
        <Separator className="w-px bg-zinc-800" />
        <Panel defaultSize="80%" minSize="60%" className="p-5">
          <div className="flex h-full flex-col">
            <WebhookDetailHeader />
            <div className="flex overflow-y-auto">
              <div className="space--y-4 p-6">
                <div className="space-y-4">
                  <SectionTitle>Request Overview</SectionTitle>
                </div>

                <div></div>
              </div>
            </div>
          </div>
        </Panel>
      </Group>
    </div>
  )
}
