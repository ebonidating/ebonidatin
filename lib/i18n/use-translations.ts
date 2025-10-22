"use client"

import { useState, useEffect } from "react"
import { translations, type Language } from "./translations"

export function useTranslations() {
  const [language, setLanguage] = useState<Language>("en")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get language from localStorage or detect from browser
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    } else {
      // Detect from browser
      const browserLang = navigator.language.split("-")[0].toLowerCase()
      if (browserLang === "es" || browserLang === "fr" || browserLang === "pt") {
        setLanguage(browserLang as Language)
      }
    }
    setIsLoading(false)
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const t = translations[language]

  return { t, language, changeLanguage, isLoading }
}
