import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Correction, CorrectionType } from '@/lib/types'
import { ArrowRight } from '@phosphor-icons/react'
import { useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

interface TextWithHighlightsProps {
  text: string
  corrections: Correction[]
  showCorrected: boolean
}

function getCorrectionColor(type: CorrectionType): string {
  switch (type) {
    case 'grammar':
      return 'bg-[oklch(0.55_0.20_264)]/20 border-b-2 border-[oklch(0.55_0.20_264)]'
    case 'spelling':
      return 'bg-red-500/20 border-b-2 border-red-500'
    case 'punctuation':
      return 'bg-[oklch(0.83_0.08_264)]/20 border-b-2 border-[oklch(0.83_0.08_264)]'
    case 'word-choice':
      return 'bg-[oklch(0.63_0.15_264)]/20 border-b-2 border-[oklch(0.63_0.15_264)]'
    case 'capitalization':
      return 'bg-orange-500/20 border-b-2 border-orange-500'
    default:
      return 'bg-muted/30 border-b-2 border-muted-foreground'
  }
}

function getCorrectionBadgeColor(type: CorrectionType): string {
  switch (type) {
    case 'grammar':
      return 'bg-[oklch(0.55_0.20_264)] text-white'
    case 'spelling':
      return 'bg-red-500 text-white'
    case 'punctuation':
      return 'bg-[oklch(0.83_0.08_264)] text-[oklch(0.25_0.02_240)]'
    case 'word-choice':
      return 'bg-[oklch(0.63_0.15_264)] text-white'
    case 'capitalization':
      return 'bg-orange-500 text-white'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function getCorrectionLabel(type: CorrectionType): string {
  switch (type) {
    case 'grammar':
      return 'Grammar'
    case 'spelling':
      return 'Spelling'
    case 'punctuation':
      return 'Punctuation'
    case 'word-choice':
      return 'Word Choice'
    case 'capitalization':
      return 'Capitalization'
    default:
      return type
  }
}

export function TextWithHighlights({ text, corrections, showCorrected }: TextWithHighlightsProps) {
  const sortedCorrections = [...corrections]
    .map(correction => ({
      correction,
      start: showCorrected ? correction.correctedPosition : correction.position,
      length: showCorrected ? correction.corrected.length : correction.original.length,
    }))
    .sort((a, b) => a.start - b.start)

  const elements: React.ReactElement[] = []
  let cursor = 0

  sortedCorrections.forEach((item, index) => {
    const { correction, start, length } = item

    if (start > cursor) {
      elements.push(
        <span key={`text-${index}-${showCorrected}-${cursor}`}>{text.slice(cursor, start)}</span>
      )
    }

    const segment = text.slice(start, start + length)

    elements.push(
      <CorrectionHighlight
        key={`correction-${index}-${showCorrected}-${start}`}
        segment={segment}
        correction={correction}
      />
    )

    cursor = start + length
  })

  if (cursor < text.length) {
    elements.push(<span key={`text-tail-${showCorrected}-${cursor}`}>{text.slice(cursor)}</span>)
  }

  return (
    <div className="text-base md:text-xl lg:text-2xl leading-relaxed md:leading-loose tracking-wide whitespace-pre-wrap">
      {elements}
    </div>
  )
}

function CorrectionHighlight({ segment, correction }: { segment: string; correction: Correction }) {
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

  const handleClick = () => {
    if (isMobile) {
      setIsOpen(!isOpen)
    }
  }

  const correctionContent = (
    <div className="flex flex-col rounded-[calc(var(--radius)*1.5)] overflow-hidden">
      <div className="p-5 bg-gradient-to-br from-card via-card to-accent/10">
        <Badge className={`${getCorrectionBadgeColor(correction.type)} mb-4 px-3 py-1 rounded-[calc(var(--radius)*0.75)] text-xs font-semibold`}>
          {getCorrectionLabel(correction.type)}
        </Badge>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
          <div className="flex-1 bg-red-500/10 p-3 rounded-[calc(var(--radius)*0.75)]">
            <div className="text-xs text-muted-foreground mb-1.5 font-semibold uppercase tracking-wide">Original</div>
            <div className="text-base font-medium text-red-600 line-through break-words">
              {correction.original || '(missing)'}
            </div>
          </div>
          
          <ArrowRight size={20} className="text-primary shrink-0 self-center md:self-auto rotate-90 md:rotate-0" weight="bold" />
          
          <div className="flex-1 bg-green-500/10 p-3 rounded-[calc(var(--radius)*0.75)]">
            <div className="text-xs text-muted-foreground mb-1.5 font-semibold uppercase tracking-wide">Corrected</div>
            <div className="text-base font-semibold text-green-600 break-words">
              {correction.corrected || '(removed)'}
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
  )

  if (isMobile) {
    return (
      <>
        <span
          className={`px-1.5 py-0.5 rounded-[var(--radius)] transition-all cursor-pointer ${getCorrectionColor(correction.type)}`}
          onClick={handleClick}
        >
          {segment}
        </span>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-[calc(var(--radius)*1.5)] p-0 gap-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Correction Details</DialogTitle>
            </DialogHeader>
            {correctionContent}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <span
          className={`px-1.5 py-0.5 rounded-[var(--radius)] transition-all ${getCorrectionColor(correction.type)}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {segment}
        </span>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[calc(100vw-2rem)] max-w-[320px] p-0 shadow-2xl border-0 overflow-hidden rounded-[calc(var(--radius)*1.5)]"
        align="center"
        sideOffset={8}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {correctionContent}
      </PopoverContent>
    </Popover>
  )
}
