import { CorrectionData, InlineFormatData, Correction, CorrectionType } from './types'

export function base64Decode(str: string): string {
  try {
    return decodeURIComponent(atob(str).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''))
  } catch {
    return atob(str)
  }
}

export function base64Encode(str: string): string {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  ))
}

function getViewerPath() {
  return (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'
}

/**
 * Parse inline format text to CorrectionData
 * Format: {{original⋮corrected|type|reason}}
 * Example: "{{helo⋮Hello|spelling|Spelling error}} world"
 */
function parseInlineFormat(inlineData: InlineFormatData): CorrectionData {
  const text = inlineData.text
  const corrections: Correction[] = []
  let originalText = ''
  let correctedText = ''
  
  // Regex to match {{original⋮corrected|type|reason}}
  const correctionRegex = /\{\{([\s\S]*?)⋮([\s\S]*?)\|([^|}]*?)(?:\|([\s\S]*?))?\}\}/g
  
  let lastIndex = 0
  let match: RegExpExecArray | null
  
  while ((match = correctionRegex.exec(text)) !== null) {
    // Add text before the correction
    const beforeText = text.substring(lastIndex, match.index)
    originalText += beforeText
    correctedText += beforeText
    
    const original = match[1]
    const corrected = match[2]
    const type = match[3] as CorrectionType
    const reason = match[4] || undefined
    
    // Positions for both the original and corrected strings
    const correctionPosition = originalText.length
    const correctedPosition = correctedText.length
    
    // Add correction to the list
      corrections.push({
        type,
        original,
        corrected,
        position: correctionPosition,
        correctedPosition,
        reason
      })
    
    // Update texts
    originalText += original
    correctedText += corrected
    
    lastIndex = correctionRegex.lastIndex
  }
  
  // Add any remaining text after the last correction
  const remainingText = text.substring(lastIndex)
  originalText += remainingText
  correctedText += remainingText
  
  return {
    original: originalText,
    corrected: correctedText,
    corrections
  }
}

export function parseCorrectionFromURL(): CorrectionData | null {
  const params = new URLSearchParams(window.location.search)

  const data = params.get('data')
  if (!data) {
    return null
  }

  try {
    const decoded = base64Decode(data)
    const parsed = JSON.parse(decoded)

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'text' in parsed &&
      typeof (parsed as InlineFormatData).text === 'string'
    ) {
      return parseInlineFormat(parsed as InlineFormatData)
    }

    console.error('Invalid data format, expected inline text payload')
  } catch (error) {
    console.error('Failed to parse data parameter:', error)
  }

  return null
}

export function generateCorrectionURL(data: CorrectionData): string {
  const encoded = base64Encode(JSON.stringify(data))
  const params = new URLSearchParams({ data: encoded })
  const viewerPath = getViewerPath()
  return `${window.location.origin}${viewerPath}?${params.toString()}`
}

export function generateExampleURL(): string {
  // Use the new inline format for LLM-friendly generation
  const inlineData: InlineFormatData = {
    text: "{{helo⋮Hello|spelling|Spelling error - correct spelling is 'Hello'}} world! This {{are⋮is|grammar|Subject-verb agreement - singular 'This' requires 'is'}} {{a⋮an|grammar|Article correction - use 'an' before vowel sounds}} example of {{grammer⋮grammar|spelling|Spelling error - correct spelling is 'grammar'}} corrections{{⋮.|punctuation|Sentence should end with a period}}"
  }

  const encoded = base64Encode(JSON.stringify(inlineData))
  const params = new URLSearchParams({ data: encoded })
  const viewerPath = getViewerPath()
  return `${window.location.origin}${viewerPath}?${params.toString()}`
}
