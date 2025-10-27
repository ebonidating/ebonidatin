"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/lib/theme/theme-provider"
import { Moon, Sun, Palette } from "lucide-react"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      {theme === "light" && <Sun className="h-4 w-4 text-muted-foreground" />}
      {theme === "dark" && <Moon className="h-4 w-4 text-muted-foreground" />}
      {theme === "pride" && <Palette className="h-4 w-4 text-muted-foreground" />}
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="pride">Pride</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
