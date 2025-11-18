import { FormEvent, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { base64Encode } from '@/lib/correction-parser'

export function PayloadInputPage() {
  const navigate = useNavigate()
  const [jsonInput, setJsonInput] = useState('')
  const [base64Input, setBase64Input] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [base64Error, setBase64Error] = useState('')
  const [base64Preview, setBase64Preview] = useState('')

  const handleJsonSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setJsonError('')

    try {
      const parsed = JSON.parse(jsonInput)
      if (typeof parsed !== 'object' || parsed === null || typeof parsed.text !== 'string') {
        throw new Error('JSON must contain a "text" field')
      }

      const encoded = base64Encode(JSON.stringify(parsed))
      const params = new URLSearchParams({ data: encoded })
      navigate(`/docs?${params.toString()}`)
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Unable to parse JSON payload')
    }
  }

  useEffect(() => {
    const trimmed = base64Input.trim()
    if (!trimmed) {
      setBase64Preview('')
      return
    }

    try {
      const decoded = atob(trimmed)
      try {
        const parsed = JSON.parse(decoded)
        setBase64Preview(JSON.stringify(parsed, null, 2))
      } catch {
        setBase64Preview(decoded)
      }
    } catch {
      setBase64Preview('Invalid base64 input')
    }
  }, [base64Input])

  const handleBase64Submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBase64Error('')

    const trimmed = base64Input.trim()
    if (!trimmed) {
      setBase64Error('Enter a base64 string to continue')
      return
    }

    const params = new URLSearchParams({ data: trimmed })
    navigate(`/docs?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 md:py-16 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 text-center"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-[0.2em]">Payload Builder</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Input JSON or base64 to see corrections</h1>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Paste inline correction JSON to open the viewer, or use a base64-encoded payload if you already have one ready.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="text-muted-foreground">Don't know how to use this?</span>
            <Button variant="outline" asChild size="sm">
              <Link to="/docs">Go to docs</Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleJsonSubmit}
          >
            <Card className="p-6 h-full flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-semibold">Plain JSON payload</h2>
                <p className="text-sm text-muted-foreground space-y-1">
                  <span className="block">Paste your inline correction JSON directly.</span>
                  <span className="block">Enter a base64 payload to decode and continue to the viewer.</span>
                </p>
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="json-payload">Payload</Label>
                <Textarea
                  id="json-payload"
                  className="min-h-[280px] font-mono text-sm"
                  value={jsonInput}
                  onChange={(event) => setJsonInput(event.target.value)}
                />
                {jsonError && <p className="text-sm text-destructive">{jsonError}</p>}
              </div>
              <Button type="submit" className="w-full">View corrections</Button>
            </Card>
          </motion.form>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleBase64Submit}
          >
            <Card className="p-6 h-full flex flex-col gap-5">
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-semibold">Base64 payload</h2>
                  <p className="text-sm text-muted-foreground">Paste the value you would pass to <code>?data=</code> and go straight to the viewer.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base64-payload">Base64 string</Label>
                  <Textarea
                    id="base64-payload"
                    className="min-h-[200px] font-mono text-sm"
                    value={base64Input}
                    onChange={(event) => setBase64Input(event.target.value)}
                    placeholder="eyJ0ZXh0Ijog..."
                  />
                  {base64Error && <p className="text-sm text-destructive">{base64Error}</p>}
                </div>
                <Alert>
                  <AlertDescription className="text-sm">
                    {base64Preview ? 'Decoded preview:' : 'Decoded content will appear here.'}
                  </AlertDescription>
                </Alert>
                {base64Preview && (
                  <pre className="bg-muted text-xs text-left p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {base64Preview}
                  </pre>
                )}
                <Button type="submit" variant="secondary" className="w-full">View corrections</Button>
              </div>
            </Card>
          </motion.form>
        </div>
      </div>
    </div>
  )
}
