"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ModelOfPeriod {
  id: string
  name: string
  avatar: string
  images: string[]
  likes: number
  awardType: "day" | "week" | "month"
}

interface ModelOfPeriodProps {
  models: ModelOfPeriod[]
}

export function ModelOfPeriod({ models }: ModelOfPeriodProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentImageIndex((prev) => {
      const nextIndex = prev + 1
      if (nextIndex >= models[currentIndex].images.length) {
        setCurrentIndex((prevModel) => (prevModel + 1) % models.length)
        return 0
      }
      return nextIndex
    })
  }, [currentIndex, models])

  const prevSlide = useCallback(() => {
    setCurrentImageIndex((prev) => {
      const prevIndex = prev - 1
      if (prevIndex < 0) {
        const newModelIndex = (currentIndex - 1 + models.length) % models.length
        setCurrentIndex(newModelIndex)
        return models[newModelIndex].images.length - 1
      }
      return prevIndex
    })
  }, [currentIndex, models])

  // Auto-advance slideshow with reduced frequency
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => {
          nextSlide()
        })
      } else {
        nextSlide()
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [currentImageIndex, nextSlide])

  const currentModel = models[currentIndex]
  const currentImage = currentModel.images[currentImageIndex]

  const getAwardBadge = (awardType: string) => {
    switch (awardType) {
      case "day":
        return "Model of the Day"
      case "week":
        return "Model of the Week"
      case "month":
        return "Model of the Month"
      default:
        return "Top Model"
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col items-center space-y-6">
        {/* Model Info */}
        <div className="text-center space-y-4">
          <div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{currentModel.name}</h3>
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <svg className="h-4 w-4 md:h-5 md:w-5 fill-current" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-base md:text-lg lg:text-xl font-semibold">{currentModel.likes.toLocaleString()} Likes</span>
            </div>
          </div>

          <Badge className="bg-amber-600 text-white gap-1 text-xs md:text-sm py-1 px-3">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
            </svg>
            {getAwardBadge(currentModel.awardType)}
          </Badge>
        </div>

        {/* Model Carousel - One at a time */}
        <div className="relative w-full max-w-md mx-auto">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevSlide}
              aria-label="Previous model"
              className="bg-amber-600 hover:bg-amber-700 text-white p-2 md:p-3 rounded-full transition-all shadow-lg z-10"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className="relative aspect-square w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden border-4 border-amber-600 shadow-2xl">
              <Image
                src={currentModel.avatar}
                alt={currentModel.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 256px"
                quality={75}
                priority
              />
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next model"
              className="bg-amber-600 hover:bg-amber-700 text-white p-2 md:p-3 rounded-full transition-all shadow-lg z-10"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {models.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx)
                  setCurrentImageIndex(0)
                }}
                aria-label={`View model ${idx + 1}`}
                className={`h-2 md:h-2.5 rounded-full transition-all ${
                  idx === currentIndex ? "w-8 md:w-10 bg-amber-600" : "w-2 md:w-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
