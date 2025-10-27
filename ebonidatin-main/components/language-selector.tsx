"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "@/lib/i18n/use-translations"
import { Globe } from "lucide-react"

export function LanguageSelector() {
  const { language, changeLanguage } = useTranslations()

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={language} onValueChange={changeLanguage}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Español</SelectItem>
          <SelectItem value="fr">Français</SelectItem>
          <SelectItem value="pt">Português</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
