"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden lg:flex items-center space-x-6 ml-8">
      <Link
        href="/client"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/client" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Client
      </Link>
      <Link
        href="/schedule"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/schedule" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Schedule
      </Link>
      <Link
        href="/shot-list"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/shot-list" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Shot List
      </Link>
      <Link
        href="/settings"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/settings" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Settings
      </Link>
    </nav>
  )
}

