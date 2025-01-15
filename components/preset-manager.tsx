import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export interface Preset {
  id: string
  name: string
  avoidWords: string[]
  rhymeScheme: string
  avoidThemes: string[]
  isPublic: boolean
}

export function PresetManager() {
  const [presets, setPresets] = useState<Preset[]>([])
  const [newPreset, setNewPreset] = useState<Omit<Preset, 'id'>>({
    name: '',
    avoidWords: [],
    rhymeScheme: '',
    avoidThemes: [],
    isPublic: false
  })

  const handleCreatePreset = () => {
    const preset: Preset = {
      ...newPreset,
      id: Date.now().toString()
    }
    setPresets([...presets, preset])
    setNewPreset({
      name: '',
      avoidWords: [],
      rhymeScheme: '',
      avoidThemes: [],
      isPublic: false
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Manage Presets</h2>
      <div className="space-y-2">
        <Input
          placeholder="Preset Name"
          value={newPreset.name}
          onChange={(e) => setNewPreset({ ...newPreset, name: e.target.value })}
        />
        <Input
          placeholder="Avoid Words (comma-separated)"
          value={newPreset.avoidWords.join(', ')}
          onChange={(e) => setNewPreset({ ...newPreset, avoidWords: e.target.value.split(',').map(w => w.trim()) })}
        />
        <Input
          placeholder="Rhyme Scheme (e.g., AABB, ABAB)"
          value={newPreset.rhymeScheme}
          onChange={(e) => setNewPreset({ ...newPreset, rhymeScheme: e.target.value })}
        />
        <Textarea
          placeholder="Avoid Themes (comma-separated)"
          value={newPreset.avoidThemes.join(', ')}
          onChange={(e) => setNewPreset({ ...newPreset, avoidThemes: e.target.value.split(',').map(t => t.trim()) })}
        />
        <div className="flex items-center space-x-2">
          <Switch
            id="preset-public"
            checked={newPreset.isPublic}
            onCheckedChange={(checked) => setNewPreset({ ...newPreset, isPublic: checked })}
          />
          <Label htmlFor="preset-public">Make Preset Public</Label>
        </div>
        <Button onClick={handleCreatePreset}>Create Preset</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Your Presets</h3>
        {presets.map((preset) => (
          <div key={preset.id} className="p-2 border rounded">
            <h4 className="font-medium">{preset.name}</h4>
            <p>Avoid Words: {preset.avoidWords.join(', ')}</p>
            <p>Rhyme Scheme: {preset.rhymeScheme}</p>
            <p>Avoid Themes: {preset.avoidThemes.join(', ')}</p>
            <p>Public: {preset.isPublic ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

