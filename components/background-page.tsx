import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

const systemBackgrounds = [
  { id: 'default', name: 'Default', url: 'none' },
  { id: 'nature', name: 'Nature', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&h=1080&q=80' },
  { id: 'cityscape', name: 'Cityscape', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&h=1080&q=80' },
  { id: 'abstract', name: 'Abstract', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1920&h=1080&q=80' },
]

export function BackgroundPage() {
  const [selectedBackground, setSelectedBackground] = useState('default')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [currentBackgroundUrl, setCurrentBackgroundUrl] = useState('none');

  const applyBackground = (url: string) => {
    const targetDiv = document.querySelector('.flex.h-screen.overflow-hidden.bg-gradient-to-br.from-background.to-secondary\\/20.relative');
    if (targetDiv) {
      if (url === 'none') {
        targetDiv.removeAttribute('style');
      } else {
        targetDiv.setAttribute('style', `background-image: url(${url}); background-size: cover; background-position: center; background-attachment: fixed;`);
      }
    }
    setCurrentBackgroundUrl(url);
    toast({
      title: "Background updated",
      description: `Background set to ${url === 'none' ? 'Default' : 'Custom image'}`,
    });
  }

  const handleBackgroundChange = (value: string) => {
    console.log('Background changed to:', value);
    setSelectedBackground(value);
    const selectedBg = systemBackgrounds.find(bg => bg.id === value);
    if (selectedBg) {
      applyBackground(selectedBg.url);
    } else if (value === 'custom' && uploadedImage) {
      applyBackground(uploadedImage);
    }
    toast({
      title: "Background updated",
      description: `Background set to ${value}`,
    });
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setUploadedImage(result)
        setSelectedBackground('custom')
        applyBackground(result)
        toast({
          title: "Custom background uploaded",
          description: "Your custom background has been set",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    console.log('Applying initial background');
    setCurrentBackgroundUrl('none'); // Set to 'none' for default gradient
  }, [])

  useEffect(() => {
    console.log('Selected background changed:', selectedBackground);
    const selectedBg = systemBackgrounds.find(bg => bg.id === selectedBackground);
    if (selectedBg) {
      applyBackground(selectedBg.url);
    } else if (selectedBackground === 'custom' && uploadedImage) {
      applyBackground(uploadedImage);
    }
  }, [selectedBackground, uploadedImage]);

  return (
    <motion.div
      className="space-y-4 min-h-screen p-4 bg-background text-foreground"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold">Background Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle>Choose a background</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedBackground}
            onValueChange={handleBackgroundChange}
            className="grid grid-cols-2 gap-4"
          >
            {systemBackgrounds.map((bg) => (
              <div key={bg.id} className="flex flex-col items-center space-y-2">
                <RadioGroupItem value={bg.id} id={bg.id} className="sr-only peer" />
                <Label
                  htmlFor={bg.id}
                  className="w-full h-40 rounded-lg border-2 cursor-pointer transition-all duration-200 ease-in-out"
                  style={{
                    borderColor: selectedBackground === bg.id ? 'hsl(var(--success))' : 'hsl(var(--border))',
                    borderWidth: selectedBackground === bg.id ? '4px' : '2px',
                  }}
                >
                  <div
                    className="w-full h-full rounded-lg"
                    style={{
                      backgroundColor: bg.id === 'default' ? 'forest' : 'initial',
                      backgroundImage: bg.id === 'default' ? 'none' : `url(${bg.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </Label>
                <Label htmlFor={bg.id}>{bg.name}</Label>
              </div>
            ))}
            {uploadedImage && (
              <div key="custom" className="flex flex-col items-center space-y-2">
                <RadioGroupItem value="custom" id="custom" className="sr-only" />
                <Label
                  htmlFor="custom"
                  className="w-full h-40 rounded-lg border-2 cursor-pointer transition-all duration-200 ease-in-out"
                  style={{
                    borderColor: selectedBackground === 'custom' ? 'hsl(var(--success))' : 'hsl(var(--border))',
                    borderWidth: selectedBackground === 'custom' ? '4px' : '2px',
                  }}
                >
                  <div
                    className="w-full h-full rounded-lg"
                    style={{
                      backgroundImage: `url(${uploadedImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </Label>
                <Label htmlFor="custom">Custom</Label>
              </div>
            )}
          </RadioGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upload custom background</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="cursor-pointer"
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

