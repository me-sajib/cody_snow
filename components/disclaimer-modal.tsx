import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info } from 'lucide-react'

export function DisclaimerModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5" />
          <span className="sr-only">Disclaimer</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disclaimer</DialogTitle>
          <DialogDescription>
            This AI Lyric Generator is not affiliated with, endorsed by, or connected to any artists mentioned or featured on this website. 
            All artist names and likenesses are used for demonstration purposes only.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI Lyric Generator by Cody Productions. All rights reserved.
        </p>
      </DialogContent>
    </Dialog>
  )
}

