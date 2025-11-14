import { CorrectionData, InlineCorrectionData, TextSegment, Correction } from './types'

/**
 * Converts legacy position-based format to new inline format
 */
export function legacyToInline(legacy: CorrectionData): InlineCorrectionData {
  const { original, corrections } = legacy
  
  if (corrections.length === 0) {
    return { segments: [{ text: original }] }
  }

  // Sort corrections by position
  const sortedCorrections = [...corrections].sort((a, b) => a.position - b.position)
  
  const segments: TextSegment[] = []
  let currentPos = 0

  for (const correction of sortedCorrections) {
    // Add text before this correction
    if (correction.position > currentPos) {
      const beforeText = original.substring(currentPos, correction.position)
      if (beforeText) {
        segments.push({ text: beforeText })
      }
    }

    // Add the correction segment
    segments.push({
      text: correction.original,
      correction: {
        corrected: correction.corrected,
        type: correction.type,
        reason: correction.reason
      }
    })

    currentPos = correction.position + correction.original.length
  }

  // Add remaining text after last correction
  if (currentPos < original.length) {
    segments.push({ text: original.substring(currentPos) })
  }

  return { segments }
}

/**
 * Converts inline format to legacy position-based format
 */
export function inlineToLegacy(inline: InlineCorrectionData): CorrectionData {
  let original = ''
  let corrected = ''
  const corrections: Correction[] = []
  let currentPos = 0

  for (const segment of inline.segments) {
    if (segment.correction) {
      // This is a correction
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
      // This is plain text
      original += segment.text
      corrected += segment.text
      currentPos += segment.text.length
    }
  }

  return { original, corrected, corrections }
}

/**
 * Normalizes data to the internal CorrectionData format for backward compatibility
 */
export function normalizeToLegacy(data: CorrectionData | InlineCorrectionData): CorrectionData {
  if ('segments' in data) {
    return inlineToLegacy(data)
  }
  return data
}
