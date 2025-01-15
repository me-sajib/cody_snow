"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Upload, Wand2, Play, Download, ThumbsUp, ThumbsDown, Loader2, X } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AIMasteringProps {
  isPremium: boolean;
  onUpgradeToPremium: () => void;
}

const presets = [
  { id: 'crystal-clear', name: 'Crystal Clear' },
  { id: 'deep-impact', name: 'Deep Impact' },
  { id: 'dynamic-air', name: 'Dynamic Air' },
  { id: 'silky-smooth', name: 'Silky Smooth' },
  { id: 'vintage-glue', name: 'Vintage Glue' },
  { id: 'warm-embrace', name: 'Warm Embrace' },
]

interface MasteredTrack {
  name: string;
  originalFile: string;
  date: string;
  preset: string;
  waveformData?: number[];
}

export function AIMastering({ isPremium, onUpgradeToPremium }: AIMasteringProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isMastering, setIsMastering] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [masteringProgress, setMasteringProgress] = useState(0)
  
  const [currentMasteredTracks, setCurrentMasteredTracks] = useState<MasteredTrack[]>([])
  const [previousMasteredTracks, setPreviousMasteredTracks] = useState<MasteredTrack[]>([])

  const [uploadedTrack, setUploadedTrack] = useState<{
    name: string;
    waveformData: number[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
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

  const handleMaster = async () => {
    if (selectedFile && selectedPreset && uploadedTrack) {
      setIsMastering(true)
      setMasteringProgress(0)

      // Simulate mastering process
      for (let i = 0; i <= 100; i++) {
        setMasteringProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const masteredTrack: MasteredTrack = {
        name: `mastered_${selectedFile.name}`,
        originalFile: selectedFile.name,
        date: 'Just now',
        preset: presets.find(p => p.id === selectedPreset)?.name || 'Unknown',
        waveformData: uploadedTrack.waveformData,
      }

      setCurrentMasteredTracks([masteredTrack, ...currentMasteredTracks])
      setUploadedTrack(null);
      setIsMastering(false)
      setSelectedFile(null)
      setSelectedPreset(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (!isPremium) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">AI Mastering</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Wand2 className="h-12 w-12 text-blue-400" />
              <h3 className="text-xl font-semibold">Premium Feature: AI Mastering</h3>
              <p className="text-center text-muted-foreground max-w-md">
                Upgrade to Premium to access AI Mastering and transform your tracks with professional-grade sound quality and advanced features.
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Mimic mastering styles of any reference audio</li>
                <li>Dramatically improve overall sound quality</li>
                <li>Change the entire vibe of your songs</li>
                <li>Enhance clarity, depth, and dynamics</li>
                <li>Experiment with our custom mastering styles</li>
              </ul>
              <Button onClick={onUpgradeToPremium} className="bg-gradient-to-r from-blue-400 to-pink-600 hover:from-blue-500 hover:to-pink-700 text-white">
                <Wand2 className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 container mx-auto max-w-5xl px-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2">AI mastering</h2>
          <p className="text-muted-foreground">
            Upload your track, select one of our presets or upload a reference track, and press "Master" to finalize your track.
          </p>
        </div>
        <Collapsible>
          <CollapsibleTrigger className="flex items-center text-muted-foreground hover:text-foreground">
            File upload guide
            <ChevronDown className="h-4 w-4 ml-2" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 bg-card p-4 rounded-lg space-y-2">
            <p>1. Upload an unmastered track (keep peaks around -6 to -3db)</p>
            <p>2. Select a preset or add your own reference audio</p>
            <p>3. Preview & download your mastered track</p>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Add Track to Master</h3>
          <div
            className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors relative"
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
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-lg font-medium">Drag and drop file or browse</span>
              <span className="text-sm text-muted-foreground">Max file size: 200 MB, Max file duration: 12 minutes</span>
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
          {selectedFile && (
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
                  {uploadedTrack?.waveformData && (
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path
                        d={`M 0 50 ${uploadedTrack.waveformData.map((point, i) => 
                          `L ${i} ${50 - point * 40} L ${i} ${50 + point * 40}`
                        ).join(' ')} L 100 50`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                      />
                    </svg>
                  )}
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
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Select mastering style</h3>
          <Tabs defaultValue="presets">
            <TabsList className="mb-4">
              <TabsTrigger value="presets">PRESETS</TabsTrigger>
              <TabsTrigger value="reference">REFERENCE TRACK</TabsTrigger>
            </TabsList>
            <TabsContent value="presets">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {presets.map((preset) => (
                  <Button
                    key={preset.id}
                    variant={selectedPreset === preset.id ? "default" : "outline"}
                    className="h-24 relative"
                    onClick={() => setSelectedPreset(preset.id)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reference">
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p>Drop a reference track here or click to browse</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => {
            setSelectedFile(null)
            setSelectedPreset(null)
            setUploadedTrack(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
          }}>RESET</Button>
          <Button
            disabled={!selectedFile || !selectedPreset || isMastering}
            onClick={handleMaster}
          >
            {isMastering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                MASTERING {masteringProgress}%
              </>
            ) : (
              'MASTER'
            )}
          </Button>
        </div>

        {currentMasteredTracks.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Current Session</h3>
            {currentMasteredTracks.map((track, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-card p-4 rounded-lg space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{track.name}</p>
                    <p className="text-sm text-muted-foreground">File: {track.originalFile} • {track.date}</p>
                    <p className="text-sm text-muted-foreground">Preset: {track.preset}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="h-24 bg-muted rounded-md overflow-hidden">
                  {track.waveformData && (
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path
                        d={`M 0 50 ${track.waveformData.map((point, i) => `L ${i} ${50 - point * 40} L ${i} ${50 + point * 40}`).join(' ')} L 100 50`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                      />
                    </svg>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <Tabs defaultValue="mastered" className="w-32">
                    <TabsList>
                      <TabsTrigger value="original">ORIGINAL</TabsTrigger>
                      <TabsTrigger value="mastered">MASTERED</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Improve your output:</span>
                    <Button variant="ghost" size="icon">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {previousMasteredTracks.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Previous Tracks</h3>
            {previousMasteredTracks.map((track, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-4 rounded-lg space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{track.name}</p>
                    <p className="text-sm text-muted-foreground">File: {track.originalFile} • {track.date}</p>
                    <p className="text-sm text-muted-foreground">Preset: {track.preset}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="h-24 bg-muted rounded-md overflow-hidden">
                  {track.waveformData && (
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path
                        d={`M 0 50 ${track.waveformData.map((point, i) => `L ${i} ${50 - point * 40} L ${i} ${50 + point * 40}`).join(' ')} L 100 50`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                      />
                    </svg>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <Tabs defaultValue="mastered" className="w-32">
                    <TabsList>
                      <TabsTrigger value="original">ORIGINAL</TabsTrigger>
                      <TabsTrigger value="mastered">MASTERED</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Improve your output:</span>
                    <Button variant="ghost" size="icon">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

