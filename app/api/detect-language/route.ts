export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import type { Language } from "@/lib/i18n/translations"

// Map of country codes to preferred languages from lib/i18n/detect-language.ts
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
}

export async function GET(request: NextRequest) {
  let language: Language = "en"

  try {
    const headersList = request.headers

    const country = headersList.get("x-vercel-ip-country")

    if (country && countryLanguageMap[country]) {
      language = countryLanguageMap[country]
    } else {
      const acceptLanguage = headersList.get("accept-language")
      if (acceptLanguage) {
        const primaryLang = acceptLanguage.split(",")[0].split("-")[0].toLowerCase()

        if (primaryLang === "es") {
          language = "es"
        } else if (primaryLang === "fr") {
          language = "fr"
        } else if (primaryLang === "pt") {
          language = "pt"
        }
      }
    }
  } catch (error) {}

  return NextResponse.json({ language })
}
