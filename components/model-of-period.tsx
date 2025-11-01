"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Heart, ChevronLeft, ChevronRight } from "lucide-react"
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

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const nextIndex = prev + 1
        if (nextIndex >= models[currentIndex].images.length) {
          // Move to next model
          setCurrentIndex((prevModel) => (prevModel + 1) % models.length)
          return 0
        }
        return nextIndex
      })
    }, 4000)

    return () => clearInterval(timer)
  }, [currentIndex, models])

  const nextSlide = () => {
    setCurrentImageIndex((prev) => {
      const nextIndex = prev + 1
      if (nextIndex >= models[currentIndex].images.length) {
        setCurrentIndex((prevModel) => (prevModel + 1) % models.length)
        return 0
      }
      return nextIndex
    })
  }

  const prevSlide = () => {
    setCurrentImageIndex((prev) => {
      const prevIndex = prev - 1
      if (prevIndex < 0) {
        const newModelIndex = (currentIndex - 1 + models.length) % models.length
        setCurrentIndex(newModelIndex)
        return models[newModelIndex].images.length - 1
      }
      return prevIndex
    })
  }

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
      <div className="grid md:grid-cols-2 gap-8">
        {/* Slideshow */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
          <Image
            src={currentImage}
            alt={currentModel.name}
            fill
            className="object-cover"
            priority
          />
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {currentModel.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Award Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-amber-600 text-white gap-1">
              <Trophy className="h-3 w-3" />
              {getAwardBadge(currentModel.awardType)}
            </Badge>
          </div>
        </div>

        {/* Model Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">{currentModel.name}</h3>
            <div className="flex items-center gap-2 text-amber-600">
              <Heart className="h-5 w-5 fill-current" />
              <span className="text-xl font-semibold">{currentModel.likes.toLocaleString()} Likes</span>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-600">Award Winner</p>
                  <p className="text-lg font-bold text-gray-900">{getAwardBadge(currentModel.awardType)}</p>
                </div>
              </div>
              <p className="text-gray-700">
                Recognized for outstanding engagement and popularity within the community.
              </p>
            </CardContent>
          </Card>

          {/* Model Selector */}
          <div className="grid grid-cols-3 gap-3">
            {models.map((model, idx) => (
              <button
                key={model.id}
                onClick={() => {
                  setCurrentIndex(idx)
                  setCurrentImageIndex(0)
                }}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentIndex ? "border-amber-600 scale-105" : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={model.avatar}
                  alt={model.name}
                  fill
                  className="object-cover"
                />
                {idx === currentIndex && (
                  <div className="absolute inset-0 bg-amber-600/20" />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs font-medium text-center">{model.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
