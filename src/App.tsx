import { useEffect, useState } from 'react'
import { EmptyState } from '@/components/EmptyState'
import { TextWithHighlights } from '@/components/TextWithHighlights'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { parseCorrectionFromURL } from '@/lib/correction-parser'
import { CorrectionData } from '@/lib/types'
import { Warning, ArrowsClockwise } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

function App() {
  const [correctionData, setCorrectionData] = useState<CorrectionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCorrected, setShowCorrected] = useState(false)

  useEffect(() => {
    try {
      const data = parseCorrectionFromURL()
      if (data) {
        setCorrectionData(data)
      }
    } catch (err) {
      setError('Failed to parse correction data. Please check the URL format.')
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <Warning size={20} weight="bold" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!correctionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
        <EmptyState />
      </div>
    )
  }

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
          <Card className="p-8 md:p-12 shadow-2xl bg-white/80 backdrop-blur-sm border-2 border-primary/10">
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