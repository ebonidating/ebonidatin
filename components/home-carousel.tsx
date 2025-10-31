"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HomeCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  const modelImages = [
    "/beautiful-black-woman-model-1.jpg",
    "/beautiful-black-woman-model-2.jpg",
    "/beautiful-black-woman-model-3.jpg",
    "/beautiful-black-woman-model-4.jpg",
    "/beautiful-black-woman-model-5.jpg",
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % modelImages.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [modelImages.length])

  if (!mounted) {
    return (
      <section className="relative w-full h-96 sm:h-[500px] md:h-[600px] overflow-hidden bg-gray-200 dark:bg-gray-800" />
    )
  }

  return (
    <section className="relative w-full h-96 sm:h-[500px] md:h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={modelImages[currentImageIndex] || "/placeholder.svg"}
          alt={`Model carousel image ${currentImageIndex + 1} of ${modelImages.length}`}
          fill
          className="object-cover transition-opacity duration-1000"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">
          Find Your Perfect Match
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl text-balance">
          Connect with authentic Black singles worldwide. Verified members, smart matching, and meaningful
          relationships.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
              Get Started <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 bg-transparent">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      {/* Image Navigation */}
      <div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2"
        role="tablist"
        aria-label="Carousel slides"
      >
        {modelImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImageIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentImageIndex ? "bg-white w-8" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
            aria-selected={idx === currentImageIndex}
            role="tab"
          />
        ))}
      </div>
    </section>
  )
}
