export type CorrectionType = 'addition' | 'deletion' | 'replacement' | 'punctuation'

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
