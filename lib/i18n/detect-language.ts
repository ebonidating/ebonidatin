"use server"

import { headers } from "next/headers"
import type { Language } from "./translations"

// Map of country codes to preferred languages
const countryLanguageMap: Record<string, Language> = {
  // Spanish-speaking countries
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  VE: "es",
  EC: "es",
  GT: "es",
  CU: "es",
  BO: "es",
  DO: "es",
  HN: "es",
  PY: "es",
  SV: "es",
  NI: "es",
  CR: "es",
  PA: "es",
  UY: "es",

  // French-speaking countries
  FR: "fr",
  BE: "fr",
  CH: "fr",
  CA: "fr",
  LU: "fr",
  MC: "fr",
  // African French-speaking countries
  SN: "fr",
  CI: "fr",
  CM: "fr",
  BF: "fr",
  NE: "fr",
  ML: "fr",
  RW: "fr",
  BJ: "fr",
  BI: "fr",
  TD: "fr",
  CF: "fr",
  CG: "fr",
  CD: "fr",
  DJ: "fr",
  GQ: "fr",
  GA: "fr",
  GN: "fr",
  MG: "fr",
  TG: "fr",

  // Portuguese-speaking countries
  PT: "pt",
  BR: "pt",
  AO: "pt",
  MZ: "pt",
  GW: "pt",
  TL: "pt",
  CV: "pt",
  ST: "pt",

  // Default to English for all other countries
}

export async function detectUserLanguage(): Promise<Language> {
  try {
    const headersList = await headers()

    // Try to get country from Vercel's geo headers
    const country = headersList.get("x-vercel-ip-country")

    console.log("[v0] Detected country:", country)

    if (country && countryLanguageMap[country]) {
      return countryLanguageMap[country]
    }

    // Fallback to Accept-Language header
    const acceptLanguage = headersList.get("accept-language")
    if (acceptLanguage) {
      const primaryLang = acceptLanguage.split(",")[0].split("-")[0].toLowerCase()

      if (primaryLang === "es") return "es"
      if (primaryLang === "fr") return "fr"
      if (primaryLang === "pt") return "pt"
    }

    // Default to English
    return "en"
  } catch (error) {
    console.error("[v0] Error detecting language:", error)
    return "en"
  }
}
