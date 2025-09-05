import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Camera } from "lucide-react"
import Link from "next/link"
import { ResponsiveLayout } from "@/components/responsive-layout"
import { MainNav } from "@/components/main-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PhotoPro - Southwest Media Services",
  description: "A professional tool for wedding photographers",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="PhotoPro" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="PhotoPro" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="container flex items-center h-12">
              <Link href="/" className="flex items-center space-x-2">
                <Camera className="w-6 h-6" />
              </Link>
              <MainNav />
              <div className="ml-auto">
                <ModeToggle />
              </div>
            </div>
          </header>
          <ResponsiveLayout>{children}</ResponsiveLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}

