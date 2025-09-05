"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Camera, User2, Calendar, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-black border-t border-gray-800 lg:hidden">
      <div className="grid h-full grid-cols-4 mx-auto">
        <Link
          href="/client"
          className={cn(
            "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-900 group",
            pathname === "/client" ? "text-white" : "text-gray-400",
          )}
        >
          <User2 className="w-5 h-5" />
          <span className="text-xs">Client</span>
        </Link>
        <Link
          href="/shot-list"
          className={cn(
            "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-900 group",
            pathname === "/shot-list" ? "text-white" : "text-gray-400",
          )}
        >
          <Camera className="w-5 h-5" />
          <span className="text-xs">Shots</span>
        </Link>
        <Link
          href="/schedule"
          className={cn(
            "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-900 group",
            pathname === "/schedule" ? "text-white" : "text-gray-400",
          )}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-xs">Schedule</span>
        </Link>
        <Link
          href="/settings"
          className={cn(
            "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-900 group",
            pathname === "/settings" ? "text-white" : "text-gray-400",
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs">Settings</span>
        </Link>
      </div>
    </nav>
  )
}

