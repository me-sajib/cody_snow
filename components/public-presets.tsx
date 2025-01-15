import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface PublicPreset {
 id: string
 name: string
 avoidWords: string[]
 rhymeScheme: string
 avoidThemes: string[]
 likes: number
 isLiked: boolean
 creator: string
 slangWords?: string[]
}

export function PublicPresets({ searchTerm = '', presets = [] }: { searchTerm?: string, presets: PublicPreset[] }) {
 const [publicPresets, setPublicPresets] = useState<PublicPreset[]>(presets)

 const filteredPublicPresets = publicPresets.filter(preset =>
   preset.name.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
   preset.creator.toLowerCase().includes((searchTerm || '').toLowerCase())
 )

 const handleLike = (id: string) => {
   setPublicPresets(publicPresets.map(preset => {
     if (preset.id === id) {
       return {
         ...preset,
         likes: preset.isLiked ? preset.likes - 1 : preset.likes + 1,
         isLiked: !preset.isLiked
       }
     }
     return preset
   }))
 }

 return (
   <div className="space-y-4">
     <h2 className="text-2xl font-bold">Public Presets</h2>
     <p className="text-sm text-muted-foreground mb-4">
       Disclaimer: Liking a preset will add it to your personal preset library.
     </p>
     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
       {filteredPublicPresets.map((preset) => (
         <Card key={preset.id}>
           <CardHeader>
             <CardTitle className="flex justify-between items-center">
               {preset.name}
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => handleLike(preset.id)}
               >
                 {preset.isLiked ? (
                   <FaHeart className="text-red-500" />
                 ) : (
                   <FaRegHeart />
                 )}
               </Button>
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p><strong>Creator:</strong> {preset.creator}</p>
             <TruncatedList title="Avoid Words" items={preset.avoidWords} />
             <p><strong>Rhyme Scheme:</strong> {preset.rhymeScheme}</p>
             <TruncatedList title="Avoid Themes" items={preset.avoidThemes} />
             <TruncatedList title="Slang Words" items={preset.slangWords || []} />
             <p><strong>Likes:</strong> {preset.likes}</p>
           </CardContent>
         </Card>
       ))}
     </div>
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

