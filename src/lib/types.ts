export type CorrectionType = 'grammar' | 'spelling' | 'punctuation' | 'word-choice' | 'capitalization'

// Legacy format (position-based)
export interface Correction {
  type: CorrectionType
  original: string
  corrected: string
  position: number
  reason?: string
}

export interface CorrectionData {
  original: string
  corrected: string
  corrections: Correction[]
}

// New inline format (LLM-friendly)
export interface TextSegment {
  text: string
  correction?: {
    corrected: string
    type: CorrectionType
    reason?: string
  }
}

export interface InlineCorrectionData {
  segments: TextSegment[]
}

// Union type for both formats
export type CorrectionDataFormat = CorrectionData | InlineCorrectionData

// Type guards
export function isInlineFormat(data: CorrectionDataFormat): data is InlineCorrectionData {
  return 'segments' in data
}

export function isLegacyFormat(data: CorrectionDataFormat): data is CorrectionData {
  return 'original' in data && 'corrected' in data && 'corrections' in data
}
