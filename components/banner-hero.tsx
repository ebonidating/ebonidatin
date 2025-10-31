"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BannerHeroProps {
  image: string
  title: string
  subtitle: string
  cta?: {
    text: string
    href: string
  }
  overlay?: boolean
}

export function BannerHero({ image, title, subtitle, cta, overlay = true }: BannerHeroProps) {
  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-xl shadow-2xl group">
      {/* Background Image */}
      <img
        src={image || "/placeholder.svg"}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance drop-shadow-lg">{title}</h1>
          <p className="text-lg md:text-xl text-white/90 text-pretty drop-shadow-md max-w-xl mx-auto">{subtitle}</p>

          {cta && (
            <div className="pt-4">
              <Button
                asChild
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Link href={cta.href} className="flex items-center gap-2">
                  {cta.text}
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
