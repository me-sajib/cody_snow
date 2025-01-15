import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'

export interface Preset {
  id: string
  name: string
  avoidWords: string[]
  rhymeScheme: string | "ALL"
  avoidThemes: string[]
  isPublic: boolean
  artistSpecific: string
  slangWords?: string[]
}

export function YourPresets({ searchTerm = '', presets = [] }: { searchTerm?: string, presets: Preset[] }) {
  const [yourPresets, setYourPresets] = useState<Preset[]>(presets)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null)
  const [newPreset, setNewPreset] = useState<Omit<Preset, 'id'>>({
    name: '',
    avoidWords: [],
    rhymeScheme: 'ALL',
    avoidThemes: [],
    isPublic: false,
    artistSpecific: '',
    slangWords: undefined
  })

  const filteredPresets = yourPresets.filter(preset =>
    preset.name.toLowerCase().includes((searchTerm || '').toLowerCase())
  )

  const handleCreatePreset = () => {
    const preset: Preset = {
      ...newPreset,
      id: Date.now().toString(),
      avoidWords: newPreset.avoidWords.length > 0 ? newPreset.avoidWords : [],
      avoidThemes: newPreset.avoidThemes.length > 0 ? newPreset.avoidThemes : [],
      slangWords: newPreset.slangWords && newPreset.slangWords.length > 0 ? newPreset.slangWords : undefined
    }
    setYourPresets([...yourPresets, preset])
    setIsCreateOpen(false)
    setNewPreset({
      name: '',
      avoidWords: [],
      rhymeScheme: 'ALL',
      avoidThemes: [],
      isPublic: false,
      artistSpecific: '',
      slangWords: undefined
    })
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const handleEditPreset = () => {
    if (editingPreset) {
      setYourPresets(yourPresets.map(p => p.id === editingPreset.id ? editingPreset : p))
      setIsEditOpen(false)
      setEditingPreset(null)
    }
  }

  const handleDeletePreset = (id: string) => {
    setYourPresets(yourPresets.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Presets</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <FaPlus className="mr-2" />
              Create New Preset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Preset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="preset-name">Preset Name 🏷️</Label>
                <Input
                  id="preset-name"
                  value={newPreset.name}
                  onChange={(e) => setNewPreset({ ...newPreset, name: e.target.value })}
                  placeholder="My Awesome Preset 🎵"
                />
              </div>
              <div>
                <Label htmlFor="avoid-words">Avoid Words 🚫</Label>
                <Input
                  id="avoid-words"
                  value={newPreset.avoidWords.join(', ')}
                  onChange={(e) => setNewPreset({ ...newPreset, avoidWords: e.target.value.split(',').map(w => w.trim()) })}
                  placeholder="love, hate, etc."
                />
              </div>
              <div>
                <Label htmlFor="rhyme-scheme">Rhyme Scheme 🎭</Label>
                <Select
                  id="rhyme-scheme"
                  value={newPreset.rhymeScheme}
                  onValueChange={(value) => setNewPreset({ ...newPreset, rhymeScheme: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a rhyme scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Rhyme Schemes</SelectItem>
                    <SelectItem value="AABB">AABB - Pairs of rhyming lines</SelectItem>
                    <SelectItem value="ABAB">ABAB - Alternating rhyme</SelectItem>
                    <SelectItem value="ABBA">ABBA - Enclosed rhyme</SelectItem>
                    <SelectItem value="ABCB">ABCB - Ballad stanza</SelectItem>
                    <SelectItem value="AAAA">AAAA - Monorhyme</SelectItem>
                    <SelectItem value="ABCD">ABCD - No rhyme (free verse)</SelectItem>
                    <SelectItem value="ABABCC">ABABCC - Quatrain + Couplet</SelectItem>
                    <SelectItem value="ABCB DEFE">ABCB DEFE - Ballad (8 lines)</SelectItem>
                    <SelectItem value="ABABCDCD">ABABCDCD - Octave</SelectItem>
                    <SelectItem value="ABACACAB">ABACACAB - Triolet</SelectItem>
                    <SelectItem value="ABABBCBC">ABABBCBC - Ottava Rima</SelectItem>
                    <SelectItem value="ABCABCABC">ABCABCABC - Terza Rima</SelectItem>
                    <SelectItem value="ABABCDECDE">ABABCDECDE - Dizain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="avoid-themes">Avoid Themes 🎨</Label>
                <Input
                  id="avoid-themes"
                  value={newPreset.avoidThemes.join(', ')}
                  onChange={(e) => setNewPreset({ ...newPreset, avoidThemes: e.target.value.split(',').map(t => t.trim()) })}
                  placeholder="breakup, war, etc."
                />
              </div>
              <div>
                <Label htmlFor="artist-specific">Artist Specific (optional) 🎤</Label>
                <Input
                  id="artist-specific"
                  value={newPreset.artistSpecific}
                  onChange={(e) => setNewPreset({ ...newPreset, artistSpecific: e.target.value })}
                  placeholder="Enter artist name if this preset is for a specific artist"
                />
              </div>
              <div>
                <Label htmlFor="slang-words">Artist Slang / Common Words 🗣️ (Optional)</Label>
                <Input
                  id="slang-words"
                  value={newPreset.slangWords ? newPreset.slangWords.join(', ') : ''}
                  onChange={(e) => setNewPreset({ ...newPreset, slangWords: e.target.value ? e.target.value.split(',').map(w => w.trim()) : undefined })}
                  placeholder="yo, fam, lit, etc."
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="preset-public"
                  checked={newPreset.isPublic}
                  onCheckedChange={(checked) => setNewPreset({ ...newPreset, isPublic: checked })}
                />
                <Label htmlFor="preset-public">Make Preset Public 🌍</Label>
              </div>
              <Button onClick={handleCreatePreset} className="w-full create-preset-button">
                <Sparkles className="mr-2 h-4 w-4" />
                Create Preset ✨
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPresets.map((preset) => (
          <Card key={preset.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {preset.name}
                <div className="space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => {
                    setEditingPreset(preset)
                    setIsEditOpen(true)
                  }}>
                    <FaEdit />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeletePreset(preset.id)}>
                    <FaTrash />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TruncatedList title="Avoid Words" items={preset.avoidWords} />
              <p><strong>Rhyme Scheme:</strong> {preset.rhymeScheme}</p>
              <TruncatedList title="Avoid Themes" items={preset.avoidThemes} />
              {preset.artistSpecific && <p><strong>Artist Specific:</strong> {preset.artistSpecific}</p>}
              {preset.slangWords && preset.slangWords.length > 0 && (
                <TruncatedList title="Slang Words" items={preset.slangWords} />
              )}
              <p><strong>Public:</strong> {preset.isPublic ? 'Yes' : 'No'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Preset</DialogTitle>
          </DialogHeader>
          {editingPreset && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-preset-name">Preset Name 🏷️</Label>
                <Input
                  id="edit-preset-name"
                  value={editingPreset.name}
                  onChange={(e) => setEditingPreset({ ...editingPreset, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-avoid-words">Avoid Words 🚫</Label>
                <Input
                  id="edit-avoid-words"
                  value={editingPreset.avoidWords.join(', ')}
                  onChange={(e) => setEditingPreset({ ...editingPreset, avoidWords: e.target.value.split(',').map(w => w.trim()) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-rhyme-scheme">Rhyme Scheme 🎭</Label>
                <Select
                  id="edit-rhyme-scheme"
                  value={editingPreset.rhymeScheme}
                  onValueChange={(value) => setEditingPreset({ ...editingPreset, rhymeScheme: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a rhyme scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Rhyme Schemes</SelectItem>
                    <SelectItem value="AABB">AABB - Pairs of rhyming lines</SelectItem>
                    <SelectItem value="ABAB">ABAB - Alternating rhyme</SelectItem>
                    <SelectItem value="ABBA">ABBA - Enclosed rhyme</SelectItem>
                    <SelectItem value="ABCB">ABCB - Ballad stanza</SelectItem>
                    <SelectItem value="AAAA">AAAA - Monorhyme</SelectItem>
                    <SelectItem value="ABCD">ABCD - No rhyme (free verse)</SelectItem>
                    <SelectItem value="ABABCC">ABABCC - Quatrain + Couplet</SelectItem>
                    <SelectItem value="ABCB DEFE">ABCB DEFE - Ballad (8 lines)</SelectItem>
                    <SelectItem value="ABABCDCD">ABABCDCD - Octave</SelectItem>
                    <SelectItem value="ABACACAB">ABACACAB - Triolet</SelectItem>
                    <SelectItem value="ABABBCBC">ABABBCBC - Ottava Rima</SelectItem>
                    <SelectItem value="ABCABCABC">ABCABCABC - Terza Rima</SelectItem>
                    <SelectItem value="ABABCDECDE">ABABCDECDE - Dizain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-avoid-themes">Avoid Themes 🎨</Label>
                <Input
                  id="edit-avoid-themes"
                  value={editingPreset.avoidThemes.join(', ')}
                  onChange={(e) => setEditingPreset({ ...editingPreset, avoidThemes: e.target.value.split(',').map(t => t.trim()) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-artist-specific">Artist Specific (optional) 🎤</Label>
                <Input
                  id="edit-artist-specific"
                  value={editingPreset.artistSpecific}
                  onChange={(e) => setEditingPreset({ ...editingPreset, artistSpecific: e.target.value })}
                  placeholder="Enter artist name if this preset is for a specific artist"
                />
              </div>
              <div>
                <Label htmlFor="edit-slang-words">Artist Slang / Common Words 🗣️ (Optional)</Label>
                <Input
                  id="edit-slang-words"
                  value={editingPreset.slangWords ? editingPreset.slangWords.join(', ') : ''}
                  onChange={(e) => setEditingPreset({ ...editingPreset, slangWords: e.target.value ? e.target.value.split(',').map(w => w.trim()) : undefined })}
                  placeholder="yo, fam, lit, etc."
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-preset-public"
                  checked={editingPreset.isPublic}
                  onCheckedChange={(checked) => setEditingPreset({ ...editingPreset, isPublic: checked })}
                />
                <Label htmlFor="edit-preset-public">Make Preset Public 🌍</Label>
              </div>
              <Button onClick={handleEditPreset}>Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

const TruncatedList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const maxItems = 3;

  if (items.length === 0) return null;

  return (
    <div>
      <strong>{title}:</strong>{' '}
      {items.slice(0, maxItems).join(', ')}
      {items.length > maxItems && (
        <>
          ...
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
              >
                Show more
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                {items.join(', ')}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

