import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CorrectionData } from '@/lib/types'
import { base64Decode, parseInlineJSON } from '@/lib/correction-parser'

const EXAMPLE_JSON = `{
  "text": "The main message of Source A is  that The Treaty of Versailles should {{demilitaries-demilitarise|spelling|correct verb form}} {{germany-England|capitalization|proper noun}}."
}`

type InputMode = 'json' | 'base64'

interface DataInputPanelProps {
  initialValue?: string
  onDataLoaded: (data: CorrectionData, rawJson: string) => void
}

export function DataInputPanel({ initialValue, onDataLoaded }: DataInputPanelProps) {
  const [mode, setMode] = useState<InputMode>('json')
  const [value, setValue] = useState(initialValue?.trim().length ? initialValue : EXAMPLE_JSON)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialValue !== undefined) {
      setValue(initialValue.trim().length ? initialValue : EXAMPLE_JSON)
    }
  }, [initialValue])

  const helperText = useMemo(() => (
    mode === 'json'
      ? 'Paste inline text JSON directly. Example: { "text": "{{helo-Hello|spelling}}" }'
      : 'Paste the base64 string that you would normally pass through the ?data query parameter.'
  ), [mode])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) {
      setError('Please provide some input before loading the data.')
      setStatus('error')
      return
    }

    try {
      const rawJson = mode === 'json' ? trimmed : base64Decode(trimmed)
      const data = parseInlineJSON(rawJson)
      onDataLoaded(data, rawJson)
      setStatus('success')
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to parse the provided input.'
      setError(message)
      setStatus('error')
    }
  }

  const handleUseExample = () => {
    setValue(EXAMPLE_JSON)
    setMode('json')
    setStatus('idle')
    setError(null)
  }

  return (
    <Card className="p-4 md:p-6 mb-6 md:mb-8 shadow-xl border-primary/10 bg-white/80 backdrop-blur">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Provide correction data</h2>
            <p className="text-sm text-muted-foreground">
              Paste plain JSON directly or switch to base64 mode to reuse the query parameter payload.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-muted rounded-full p-1">
            <button
              type="button"
              onClick={() => setMode('json')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${mode === 'json' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Plain JSON
            </button>
            <button
              type="button"
              onClick={() => setMode('base64')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${mode === 'base64' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Base64
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="correction-input" className="text-xs uppercase tracking-wide text-muted-foreground">
            {mode === 'json' ? 'Inline JSON payload' : 'Base64 encoded payload'}
          </Label>
          <Textarea
            id="correction-input"
            value={value}
            onChange={event => {
              setValue(event.target.value)
              if (status !== 'idle') {
                setStatus('idle')
                setError(null)
              }
            }}
            className="font-mono text-xs md:text-sm min-h-[140px] resize-y"
            placeholder={EXAMPLE_JSON}
          />
          <p className="text-xs text-muted-foreground">{helperText}</p>
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {status === 'success' && !error && (
          <div className="text-sm text-emerald-600 bg-emerald-50 rounded-md px-3 py-2">
            Loaded correction data from the current input.
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3">
          <Button onClick={handleSubmit} className="flex-1 md:flex-none md:min-w-[160px]">
            Load correction data
          </Button>
          <Button type="button" variant="outline" onClick={handleUseExample} className="flex-1 md:flex-none">
            Use example JSON
          </Button>
        </div>
      </div>
    </Card>
  )
}
