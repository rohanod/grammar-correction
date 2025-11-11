import { useState } from 'react'
import { TextWithHighlights } from '@/components/TextWithHighlights'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CorrectionData } from '@/lib/types'
import { ArrowsClockwise } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

const EXAMPLE_DATA: CorrectionData = {
  original: "Helo world! This are a example of grammer corrections.",
  corrected: "Hello world! This is an example of grammar corrections.",
  corrections: [
    {
      type: "replacement",
      original: "Helo",
      corrected: "Hello",
      position: 0,
      reason: "Spelling error"
    },
    {
      type: "replacement",
      original: "are",
      corrected: "is",
      position: 18,
      reason: "Subject-verb agreement"
    },
    {
      type: "replacement",
      original: "a",
      corrected: "an",
      position: 21,
      reason: "Article correction (before vowel)"
    },
    {
      type: "replacement",
      original: "grammer",
      corrected: "grammar",
      position: 35,
      reason: "Spelling error"
    }
  ]
}

function App() {
  const [correctionData] = useState<CorrectionData>(EXAMPLE_DATA)
  const [showCorrected, setShowCorrected] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-start md:items-center justify-between mb-6 md:mb-8 flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-1 md:gap-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                Grammar Correction
              </h1>
              <p className="text-sm text-muted-foreground md:hidden">
                {showCorrected ? 'Viewing corrected text' : 'Viewing original text'}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button 
                onClick={() => setShowCorrected(!showCorrected)}
                className="gap-2 w-full md:w-auto"
                variant={showCorrected ? "secondary" : "default"}
                size="default"
              >
                <ArrowsClockwise size={18} weight="bold" />
                <span className="whitespace-nowrap">
                  {showCorrected ? 'Show Original' : 'Show Corrected'}
                </span>
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="p-4 md:p-8 lg:p-12 shadow-2xl bg-white/80 backdrop-blur-sm border-2 border-primary/10 rounded-[calc(var(--radius)*1.5)]">
            <TextWithHighlights 
              text={showCorrected ? correctionData.corrected : correctionData.original}
              corrections={correctionData.corrections}
              showCorrected={showCorrected}
            />
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 md:mt-6 text-center"
        >
          <p className="text-xs md:text-sm text-muted-foreground">
            <span className="md:hidden">Tap highlighted words to see correction details</span>
            <span className="hidden md:inline">Hover over highlighted words to see correction details</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default App