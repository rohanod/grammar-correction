import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Correction, CorrectionType } from '@/lib/types'
import { motion } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'

interface TextWithHighlightsProps {
  text: string
  corrections: Correction[]
  showCorrected: boolean
}

function getCorrectionColor(type: CorrectionType): string {
  switch (type) {
    case 'addition':
      return 'bg-green-400/30 hover:bg-green-400/50 border-b-2 border-green-500'
    case 'deletion':
      return 'bg-red-400/30 hover:bg-red-400/50 border-b-2 border-red-500'
    case 'replacement':
      return 'bg-primary/30 hover:bg-primary/50 border-b-2 border-primary'
    case 'punctuation':
      return 'bg-secondary/30 hover:bg-secondary/50 border-b-2 border-secondary'
    default:
      return 'bg-muted/30 hover:bg-muted/50'
  }
}

function getCorrectionBadgeColor(type: CorrectionType): string {
  switch (type) {
    case 'addition':
      return 'bg-green-500 hover:bg-green-600 text-white'
    case 'deletion':
      return 'bg-red-500 hover:bg-red-600 text-white'
    case 'replacement':
      return 'bg-primary hover:bg-primary/90 text-primary-foreground'
    case 'punctuation':
      return 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
    default:
      return 'bg-muted hover:bg-muted/90 text-muted-foreground'
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
        <Popover key={index}>
          <PopoverTrigger asChild>
            <motion.span
              className={`px-1.5 py-0.5 rounded-md cursor-pointer transition-all ${getCorrectionColor(correctionInRange.type)}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.15 }}
            >
              {word}
            </motion.span>
          </PopoverTrigger>
          <PopoverContent 
            className="w-80 p-0 shadow-xl border-2"
            align="center"
            sideOffset={8}
          >
            <div className="flex flex-col">
              <div className="p-4 bg-gradient-to-br from-card to-muted/20">
                <Badge className={`${getCorrectionBadgeColor(correctionInRange.type)} mb-3`}>
                  {correctionInRange.type.charAt(0).toUpperCase() + correctionInRange.type.slice(1)}
                </Badge>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1 font-medium">Original</div>
                    <div className="text-base font-medium text-destructive line-through">
                      {correctionInRange.original}
                    </div>
                  </div>
                  
                  <ArrowRight size={20} className="text-muted-foreground shrink-0" weight="bold" />
                  
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1 font-medium">Corrected</div>
                    <div className="text-base font-semibold text-green-600">
                      {correctionInRange.corrected}
                    </div>
                  </div>
                </div>
                
                {correctionInRange.reason && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-1 font-medium">Reason</div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {correctionInRange.reason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
