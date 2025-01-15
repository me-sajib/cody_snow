import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | React.ReactNode;
}

export function LegalModal({ isOpen, onClose, title, content }: LegalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="prose dark:prose-invert">
            {typeof content === 'string'
              ? content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              : content}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

