import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Correction, CorrectionType } from '@/lib/types'
import { motion } from 'framer-motion'
import { ReactElement, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

interface DiffViewProps {
  original: string
  corrected: string
  corrections: Correction[]
}

function getCorrectionColor(type: CorrectionType): string {
  switch (type) {
    case 'grammar':
      return 'bg-blue-100 text-blue-800'
    case 'spelling':
      return 'bg-red-100 text-red-800'
    case 'punctuation':
      return 'bg-purple-100 text-purple-800'
    case 'word-choice':
      return 'bg-amber-100 text-amber-800'
    case 'capitalization':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getCorrectionBadgeColor(type: CorrectionType): string {
  switch (type) {
    case 'grammar':
      return 'bg-blue-500 text-white'
    case 'spelling':
      return 'bg-red-500 text-white'
    case 'punctuation':
      return 'bg-purple-500 text-white'
    case 'word-choice':
      return 'bg-amber-500 text-white'
    case 'capitalization':
      return 'bg-orange-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

interface CorrectionSpanProps {
  word: string
  correction: Correction
}

function CorrectionSpan({ word, correction }: CorrectionSpanProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  const handleClick = () => {
    if (isMobile) {
      setIsOpen(!isOpen)
    }
  }

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsOpen(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={isMobile ? setIsOpen : undefined} delayDuration={0}>
        <TooltipTrigger asChild>
          <span
            className={`px-1 py-0.5 rounded-[var(--radius)] cursor-pointer transition-colors ${getCorrectionColor(correction.type)}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            {word}
          </span>
        </TooltipTrigger>
        <TooltipContent 
          className="max-w-xs z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex flex-col gap-2">
            <Badge className={getCorrectionBadgeColor(correction.type)}>
              {correction.type.toUpperCase()}
            </Badge>
            <div className="text-sm">
              <div className="font-medium">Original: <span className="font-normal">{correction.original}</span></div>
              <div className="font-medium">Corrected: <span className="font-normal">{correction.corrected}</span></div>
              {correction.reason && (
                <div className="mt-2 text-muted-foreground">{correction.reason}</div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
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
        <CorrectionSpan key={index} word={word} correction={correctionInRange} />
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
            <div className="bg-muted/30 p-4 rounded-[var(--radius)]">
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
            <div className="bg-primary/5 p-4 rounded-[var(--radius)] border border-primary/10">
              <TextWithCorrections text={corrected} corrections={corrections} showOriginal={false} />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
