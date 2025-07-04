"use client"

import { cn } from "@/lib/utils"
import { Home, Users, Building2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname()

  const navigation = [
    {
      name: "الرئيسية",
      href: "/",
      icon: Home,
      current: pathname === "/",
    },
    {
      name: "المجرمين",
      href: "/criminals",
      icon: Users,
      current: pathname === "/criminals",
    },
  ]

  return (
    <div className={cn("fixed right-0 top-0 flex h-screen w-64 flex-col border-l bg-[#171717] z-50", className)}>
      {/* Header */}
      <div className="flex h-16 items-center border-b border-gray-700 px-4">
        <Building2 className="h-8 w-8 text-white" />
        <span className="mr-2 text-lg font-bold text-white">تطبيق الشرطة</span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white",
              item.current 
                ? "bg-gray-800 text-white" 
                : "text-gray-300"
            )}
          >
            <item.icon
              className={cn(
                "ml-3 h-4 w-4 shrink-0",
                item.current ? "text-white" : "text-gray-400"
              )}
            />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
} 