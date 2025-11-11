import { useEffect, useState } from 'react'
import { EmptyState } from '@/components/EmptyState'
import { DiffView } from '@/components/DiffView'
import { CorrectionSummary } from '@/components/CorrectionSummary'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { parseCorrectionFromURL } from '@/lib/correction-parser'
import { CorrectionData } from '@/lib/types'
import { Warning } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

function App() {
  const [correctionData, setCorrectionData] = useState<CorrectionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
        <div className="max-w-2xl mx-auto">
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
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              Grammar Correction Analysis
            </h1>
            <p className="text-lg text-muted-foreground">
              Word-level comparison showing all corrections and improvements
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-8">
          <CorrectionSummary corrections={correctionData.corrections} />
          <DiffView
            original={correctionData.original}
            corrected={correctionData.corrected}
            corrections={correctionData.corrections}
          />
        </div>
      </div>
    </div>
  )
}

export default App