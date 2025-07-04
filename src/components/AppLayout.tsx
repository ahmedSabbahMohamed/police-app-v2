"use client"

import { AppSidebar } from "@/components/AppSidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      <main className="flex-1 overflow-auto mr-64">
        <div className="container mx-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
} 