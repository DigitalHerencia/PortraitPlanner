import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Camera } from "lucide-react"

// Compact class names for the dark logo variation (keeps contrast but reduces visual weight)
const darkLogoClass = "mx-auto hidden dark:block filter brightness-90 contrast-110 opacity-60"

export default function Home() {
  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen px-4 overflow-hidden bg-background text-foreground">
      <div className="w-full max-w-2xl text-center">
        <div className="my-4 overflow-hidden dark:bg-background">
          {/* Light-mode logo (larger for better balance). Opacity to blend with page background. */}
          <Image
            src="/Grey.avif"
            alt="Southwest Media Services Logo"
            width={320}
            height={100}
            className="mx-auto dark:hidden opacity-70"
            priority
            sizes="(max-width: 640px) 200px, 320px"
          />

          {/* Dark-mode logo (smaller but still noticeable). Kept as separate image to preserve current dark/light design. */}
          <Image
            src="/Grey.avif"
            alt="Southwest Media Services Logo"
            width={160}
            height={50}
            className={darkLogoClass}
            priority
            sizes="(max-width: 640px) 96px, 160px"
          />
        </div>

        <div className="flex items-center justify-center space-x-3">
          <Camera className="w-12 h-12 text-primary" />
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-6xl">PhotoPro™</h1>
        </div>

        <p className="mx-auto max-w-[520px] text-muted-foreground mb-8 mt-4">
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

