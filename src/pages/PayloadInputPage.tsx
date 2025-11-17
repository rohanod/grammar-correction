import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { generateExampleURL, base64Encode } from '@/lib/correction-parser'

const exampleJson = JSON.stringify(
  {
    text: "The main message of Source A is  that The Treaty of Versailles should {{demilitaries-demilitarise|spelling|correct verb form}} {{germany-England|capitalization|proper noun}}."
  },
  null,
  2,
)

export function PayloadInputPage() {
  const navigate = useNavigate()
  const [jsonInput, setJsonInput] = useState(exampleJson)
  const [base64Input, setBase64Input] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [base64Error, setBase64Error] = useState('')

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

  const handleExample = () => {
    window.location.href = generateExampleURL()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 text-center"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-[0.2em]">Payload Builder</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Share corrections from plain JSON or base64</h1>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Paste your inline correction payload as JSON to create a shareable link automatically, or provide a base64 string
            when you already have the encoded data.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="text-muted-foreground">Looking for the viewer?</span>
            <Button variant="outline" asChild size="sm">
              <Link to="/docs">Go to docs</Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleJsonSubmit}
          >
            <Card className="p-5 h-full flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-semibold">Plain JSON payload</h2>
                <p className="text-sm text-muted-foreground">Paste your inline correction JSON directly.</p>
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="json-payload">Payload</Label>
                <Textarea
                  id="json-payload"
                  className="min-h-[240px] font-mono text-sm"
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
            <Card className="p-5 h-full flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-semibold">Base64 data parameter</h2>
                <p className="text-sm text-muted-foreground">Paste the value you normally pass to <code>?data=</code>.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="base64-payload">Base64 string</Label>
                <Input
                  id="base64-payload"
                  value={base64Input}
                  onChange={(event) => setBase64Input(event.target.value)}
                  placeholder="eyJ0ZXh0Ijog..."
                />
                {base64Error && <p className="text-sm text-destructive">{base64Error}</p>}
              </div>
              <Button type="submit" variant="secondary" className="w-full">Use base64 payload</Button>
              <Alert>
                <AlertDescription className="text-sm">
                  Both formats are first-class citizens — use whichever fits your workflow.
                </AlertDescription>
              </Alert>
              <Button type="button" variant="ghost" onClick={handleExample}>
                Load sample payload
              </Button>
            </Card>
          </motion.form>
        </div>
      </div>
    </div>
  )
}
