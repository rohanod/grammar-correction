import { CorrectionData, InlineCorrectionData, TextSegment, Correction } from './types'

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

// Convert legacy format to inline format
function convertLegacyToInline(legacy: CorrectionData): InlineCorrectionData {
  const segments: TextSegment[] = []
  const text = legacy.original
  
  // Sort corrections by position
  const sortedCorrections = [...legacy.corrections].sort((a, b) => a.position - b.position)
  
  let currentPos = 0
  
  for (const correction of sortedCorrections) {
    // Add text before this correction
    if (correction.position > currentPos) {
      segments.push({
        text: text.substring(currentPos, correction.position)
      })
    }
    
    // Add the correction segment
    segments.push({
      text: correction.original,
      correction: {
        type: correction.type,
        corrected: correction.corrected,
        reason: correction.reason
      }
    })
    
    currentPos = correction.position + correction.original.length
  }
  
  // Add remaining text
  if (currentPos < text.length) {
    segments.push({
      text: text.substring(currentPos)
    })
  }
  
  return { segments }
}

// Convert inline format to legacy format for backward compatibility
export function convertInlineToLegacy(inline: InlineCorrectionData): CorrectionData {
  let original = ''
  let corrected = ''
  const corrections: Correction[] = []
  let currentPos = 0
  
  for (const segment of inline.segments) {
    if (segment.correction) {
      // This segment has a correction
      original += segment.text
      corrected += segment.correction.corrected
      
      corrections.push({
        type: segment.correction.type,
        original: segment.text,
        corrected: segment.correction.corrected,
        position: currentPos,
        reason: segment.correction.reason
      })
      
      currentPos += segment.text.length
    } else {
      // Regular text segment
      original += segment.text
      corrected += segment.text
      currentPos += segment.text.length
    }
  }
  
  return { original, corrected, corrections }
}

export function parseCorrectionFromURL(): CorrectionData | null {
  const params = new URLSearchParams(window.location.search)
  
  const data = params.get('data')
  if (data) {
    try {
      const decoded = base64Decode(data)
      const parsed = JSON.parse(decoded)
      
      // Check if it's the new inline format
      if (parsed.segments && Array.isArray(parsed.segments)) {
        // Convert inline format to legacy format for rendering
        return convertInlineToLegacy(parsed as InlineCorrectionData)
      }
      
      // Legacy format
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
  // Convert to inline format for URL generation
  const inlineData = convertLegacyToInline(data)
  const encoded = base64Encode(JSON.stringify(inlineData))
  const params = new URLSearchParams({ data: encoded })
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}

export function generateExampleURL(): string {
  // Use inline format directly for the example
  const inlineData: InlineCorrectionData = {
    segments: [
      {
        text: "helo",
        correction: {
          type: "spelling",
          corrected: "Hello",
          reason: "Spelling error - correct spelling is 'Hello'"
        }
      },
      {
        text: " world! This "
      },
      {
        text: "are",
        correction: {
          type: "grammar",
          corrected: "is",
          reason: "Subject-verb agreement - singular 'This' requires 'is'"
        }
      },
      {
        text: " "
      },
      {
        text: "a",
        correction: {
          type: "grammar",
          corrected: "an",
          reason: "Article correction - use 'an' before vowel sounds"
        }
      },
      {
        text: " example of "
      },
      {
        text: "grammer",
        correction: {
          type: "spelling",
          corrected: "grammar",
          reason: "Spelling error - correct spelling is 'grammar'"
        }
      },
      {
        text: " corrections",
        correction: {
          type: "punctuation",
          corrected: " corrections.",
          reason: "Sentence should end with a period"
        }
      }
    ]
  }
  
  const encoded = base64Encode(JSON.stringify(inlineData))
  const params = new URLSearchParams({ data: encoded })
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}
