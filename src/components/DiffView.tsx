import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Correction, CorrectionType } from '@/lib/types'
import { motion } from 'framer-motion'
import { ReactElement } from 'react'

interface DiffViewProps {
  original: string
  corrected: string
  corrections: Correction[]
}

function getCorrectionColor(type: CorrectionType): string {
  switch (type) {
    case 'addition':
      return 'bg-green-100 text-green-800 hover:bg-green-200'
    case 'deletion':
      return 'bg-red-100 text-red-800 hover:bg-red-200 line-through'
    case 'replacement':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-200'
    case 'punctuation':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getCorrectionBadgeColor(type: CorrectionType): string {
  switch (type) {
    case 'addition':
      return 'bg-green-500 text-white'
    case 'deletion':
      return 'bg-red-500 text-white'
    case 'replacement':
      return 'bg-amber-500 text-white'
    case 'punctuation':
      return 'bg-blue-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

interface TextWithCorrectionsProps {
  text: string
  corrections: Correction[]
  showOriginal: boolean
}

function TextWithCorrections({ text, corrections, showOriginal }: TextWithCorrectionsProps) {
  const words = text.split(/(\s+)/)
  let currentPosition = 0
  const elements: ReactElement[] = []

  words.forEach((word, index) => {
    const wordStart = currentPosition
    const wordEnd = currentPosition + word.length
    
    const correctionInRange = corrections.find(c => {
      if (showOriginal) {
        return c.position >= wordStart && c.position < wordEnd && word.includes(c.original)
      } else {
        return c.position >= wordStart && c.position < wordEnd && word.includes(c.corrected)
      }
    })

    if (correctionInRange) {
      elements.push(
        <TooltipProvider key={index}>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <motion.span
                className={`px-1 py-0.5 rounded cursor-help transition-colors ${getCorrectionColor(correctionInRange.type)}`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {word}
              </motion.span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="flex flex-col gap-2">
                <Badge className={getCorrectionBadgeColor(correctionInRange.type)}>
                  {correctionInRange.type.toUpperCase()}
                </Badge>
                <div className="text-sm">
                  <div className="font-medium">Original: <span className="font-normal">{correctionInRange.original}</span></div>
                  <div className="font-medium">Corrected: <span className="font-normal">{correctionInRange.corrected}</span></div>
                  {correctionInRange.reason && (
                    <div className="mt-2 text-muted-foreground">{correctionInRange.reason}</div>
                  )}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    } else {
      elements.push(<span key={index}>{word}</span>)
    }

    currentPosition = wordEnd
  })

  return <div className="text-lg leading-relaxed">{elements}</div>
}

export function DiffView({ original, corrected, corrections }: DiffViewProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-6 h-full shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">Original Text</h2>
              <Badge variant="outline" className="text-xs">
                {corrections.length} {corrections.length === 1 ? 'correction' : 'corrections'}
              </Badge>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <TextWithCorrections text={original} corrections={corrections} showOriginal={true} />
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="p-6 h-full shadow-lg border-2 border-primary/20">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-primary">Corrected Text</h2>
              <Badge className="bg-primary text-primary-foreground text-xs">
                ✓ Reviewed
              </Badge>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <TextWithCorrections text={corrected} corrections={corrections} showOriginal={false} />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
