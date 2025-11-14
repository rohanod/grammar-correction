import { CorrectionData, InlineCorrectionData } from './types'
import { normalizeToLegacy } from './format-converter'

function base64Decode(str: string): string {
  try {
    return decodeURIComponent(atob(str).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''))
  } catch {
    return atob(str)
  }
}

function base64Encode(str: string): string {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  ))
}

export function parseCorrectionFromURL(): CorrectionData | null {
  const params = new URLSearchParams(window.location.search)
  
  const data = params.get('data')
  if (data) {
    try {
      const decoded = base64Decode(data)
      const parsed: CorrectionData | InlineCorrectionData = JSON.parse(decoded)
      
      // Normalize to legacy format for backward compatibility
      // The new inline format will be automatically converted
      return normalizeToLegacy(parsed)
    } catch (error) {
      console.error('Failed to parse data parameter:', error)
    }
  }
  
  // Legacy URL format support
  const original = params.get('original')
  const correctionsParam = params.get('corrections')
  
  if (!original || !correctionsParam) {
    return null
  }
  
  try {
    const corrections = JSON.parse(decodeURIComponent(correctionsParam))
    return {
      original: decodeURIComponent(original),
      corrected: corrections.corrected || '',
      corrections: corrections.corrections || []
    }
  } catch (error) {
    console.error('Failed to parse correction data:', error)
    return null
  }
}

export function generateCorrectionURL(data: CorrectionData): string {
  const encoded = base64Encode(JSON.stringify(data))
  const params = new URLSearchParams({ data: encoded })
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}

export function generateExampleURL(): string {
  // Use the new inline format for the example
  const inlineData: InlineCorrectionData = {
    segments: [
      {
        text: "helo",
        correction: {
          corrected: "Hello",
          type: "spelling",
          reason: "Spelling error - correct spelling is 'Hello'"
        }
      },
      { text: " world! This " },
      {
        text: "are",
        correction: {
          corrected: "is",
          type: "grammar",
          reason: "Subject-verb agreement - singular 'This' requires 'is'"
        }
      },
      { text: " " },
      {
        text: "a",
        correction: {
          corrected: "an",
          type: "grammar",
          reason: "Article correction - use 'an' before vowel sounds"
        }
      },
      { text: " example of " },
      {
        text: "grammer",
        correction: {
          corrected: "grammar",
          type: "spelling",
          reason: "Spelling error - correct spelling is 'grammar'"
        }
      },
      { text: " corrections" },
      {
        text: "",
        correction: {
          corrected: ".",
          type: "punctuation",
          reason: "Sentence should end with a period"
        }
      }
    ]
  }
  
  const encoded = base64Encode(JSON.stringify(inlineData))
  const params = new URLSearchParams({ data: encoded })
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}
