export type CorrectionType = 'grammar' | 'spelling' | 'punctuation' | 'word-choice' | 'capitalization'

export interface Correction {
  type: CorrectionType
  original: string
  corrected: string
  position: number
  correctedPosition: number
  reason?: string
}

export interface CorrectionData {
  original: string
  corrected: string
  corrections: Correction[]
}

// New inline format for LLM-friendly generation
export interface InlineFormatData {
  text: string
}
