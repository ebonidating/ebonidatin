"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Sliders } from "lucide-react"

interface AdvancedFiltersProps {
  onApplyFilters: (filters: FilterOptions) => void
}

export interface FilterOptions {
  ageRange: [number, number]
  distance: number
  relationshipType: string[]
  interests: string[]
  education: string
  occupation: string
  showOnlineOnly: boolean
  showVerifiedOnly: boolean
}

const relationshipTypes = ["Serious Relationship", "Casual Dating", "Friendship", "Networking"]

const interestOptions = [
  "Travel",
  "Music",
  "Sports",
  "Art",
  "Food",
  "Movies",
  "Reading",
  "Fitness",
  "Gaming",
  "Photography",
  "Dancing",
  "Cooking",
]

const educationLevels = ["High School", "Some College", "Bachelor's", "Master's", "PhD", "Other"]

export function AdvancedFilters({ onApplyFilters }: AdvancedFiltersProps) {
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 50])
  const [distance, setDistance] = useState(50)
  const [relationshipType, setRelationshipType] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [education, setEducation] = useState("")
  const [occupation, setOccupation] = useState("")
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)

  const handleApply = () => {
    onApplyFilters({
      ageRange,
      distance,
      relationshipType,
      interests,
      education,
      occupation,
      showOnlineOnly,
      showVerifiedOnly,
    })
  }

  const toggleRelationshipType = (type: string) => {
    setRelationshipType((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const toggleInterest = (interest: string) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5" />
          <CardTitle>Advanced Filters</CardTitle>
        </div>
        <CardDescription>Refine your search to find the perfect match</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Age Range */}
        <div className="space-y-3">
          <Label>
            Age Range: {ageRange[0]} - {ageRange[1]}
          </Label>
          <Slider
            min={18}
            max={80}
            step={1}
            value={ageRange}
            onValueChange={(value) => setAgeRange(value as [number, number])}
            className="w-full"
          />
        </div>

        {/* Distance */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <Label>Distance: {distance}km</Label>
          </div>
          <Slider min={1} max={500} step={5} value={[distance]} onValueChange={(value) => setDistance(value[0])} />
        </div>

        {/* Relationship Type */}
        <div className="space-y-3">
          <Label>Relationship Type</Label>
          <div className="flex flex-wrap gap-2">
            {relationshipTypes.map((type) => (
              <Badge
                key={type}
                variant={relationshipType.includes(type) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleRelationshipType(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-3">
          <Label>Interests</Label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <Badge
                key={interest}
                variant={interests.includes(interest) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="space-y-2">
          <Label>Education Level</Label>
          <Select value={education} onValueChange={setEducation}>
            <SelectTrigger>
              <SelectValue placeholder="Any education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {educationLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Additional Filters */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="online"
              checked={showOnlineOnly}
              onCheckedChange={(checked) => setShowOnlineOnly(!!checked)}
            />
            <Label htmlFor="online" className="cursor-pointer">
              Show online users only
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={showVerifiedOnly}
              onCheckedChange={(checked) => setShowVerifiedOnly(!!checked)}
            />
            <Label htmlFor="verified" className="cursor-pointer">
              Show verified profiles only
            </Label>
          </div>
        </div>

        {/* Apply Button */}
        <Button onClick={handleApply} className="w-full bg-amber-600 hover:bg-amber-700">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
