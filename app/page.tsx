import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Camera } from "lucide-react"

export default function Home() {
  return (
  <div className="fixed inset-0 flex items-center justify-center min-h-screen px-4 overflow-hidden bg-[#151515] text-foreground">
      <div className="w-full max-w-2xl text-center">
      <div className="overflow-hidden">
          <Image
            src="/Grey.avif"
            alt="Southwest Media Services Logo"
            width={320}
            height={100}
            className="relative mx-auto -z-40"
            priority
            sizes="(max-width: 640px) 96px, 160px"
          />
        </div>

  <div className="z-0 flex items-center justify-center -mt-20 space-x-3">
          <Camera className="w-12 h-12 text-primary" />
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-6xl">PhotoPro™</h1>
        </div>

  <p className="mx-auto max-w-[520px] text-muted-foreground mb-6 mt-2">
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

