import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

type ErrorType = 'info' | 'warning' | 'error' | null

export function ErrorTestingPanel() {
  const [currentError, setCurrentError] = useState<ErrorType>(null)

  const triggerError = (type: ErrorType) => {
    setCurrentError(type)
  }

  const dismissError = () => {
    setCurrentError(null)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Error Testing Panel</h2>
      <div className="flex space-x-2">
        <Button onClick={() => triggerError('info')} variant="outline">Trigger Info</Button>
        <Button onClick={() => triggerError('warning')} variant="outline">Trigger Warning</Button>
        <Button onClick={() => triggerError('error')} variant="outline">Trigger Error</Button>
      </div>
      {currentError && (
        <Alert variant={currentError === 'info' ? 'default' : currentError}>
          {currentError === 'info' && <Info className="h-4 w-4" />}
          {currentError === 'warning' && <AlertTriangle className="h-4 w-4" />}
          {currentError === 'error' && <AlertCircle className="h-4 w-4" />}
          <AlertTitle className="capitalize">{currentError}</AlertTitle>
          <AlertDescription>
            This is a custom {currentError} message for testing purposes.
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={dismissError}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}
    </div>
  )
}

