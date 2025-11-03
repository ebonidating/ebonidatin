"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface BannerHeroProps {
  image: string
  title: string
  subtitle: string
  cta?: {
    text: string
    href: string
  }
  overlay?: boolean
  priority?: boolean
}

export function BannerHero({ image, title, subtitle, cta, overlay = true, priority = false }: BannerHeroProps) {
  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-lg md:rounded-xl shadow-xl md:shadow-2xl group">
      {/* Background Image */}
      <Image
        src={image || "/placeholder.svg"}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
        className="object-cover will-change-transform group-hover:scale-105 transition-transform duration-500"
        quality={60}
      />

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 z-10">
        <div className="max-w-2xl space-y-3 md:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-balance drop-shadow-lg px-2">
            {title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 text-pretty drop-shadow-md max-w-xl mx-auto px-4">
            {subtitle}
          </p>

          {cta && (
            <div className="pt-2 md:pt-4">
              <Button
                asChild
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl transition-all min-h-[44px] px-4 sm:px-6 text-sm sm:text-base"
              >
                <Link href={cta.href} className="flex items-center gap-2">
                  {cta.text}
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
