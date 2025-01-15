import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, X } from 'lucide-react'
import { HelpCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function RequestArtist() {
  const [isOpen, setIsOpen] = useState(false)
  const [geniusLinks, setGeniusLinks] = useState(['', ''])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle form submission logic here, including geniusLinks
    console.log('Genius Links:', geniusLinks)
    setIsOpen(false)
    setGeniusLinks(['', '']) // Reset to initial state after submission
  }

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>Request a New Artist</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Request Artist</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle>Request a New Artist</DialogTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Tutorial</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Artist Name: Enter the name of the artist you want to add.</p>
                    <p>Description: Provide a brief description of the artist's style (max 45 characters).</p>
                    <p>Profile Picture URL: Add a link to the artist's image.</p>
                    <p>Genius Lyrics Links: These help train the AI to mimic the artist's style.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="artistName">Artist Name</Label>
                <Input id="artistName" placeholder="Enter artist name" required className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the artist" 
                  required 
                  className="min-h-[100px]" 
                  maxLength={45}
                />
                <p className="text-sm text-muted-foreground">Max 45 characters</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profilePicture">Profile Picture URL</Label>
                <Input id="profilePicture" type="url" placeholder="https://example.com/artist-image.jpg" required className="w-full" />
              </div>
              <div className="space-y-2">
                <Label>Genius Lyrics Links</Label>
                <div className="space-y-2">
                  {geniusLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="url"
                        placeholder={`Genius Lyrics Link ${index + 1}`}
                        value={link}
                        onChange={(e) => {
                          const newLinks = [...geniusLinks];
                          newLinks[index] = e.target.value;
                          setGeniusLinks(newLinks);
                        }}
                        required
                        className="w-full"
                      />
                      {index > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setGeniusLinks(geniusLinks.filter((_, i) => i !== index))}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setGeniusLinks([...geniusLinks, ''])}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add More Genius Links
                </Button>
              </div>
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

