import { CorrectionData } from './types'

export function parseCorrectionFromURL(): CorrectionData | null {
  const params = new URLSearchParams(window.location.search)
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

export function generateExampleURL(): string {
  const original = "helo world! This are a example of grammer corrections"
  const correctionData = {
    corrected: "Hello world! This is an example of grammar corrections.",
    corrections: [
      {
        type: "capitalization",
        original: "helo",
        corrected: "Hello",
        position: 0,
        reason: "First word of sentence should be capitalized"
      },
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
  
  const params = new URLSearchParams({
    original: encodeURIComponent(original),
    corrections: encodeURIComponent(JSON.stringify(correctionData))
  })
  
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}
