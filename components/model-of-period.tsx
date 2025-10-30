"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp } from "lucide-react"
import { ImageCarousel } from "./image-carousel"

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
  const [activeTab, setActiveTab] = useState<"day" | "week" | "month">("day")

  const modelOfDay = models.find((m) => m.awardType === "day")
  const modelOfWeek = models.find((m) => m.awardType === "week")
  const modelOfMonth = models.find((m) => m.awardType === "month")

  const currentModel = activeTab === "day" ? modelOfDay : activeTab === "week" ? modelOfWeek : modelOfMonth

  if (!currentModel) {
    return null
  }

  return (
    <div className="w-full">
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-600" />
              <CardTitle>Model of the {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</CardTitle>
            </div>
            <div className="flex gap-2">
              {(["day", "week", "month"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab ? "bg-amber-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <CardDescription>Celebrating our most liked and engaged models</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Carousel */}
            <div>
              <ImageCarousel
                images={currentModel.images}
                autoSlideInterval={10000}
                title={currentModel.name}
                subtitle={`${currentModel.likes} likes`}
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={currentModel.avatar || "/placeholder.svg"}
                    alt={currentModel.name}
                    className="h-16 w-16 rounded-full object-cover border-2 border-amber-600"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{currentModel.name}</h3>
                    <Badge className="bg-amber-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Likes</p>
                    <p className="text-3xl font-bold text-amber-600">{currentModel.likes.toLocaleString()}</p>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Award</p>
                    <p className="text-lg font-semibold text-gray-900">Model of the {activeTab}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
