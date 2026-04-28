import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Sidebar } from '../components/sidebar'

const queryClient = new QueryClient()

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

const ResizableDivider = ({ onResize }: { onResize: (deltaPercent: number) => void }) => {
  const isDragging = useRef(false)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      isDragging.current = true
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDragging.current) return
        const deltaX = moveEvent.movementX
        const deltaPercent = (deltaX / window.innerWidth) * 100
        onResize(deltaPercent)
      }

      const handleMouseUp = () => {
        isDragging.current = false
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [onResize]
  )

  return (
    <button
      type="button"
      className="h-full w-1 cursor-col-resize bg-zinc-800 hover:bg-indigo-500"
      onMouseDown={handleMouseDown}
      aria-label="Resize sidebar"
    />
  )
}

const RootLayout = () => {
  const isMobile = useIsMobile()
  const [sidebarPercent, setSidebarPercent] = useState(30)

  const handleResize = useCallback((deltaPercent: number) => {
    setSidebarPercent(prev => {
      const newValue = prev + deltaPercent
      return Math.max(25, Math.min(45, newValue))
    })
  }, [])

  if (isMobile) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="flex h-screen flex-col bg-zinc-950">
          <div className="h-[45vh] min-h-62.5 shrink-0">
            <Sidebar isMobile={true} />
          </div>
          <div className="h-px bg-zinc-800" />
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </QueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-screen flex-row bg-zinc-950">
        <div className="flex h-full flex-col" style={{ width: `${sidebarPercent}%` }}>
          <Sidebar />
        </div>
        <ResizableDivider onResize={handleResize} />
        <div className="flex h-full flex-col p-5" style={{ width: `${100 - sidebarPercent}%` }}>
          <Outlet />
        </div>
      </div>
    </QueryClientProvider>
  )
}

export const Route = createRootRoute({ component: RootLayout })
