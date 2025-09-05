import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Camera } from "lucide-react"

const darkLogoClass = "mx-auto hidden dark:block filter brightness-90 contrast-110"

export default function Home() {
  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen overflow-hidden bg-background text-foreground">
      <div className="text-center">
        <div className="my-auto overflow-hidden dark:bg-background">
          <Image
            src="https://raw.githubusercontent.com/DigitalHerencia/PortraitPlanner/refs/heads/main/public/Grey.avif"
            alt="Southwest Media Services Logo"
            width={250}
            height={65}
            className="mx-auto dark:hidden"
          />
          <Image
            src="https://raw.githubusercontent.com/DigitalHerencia/PortraitPlanner/refs/heads/main/public/Grey.avif"
            alt="Southwest Media Services Logo"
            width={100}
            height={33}
            className={darkLogoClass}
          />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Camera className="w-12 h-12 text-primary" />
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">PhotoPro™</h1>
        </div>
        <p className="mx-auto max-w-[350px] text-muted-foreground mb-8">
          A professional tool for wedding photographers by Southwest Media Services
        </p>
        <Link href="/sessions">
          <Button size="lg" className="font-semibold">
            Start Session
          </Button>
        </Link>
      </div>
    </div>
  )
}

