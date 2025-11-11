import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Check } from '@phosphor-icons/react'
import { generateCorrectionURL } from '@/lib/correction-parser'
import { toast } from 'sonner'

export function URLGenerator() {
  const [jsonInput, setJsonInput] = useState('')
  const [generatedURL, setGeneratedURL] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    try {
      const data = JSON.parse(jsonInput)
      
      if (!data.original || !data.corrected || !Array.isArray(data.corrections)) {
        toast.error('Invalid format: Must include "original", "corrected", and "corrections" array')
        return
      }
      
      const url = generateCorrectionURL(data)
      setGeneratedURL(url)
      toast.success('URL generated successfully!')
    } catch (error) {
      toast.error('Invalid JSON format')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedURL)
    setCopied(true)
    toast.success('URL copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const exampleJSON = `{
  "original": "helo world",
  "corrected": "Hello world",
  "corrections": [
    {
      "type": "spelling",
      "original": "helo",
      "corrected": "Hello",
      "position": 0,
      "reason": "Spelling error"
    }
  ]
}`

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Generate Correction URL</h3>
        <p className="text-sm text-muted-foreground">
          Paste your JSON data below to generate a shareable URL
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">JSON Input</label>
        <Textarea
          placeholder={exampleJSON}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="font-mono text-xs min-h-[200px]"
        />
      </div>

      <Button onClick={handleGenerate} className="w-full">
        Generate URL
      </Button>

      {generatedURL && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Generated URL</label>
          <div className="flex gap-2">
            <Textarea
              value={generatedURL}
              readOnly
              className="font-mono text-xs flex-1"
              rows={3}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? <Check size={16} weight="bold" /> : <Copy size={16} />}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
