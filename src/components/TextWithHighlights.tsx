import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Correction, CorrectionType } from '@/lib/types'
import { motion } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'
import { useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

interface TextWithHighlightsProps {
  text: string
  corrections: Correction[]
  showCorrected: boolean
}

function getCorrectionColor(type: CorrectionType, isMobile: boolean): string {
  const hoverClass = isMobile ? '' : 'md:hover:bg-opacity-50'
  switch (type) {
    case 'addition':
      return `bg-green-400/30 ${hoverClass} border-b-2 border-green-500`
    case 'deletion':
      return `bg-red-400/30 ${hoverClass} border-b-2 border-red-500`
    case 'replacement':
      return `bg-primary/30 ${hoverClass} border-b-2 border-primary`
    case 'punctuation':
      return `bg-secondary/30 ${hoverClass} border-b-2 border-secondary`
    default:
      return `bg-muted/30 ${hoverClass}`
  }
}

function getCorrectionBadgeColor(type: CorrectionType): string {
  switch (type) {
    case 'addition':
      return 'bg-green-500 text-white'
    case 'deletion':
      return 'bg-red-500 text-white'
    case 'replacement':
      return 'bg-primary text-primary-foreground'
    case 'punctuation':
      return 'bg-secondary text-secondary-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function TextWithHighlights({ text, corrections, showCorrected }: TextWithHighlightsProps) {
  const words = text.split(/(\s+)/)
  let currentPosition = 0
  const elements: React.ReactElement[] = []

  words.forEach((word, index) => {
    const wordStart = currentPosition
    const wordEnd = currentPosition + word.length
    
    const correctionInRange = corrections.find(c => {
      const searchTerm = showCorrected ? c.corrected : c.original
      return c.position >= wordStart && c.position < wordEnd && word.includes(searchTerm)
    })

    if (correctionInRange) {
      elements.push(
        <CorrectionHighlight key={index} word={word} correction={correctionInRange} />
      )
    } else {
      elements.push(<span key={index}>{word}</span>)
    }

    currentPosition = wordEnd
  })

  return (
    <div className="text-xl md:text-2xl leading-loose tracking-wide">
      {elements}
    </div>
  )
}

function CorrectionHighlight({ word, correction }: { word: string; correction: Correction }) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.span
          className={`px-1.5 py-0.5 rounded-[var(--radius)] transition-all ${getCorrectionColor(correction.type, isMobile)}`}
          whileHover={isMobile ? undefined : { scale: 1.02 }}
          transition={{ duration: 0.15 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {word}
        </motion.span>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 shadow-2xl border-0 overflow-hidden rounded-[calc(var(--radius)*1.5)]"
        align="center"
        sideOffset={8}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col">
          <div className="p-5 bg-gradient-to-br from-card via-card to-accent/10">
            <Badge className={`${getCorrectionBadgeColor(correction.type)} mb-4 px-3 py-1 rounded-[var(--radius)]`}>
              {correction.type.charAt(0).toUpperCase() + correction.type.slice(1)}
            </Badge>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 bg-destructive/10 p-3 rounded-[var(--radius)]">
                <div className="text-xs text-muted-foreground mb-1.5 font-semibold uppercase tracking-wide">Original</div>
                <div className="text-base font-medium text-destructive line-through">
                  {correction.original}
                </div>
              </div>
              
              <ArrowRight size={24} className="text-primary shrink-0" weight="bold" />
              
              <div className="flex-1 bg-green-500/10 p-3 rounded-[var(--radius)]">
                <div className="text-xs text-muted-foreground mb-1.5 font-semibold uppercase tracking-wide">Corrected</div>
                <div className="text-base font-semibold text-green-600">
                  {correction.corrected}
                </div>
              </div>
            </div>
            
            {correction.reason && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Reason</div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {correction.reason}
                </p>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
