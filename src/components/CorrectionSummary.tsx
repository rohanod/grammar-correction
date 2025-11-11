import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Correction, CorrectionType } from '@/lib/types'
import { Check } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface CorrectionSummaryProps {
  corrections: Correction[]
}

function getCorrectionTypeColor(type: CorrectionType): string {
  switch (type) {
    case 'addition':
      return 'bg-green-500'
    case 'deletion':
      return 'bg-red-500'
    case 'replacement':
      return 'bg-amber-500'
    case 'punctuation':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

export function CorrectionSummary({ corrections }: CorrectionSummaryProps) {
  const correctionsByType = corrections.reduce((acc, correction) => {
    acc[correction.type] = (acc[correction.type] || 0) + 1
    return acc
  }, {} as Record<CorrectionType, number>)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-4 md:p-6 shadow-lg bg-gradient-to-br from-card to-primary/5">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Correction Summary</h2>
            <div className="flex items-center gap-2 bg-primary/10 px-2.5 md:px-3 py-1 md:py-1.5 rounded-[var(--radius-full)]">
              <Check size={16} weight="bold" className="text-primary md:w-[18px] md:h-[18px]" />
              <span className="text-xs md:text-sm font-semibold text-primary">
                {corrections.length} Total
              </span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {Object.entries(correctionsByType).map(([type, count]) => (
              <motion.div
                key={type}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-3 md:p-4 text-center transition-shadow">
                  <div className="flex flex-col gap-1.5 md:gap-2">
                    <Badge className={`${getCorrectionTypeColor(type as CorrectionType)} text-white text-xs`}>
                      {type}
                    </Badge>
                    <span className="text-xl md:text-2xl font-bold text-foreground">{count}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-1 md:mt-2 bg-muted/30 p-3 md:p-4 rounded-[var(--radius)]">
            <h3 className="text-xs md:text-sm font-semibold text-foreground mb-2 md:mb-3">All Corrections</h3>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {corrections.map((correction, index) => (
                <div key={index} className="flex items-start gap-2 md:gap-3 text-xs md:text-sm">
                  <Badge variant="outline" className="shrink-0 text-[10px] md:text-xs">
                    {index + 1}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="line-through text-red-600 font-medium break-words">{correction.original}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-green-600 font-medium break-words">{correction.corrected}</span>
                    </div>
                    {correction.reason && (
                      <p className="text-[10px] md:text-xs text-muted-foreground mt-1">{correction.reason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
