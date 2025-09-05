import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Camera } from "lucide-react"

const darkLogoClass = "mx-auto hidden dark:block filter brightness-90 contrast-110"

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground overflow-hidden fixed inset-0">
      <div className="text-center">
        <div className="dark:bg-background my-auto overflow-hidden">
          <Image
            src="https://raw.githubusercontent.com/DigitalHerencia/SouthwestMediasServices/refs/heads/main/public/SMS%20Logo/Black.png"
            alt="Southwest Media Services Logo"
            width={250}
            height={65}
            className="mx-auto dark:hidden"
          />
          <Image
            src="https://a5fvmmg873kgkibm.public.blob.vercel-storage.com/logo-i3YRDkVlHXfqy7kB19v4aujAtr9RZh.png"
            alt="Southwest Media Services Logo"
            width={100}
            height={33}
            className={darkLogoClass}
          />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Camera className="h-12 w-12 text-primary" />
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

