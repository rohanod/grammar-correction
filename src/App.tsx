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
      <div className="max-w-5xl mx-auto p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Grammar Correction
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setShowCorrected(!showCorrected)}
                className="gap-2"
                variant={showCorrected ? "secondary" : "default"}
              >
                <ArrowsClockwise size={18} weight="bold" />
                {showCorrected ? 'Show Original' : 'Show Corrected'}
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="p-8 md:p-12 shadow-2xl bg-white/80 backdrop-blur-sm border-2 border-primary/10 rounded-[calc(var(--radius)*1.5)]">
            <TextWithHighlights 
              text={showCorrected ? correctionData.corrected : correctionData.original}
              corrections={correctionData.corrections}
              showCorrected={showCorrected}
            />
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default App