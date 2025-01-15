"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Play, Download, ThumbsUp, ThumbsDown, X, Settings2, Loader2 } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Zap } from 'lucide-react'

interface AIStemsProps {
  isPremium: boolean;
  onUpgradeToPremium: () => void;
}

interface ProcessedTrack {
  name: string;
  date: string;
  key: string;
  bpm: number;
  stems: {
    type: 'main vocals' | 'backing vocals' | 'instrumental' | 'vocals' | 'bass' | 'drums' | 'other';
    waveformData: number[];
  }[];
}

export function AIStems({ isPremium, onUpgradeToPremium }: AIStemsProps) {
  const [activeTab, setActiveTab] = useState<'vocal-remover' | 'stem-splitter'>('vocal-remover')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [options, setOptions] = useState({
    mainVocals: true,
    backingVocals: false,
    instrumental: true
  })
  const [processedTracks, setProcessedTracks] = useState<ProcessedTrack[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedTrack, setUploadedTrack] = useState<{
    name: string;
    waveformData: number[];
  } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate file upload
      for (let i = 0; i <= 100; i++) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      setIsUploading(false)
      await generateWaveform(file)
    }
  }

  const generateWaveform = async (file: File) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const reader = new FileReader()

    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      const channelData = audioBuffer.getChannelData(0)
      const samples = 100
      const blockSize = Math.floor(channelData.length / samples)
      const waveformData = []

      for (let i = 0; i < samples; i++) {
        const start = i * blockSize
        const end = start + blockSize
        let max = 0
        for (let j = start; j < end; j++) {
          const amplitude = Math.abs(channelData[j])
          if (amplitude > max) {
            max = amplitude
          }
        }
        waveformData.push(max)
      }

      setUploadedTrack({
        name: file.name,
        waveformData: waveformData
      });
    }

    reader.readAsArrayBuffer(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleProcess = async () => {
    if (selectedFile) {
      // Simulate processing
      const newTrack: ProcessedTrack = {
        name: selectedFile.name,
        date: 'Just now',
        key: 'B♭maj',
        bpm: 94,
        stems: []
      }

      if (options.mainVocals) {
        newTrack.stems.push({ type: 'main vocals', waveformData: Array.from({ length: 100 }, () => Math.random()) });
      }
      if (options.backingVocals) {
        newTrack.stems.push({ type: 'backing vocals', waveformData: Array.from({ length: 100 }, () => Math.random()) });
      }
      if (options.instrumental) {
        newTrack.stems.push({ type: 'instrumental', waveformData: Array.from({ length: 100 }, () => Math.random()) });
      }

      setProcessedTracks([newTrack, ...processedTracks])
      setSelectedFile(null)
      setUploadedTrack(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (!isPremium) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">AI Stems</h2>
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Layers className="h-12 w-12 text-pink-600" />
            <h3 className="text-xl font-semibold">Premium Feature: AI Stems</h3>
            <p className="text-center text-muted-foreground max-w-md">
              Upgrade to Premium to access AI Stems and split your tracks into individual components with advanced precision.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>Split all instruments (drums, bass, guitar, etc.)</li>
              <li>Isolate background vocals from main vocals</li>
              <li>Separate reverb and effects from vocals</li>
              <li>Extract individual stem components for remixing</li>
            </ul>
            <Button onClick={onUpgradeToPremium} className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white">
              <Zap className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 container mx-auto max-w-5xl px-4">
      <Tabs defaultValue="vocal-remover" className="w-full">
        <TabsList>
          <TabsTrigger value="vocal-remover" onClick={() => setActiveTab('vocal-remover')}>
            Vocal remover
          </TabsTrigger>
          <TabsTrigger value="stem-splitter" onClick={() => setActiveTab('stem-splitter')}>
            Stem splitter
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {activeTab === 'vocal-remover' ? 'Vocal remover' : 'Stem splitter'}
          </h2>
          <p className="text-muted-foreground">
            {activeTab === 'vocal-remover' 
              ? 'The CodyAI Vocal Remover is a multipurpose tool for isolating and cleaning vocals. Separate out vocals from instrumentals, separate backing vocals, and remove reverb and noise — all in one place.'
              : 'Start with a full track. Split it into four stems: vocals, drums, bass, and instruments.'}
          </p>
        </div>

        <div
          className="border border-dashed rounded-lg aspect-[2/1] flex flex-col items-center justify-center hover:border-primary/50 transition-colors relative"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="audio/*"
            onChange={handleFileUpload}
            ref={fileInputRef}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="h-8 w-8 text-primary" />
            <span className="text-lg font-medium">Add or drop a file</span>
            <span className="text-sm text-muted-foreground">
              {activeTab === 'vocal-remover' 
                ? 'Click and browse, or drag and drop here'
                : 'Add track to split stems'}
            </span>
          </label>
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 flex items-center justify-center"
              >
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Uploading... {uploadProgress}%</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {selectedFile && uploadedTrack && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted rounded-lg p-4 flex items-center gap-4"
          >
            <Button variant="ghost" size="icon" className="shrink-0">
              <Play className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm">{selectedFile.name}</p>
              <div className="h-8 mt-2">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 0.3 }} />
                      <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.1 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 0 50 ${uploadedTrack.waveformData.map((point, i) => 
                      `L ${i} ${50 - point * 40} L ${i} ${50 + point * 40}`
                    ).join(' ')} L 100 50 Z`}
                    fill="url(#waveformGradient)"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="shrink-0"
              onClick={() => {
                setSelectedFile(null);
                setUploadedTrack(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {activeTab === 'vocal-remover' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              >
                <Settings2 className="h-4 w-4" />
                OPTIONS
              </Button>
              <AnimatePresence>
                {isOptionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bg-background border rounded-lg p-4 shadow-lg space-y-4 mt-2 z-50 right-0 w-80"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="main-vocals">Main Vocals</Label>
                        <p className="text-sm text-muted-foreground">Extract the main vocal track</p>
                      </div>
                      <Switch
                        id="main-vocals"
                        checked={options.mainVocals}
                        onCheckedChange={(checked) => setOptions({ ...options, mainVocals: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="backing-vocals">Backing Vocals/Harmony</Label>
                        <p className="text-sm text-muted-foreground">Extract backing vocals and harmonies</p>
                      </div>
                      <Switch
                        id="backing-vocals"
                        checked={options.backingVocals}
                        onCheckedChange={(checked) => setOptions({ ...options, backingVocals: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="instrumental">Instrumental</Label>
                        <p className="text-sm text-muted-foreground">Extract the instrumental track</p>
                      </div>
                      <Switch
                        id="instrumental"
                        checked={options.instrumental}
                        onCheckedChange={(checked) => setOptions({ ...options, instrumental: checked })}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex justify-between">
              <Button variant="outline">RESET</Button>
              <Button onClick={handleProcess}>SPLIT VOCALS</Button>
            </div>
          </div>
        )}

        {activeTab === 'stem-splitter' && (
          <div className="flex justify-between">
            <Button variant="outline">RESET</Button>
            <Button onClick={handleProcess}>SPLIT STEMS</Button>
          </div>
        )}

        {processedTracks.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Output</h3>
            {processedTracks.map((track, trackIndex) => (
              <div key={trackIndex} className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{activeTab === 'vocal-remover' ? 'Vocal remover' : 'Stem splitter'}</span>
                  <span>•</span>
                  <span>Created {track.date}</span>
                </div>
                <Card className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{track.name}</span>
                    <div className="flex items-center gap-2">
                      <span>KEY {track.key}</span>
                      <span>BPM {track.bpm}</span>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {track.stems.map((stem, stemIndex) => (
                      <div key={stemIndex} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="uppercase">{stem.type}</span>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="h-12 bg-muted rounded-md overflow-hidden">
                          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id={`waveformGradient-${stemIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 0.3 }} />
                                <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.1 }} />
                              </linearGradient>
                            </defs>
                            <path
                              d={`M 0 50 ${stem.waveformData.map((point, i) => 
                                `L ${i} ${50 - point * 40} L ${i} ${50 + point * 40}`
                              ).join(' ')} L 100 50 Z`}
                              fill={`url(#waveformGradient-${stemIndex})`}
                              stroke="currentColor"
                              strokeWidth="0.5"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <Button variant="outline" className="w-full">
                      DOWNLOAD .ZIP
                    </Button>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-muted-foreground">How did that sound?</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

