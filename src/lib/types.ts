export type CorrectionType = 'grammar' | 'spelling' | 'punctuation' | 'word-choice' | 'capitalization'

// Legacy format - kept for backward compatibility
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

// New inline format - LLM-friendly without position calculations
export interface InlineCorrection {
  type: CorrectionType
  corrected: string
  reason?: string
}

export interface TextSegment {
  text: string
  correction?: InlineCorrection
}

export interface InlineCorrectionData {
  segments: TextSegment[]
}
