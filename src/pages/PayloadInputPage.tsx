import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { base64Encode } from '@/lib/correction-parser'

export function PayloadInputPage() {
  const navigate = useNavigate()
  const [jsonInput, setJsonInput] = useState('')
  const [jsonError, setJsonError] = useState('')

  const handleJsonSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setJsonError('')

    const trimmed = jsonInput.trim()
    if (!trimmed) {
      setJsonError('Enter a JSON payload or base64-encoded JSON to continue')
      return
    }

    try {
      const parsed = JSON.parse(trimmed)
      if (typeof parsed !== 'object' || parsed === null || typeof parsed.text !== 'string') {
        throw new Error('JSON must contain a "text" field')
      }

      const encoded = base64Encode(JSON.stringify(parsed))
      const params = new URLSearchParams({ data: encoded })
      navigate(`/?${params.toString()}`)
      return
    } catch (jsonParseError) {
      try {
        const decoded = atob(trimmed)
        const parsed = JSON.parse(decoded)
        if (typeof parsed !== 'object' || parsed === null || typeof parsed.text !== 'string') {
          throw new Error('Decoded JSON must contain a "text" field')
        }

        const encoded = base64Encode(JSON.stringify(parsed))
        const params = new URLSearchParams({ data: encoded })
        navigate(`/?${params.toString()}`)
        return
      } catch (base64Error) {
        const errorMessage =
          base64Error instanceof Error && !base64Error.message.includes('atob')
            ? base64Error.message
            : jsonParseError instanceof Error
              ? jsonParseError.message
              : 'Enter a valid JSON payload or base64-encoded JSON'

        setJsonError(errorMessage)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 md:py-16 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 text-center"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-[0.2em]">Payload Builder</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Input JSON or base64 to see corrections</h1>
          <p className="text-muted-foreground text-base max-w-3xl mx-auto leading-relaxed">
            Paste inline correction JSON to open the viewer, or drop in base64-encoded JSON and we will decode it for you.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleJsonSubmit}
        >
          <Card className="p-8 md:p-10 h-full flex flex-col gap-6 shadow-xl border-border/60">
            <div className="flex flex-col gap-2 text-left">
              <h2 className="text-2xl font-semibold tracking-tight">Payload</h2>
              <p className="text-sm text-muted-foreground space-y-1 leading-relaxed">
                <span className="block">Paste your inline correction JSON directly.</span>
                <span className="block">Enter a base64 payload to decode and continue to the viewer.</span>
              </p>
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="json-payload" className="text-sm font-medium">Payload</Label>
                <span className="text-xs text-muted-foreground">Supports JSON or base64-encoded JSON</span>
              </div>
              <Textarea
                id="json-payload"
                className="min-h-[380px] md:min-h-[440px] font-mono text-sm md:text-base"
                value={jsonInput}
                onChange={(event) => setJsonInput(event.target.value)}
              />
              {jsonError && <p className="text-sm text-destructive">{jsonError}</p>}
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <Button type="submit" className="w-full sm:w-auto px-8">View corrections</Button>
            </div>
          </Card>
        </motion.form>
      </div>
    </div>
  )
}
