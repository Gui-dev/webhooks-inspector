import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Group, Panel, Separator } from 'react-resizable-panels'

import { Sidebar } from '../components/sidebar'

const queryClient = new QueryClient()

const RootLayout = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <div className="h-screen bg-zinc-950">
        <Group orientation="horizontal">
          <Panel defaultSize="20%" minSize="15%" maxSize="40%">
            <Sidebar />
          </Panel>
          <Separator className="w-px bg-zinc-800" />
          <Panel defaultSize="80%" minSize="60%" className="p-5">
            <Outlet />
          </Panel>
        </Group>
      </div>
    </QueryClientProvider>
  </>
)

export const Route = createRootRoute({ component: RootLayout })
