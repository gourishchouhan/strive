'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default function ConditionalLayout({ children }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  
  // Pages that should not have sidebar
  const noSidebarPages = ['/', '/auth', '/landing']
  const shouldShowSidebar = session && !noSidebarPages.includes(pathname)

  if (shouldShowSidebar) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto lg:ml-0">
          <div className="p-4 lg:p-8 pt-16 lg:pt-8">
            {children}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
