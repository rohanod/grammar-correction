import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info, ArrowRight } from '@phosphor-icons/react'
import { generateExampleURL } from '@/lib/correction-parser'
import { motion } from 'framer-motion'
import { URLGenerator } from '@/components/URLGenerator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function EmptyState() {
  const handleTryExample = () => {
    window.location.href = generateExampleURL()
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="p-6 md:p-8 shadow-xl rounded-xl">
          <div className="flex flex-col items-center gap-4 md:gap-6 text-center mb-6">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Info size={28} weight="duotone" className="text-primary md:w-8 md:h-8" />
            </div>
            
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Grammar Correction Viewer</h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Display and analyze grammar corrections at the word level
              </p>
            </div>
          </div>

          <Tabs defaultValue="quick-start" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
              <TabsTrigger value="generator">URL Generator</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quick-start" className="space-y-4">
              <Alert className="text-left bg-accent/10 border-accent/20 rounded-lg">
                <AlertDescription className="text-xs md:text-sm leading-relaxed">
                  <div className="font-medium mb-2">How to use:</div>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Create a JSON object with original text, corrected text, and corrections</li>
                    <li>Base64 encode the JSON and pass it as a URL parameter</li>
                    <li>Format: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">?data=&lt;base64&gt;</code></li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="flex flex-col gap-3 w-full">
                <Button 
                  onClick={handleTryExample} 
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md rounded-lg"
                >
                  Try Example
                  <ArrowRight size={20} weight="bold" className="ml-2" />
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  Click to see a sample correction in action
                </p>
              </div>

              <div className="mt-2 md:mt-4 p-3 md:p-4 bg-muted/30 rounded-lg w-full">
                <p className="text-xs font-medium text-foreground mb-2">Expected JSON structure:</p>
                <pre className="text-left text-[10px] md:text-xs text-muted-foreground overflow-x-auto">
{`{
  "original": "Text with errors",
  "corrected": "Text with corrections",
  "corrections": [
    {
      "type": "grammar",
      "original": "wrong",
      "corrected": "right",
      "position": 0,
      "reason": "Explanation"
    }
  ]
}`}
                </pre>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-2">
                  Base64 encode this JSON and pass as <code className="bg-muted px-1 py-0.5 rounded">?data=...</code>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="generator">
              <URLGenerator />
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  )
}
