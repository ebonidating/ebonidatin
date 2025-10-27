import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const text = searchParams.get('text')
    
    if (!text) {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 })
    }

    // Simple language detection based on common patterns
    // This is a basic implementation - you might want to use a proper library
    const detectedLanguage = detectLanguage(text)
    
    return NextResponse.json({ language: detectedLanguage })
  } catch (error) {
    console.error('Language detection error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function detectLanguage(text: string): string {
  const englishPattern = /\b(the|and|is|in|to|of|a|an)\b/i
  const spanishPattern = /\b(el|la|los|las|de|que|y|en)\b/i
  const frenchPattern = /\b(le|la|les|de|et|est|dans)\b/i
  
  if (englishPattern.test(text)) return 'en'
  if (spanishPattern.test(text)) return 'es'
  if (frenchPattern.test(text)) return 'fr'
  
  return 'en' // Default to English
}
