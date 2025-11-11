import { CorrectionData } from './types'

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
      const parsed = JSON.parse(decoded)
      return {
        original: parsed.original || '',
        corrected: parsed.corrected || '',
        corrections: parsed.corrections || []
      }
    } catch (error) {
      console.error('Failed to parse data parameter:', error)
    }
  }
  
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
  const correctionData: CorrectionData = {
    original: "helo world! This are a example of grammer corrections",
    corrected: "Hello world! This is an example of grammar corrections.",
    corrections: [
      {
        type: "spelling",
        original: "helo",
        corrected: "Hello",
        position: 0,
        reason: "Spelling error - correct spelling is 'Hello'"
      },
      {
        type: "grammar",
        original: "are",
        corrected: "is",
        position: 18,
        reason: "Subject-verb agreement - singular 'This' requires 'is'"
      },
      {
        type: "grammar",
        original: "a",
        corrected: "an",
        position: 21,
        reason: "Article correction - use 'an' before vowel sounds"
      },
      {
        type: "spelling",
        original: "grammer",
        corrected: "grammar",
        position: 35,
        reason: "Spelling error - correct spelling is 'grammar'"
      },
      {
        type: "punctuation",
        original: "",
        corrected: ".",
        position: 54,
        reason: "Sentence should end with a period"
      }
    ]
  }
  
  return generateCorrectionURL(correctionData)
}
