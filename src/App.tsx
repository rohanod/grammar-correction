import { useMemo, useState } from 'react'
import { TextWithHighlights } from '@/components/TextWithHighlights'
import { Card } from '@/components/ui/card'
import { CorrectionData } from '@/lib/types'
import { EmptyState } from '@/components/EmptyState'
import { base64Decode, base64Encode, parseCorrectionFromURL } from '@/lib/correction-parser'
import { motion } from 'framer-motion'
import { DataInputPanel } from '@/components/DataInputPanel'

function App() {
  const [correctionData, setCorrectionData] = useState<CorrectionData | null>(parseCorrectionFromURL())
  const [showCorrected, setShowCorrected] = useState(false)
  const [rawPayload, setRawPayload] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search)
    const data = params.get('data')
    if (!data) return ''
    try {
      return base64Decode(data)
    } catch {
      return ''
    }
  })

  const headerContent = useMemo(() => {
    if (!correctionData) {
      return null
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.6 }}
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
            <div className="relative inline-flex items-center bg-muted rounded-full p-1 w-full md:w-auto">
              <button
                onClick={() => setShowCorrected(false)}
                className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex-1 md:flex-none ${
                  !showCorrected ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setShowCorrected(true)}
                className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex-1 md:flex-none ${
                  showCorrected ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Corrected
              </button>
              <div
                className="absolute top-1 bottom-1 bg-primary rounded-full shadow-lg transition-all duration-200"
                style={{
                  left: showCorrected ? '50%' : '0.25rem',
                  right: showCorrected ? '0.25rem' : '50%',
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    )
  }, [correctionData, showCorrected])

  const handleManualLoad = (data: CorrectionData, rawJson: string) => {
    setCorrectionData(data)
    setRawPayload(rawJson)
    setShowCorrected(false)

    try {
      const encoded = base64Encode(rawJson)
      const params = new URLSearchParams(window.location.search)
      params.set('data', encoded)
      const query = params.toString()
      const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname
      window.history.replaceState(null, '', newUrl)
    } catch (error) {
      console.error('Unable to sync URL with manual payload:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-12">
        <DataInputPanel initialValue={rawPayload} onDataLoaded={handleManualLoad} />

        {headerContent}

        {correctionData ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.15 }}
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.3 }}
              className="mt-4 md:mt-6 text-center"
            >
              <p className="text-xs md:text-sm text-muted-foreground">
                <span className="md:hidden">Tap highlighted words to see correction details</span>
                <span className="hidden md:inline">Hover over highlighted words to see correction details</span>
              </p>
            </motion.div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}

export default App