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

/**
 * Parse inline format text to CorrectionData
 * Format: {{original-corrected|type|reason}}
 * Example: "{{helo-Hello|spelling|Spelling error}} world"
 */
function parseInlineFormat(inlineData: InlineFormatData): CorrectionData {
  const text = inlineData.text
  const corrections: Correction[] = []
  let originalText = ''
  let correctedText = ''
  let position = 0
  
  // Regex to match {{original-corrected|type|reason}}
  const correctionRegex = /\{\{([^|]*?)-([^|]*?)\|([^|]*?)(?:\|([^}]*?))?\}\}/g
  
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
    
    // Position is where the correction starts in the original text
    const correctionPosition = originalText.length
    
    // Add correction to the list
    corrections.push({
      type,
      original,
      corrected,
      position: correctionPosition,
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

function convertPayloadToCorrectionData(payload: unknown): CorrectionData {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'text' in payload &&
    typeof (payload as InlineFormatData).text === 'string'
  ) {
    return parseInlineFormat(payload as InlineFormatData)
  }

  throw new Error('Invalid data format, expected inline text payload')
}

export function parseInlineJSON(jsonString: string): CorrectionData {
  try {
    const parsed = JSON.parse(jsonString)
    return convertPayloadToCorrectionData(parsed)
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON structure. Please ensure it is valid JSON text.')
    }
    throw error instanceof Error ? error : new Error('Unable to parse inline payload')
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
    return parseInlineJSON(decoded)
  } catch (error) {
    console.error('Failed to parse data parameter:', error)
  }

  return null
}

export function generateCorrectionURL(data: CorrectionData): string {
  const encoded = base64Encode(JSON.stringify(data))
  const params = new URLSearchParams({ data: encoded })
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}

export function generateExampleURL(): string {
  // Use the new inline format for LLM-friendly generation
  const inlineData: InlineFormatData = {
    text: "{{helo-Hello|spelling|Spelling error - correct spelling is 'Hello'}} world! This {{are-is|grammar|Subject-verb agreement - singular 'This' requires 'is'}} {{a-an|grammar|Article correction - use 'an' before vowel sounds}} example of {{grammer-grammar|spelling|Spelling error - correct spelling is 'grammar'}} corrections{{-.|punctuation|Sentence should end with a period}}"
  }
  
  const encoded = base64Encode(JSON.stringify(inlineData))
  const params = new URLSearchParams({ data: encoded })
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}
