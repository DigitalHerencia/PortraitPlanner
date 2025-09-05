"use client"

import type React from "react"

import { BottomNav } from "@/components/bottom-nav"

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="container mx-auto py-6 pb-20 lg:pb-6">{children}</div>
      <BottomNav />
    </>
  )
}

