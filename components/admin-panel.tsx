import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, Undo2 } from 'lucide-react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminRecommendedArtists } from './admin-recommended-artists'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface ArtistRequest {
  id: number;
  artistName: string;
  description: string;
  profilePictureUrl: string;
  geniusLinks: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

interface ArtistifyModel {
  id: number;
  name: string;
  description: string;
  textFiles: { name: string; content: string }[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

export function AdminPanel() {
  const [artistRequests, setArtistRequests] = useState<ArtistRequest[]>([
    {
      id: 1,
      artistName: "Luna Starlight",
      description: "Indie pop sensation with ethereal vocals and dreamy melodies. Known for introspective lyrics and atmospheric soundscapes that transport listeners to another realm.",
      profilePictureUrl: "",
      geniusLinks: ["https://genius.com/Luna-starlight-moonbeam-lyrics", "https://genius.com/Luna-starlight-stardust-dreams-lyrics"],
      status: 'pending',
      submittedAt: new Date('2023-06-01T10:00:00Z'),
    },
    {
      id: 2,
      artistName: "The Groove Masters",
      description: "Funk and soul collective with infectious rhythms and brass-heavy arrangements. Their energetic performances and socially conscious lyrics have garnered a devoted following.",
      profilePictureUrl: "",
      geniusLinks: ["https://genius.com/The-groove-masters-funky-town-lyrics", "https://genius.com/The-groove-masters-soul-train-lyrics"],
      status: 'pending',
      submittedAt: new Date('2023-06-02T14:30:00Z'),
    },
  ])

  const [history, setHistory] = useState<ArtistRequest[][]>([])
  const [editingRequest, setEditingRequest] = useState<ArtistRequest | null>(null);

  const [artistifyModels, setArtistifyModels] = useState<ArtistifyModel[]>([
    {
      id: 1,
      name: "Artistify v1",
      description: "First version of Artistify AI model for generating lyrics.",
      textFiles: [
        { name: "sample1.txt", content: "Sample content for file 1" },
        { name: "sample2.txt", content: "Sample content for file 2" },
      ],
      status: 'pending',
      submittedAt: new Date('2023-07-01T10:00:00Z'),
    },
    {
      id: 2,
      name: "Artistify v2",
      description: "Improved version of Artistify with enhanced lyric generation capabilities.",
      textFiles: [
        { name: "improved1.txt", content: "Improved content for file 1" },
        { name: "improved2.txt", content: "Improved content for file 2" },
      ],
      status: 'pending',
      submittedAt: new Date('2023-07-15T14:30:00Z'),
    },
  ]);

  const [editingArtistifyModel, setEditingArtistifyModel] = useState<ArtistifyModel | null>(null);
  const [viewingFile, setViewingFile] = useState<{ modelId: number; fileIndex: number; name: string; content: string } | null>(null);

  const updateRequestStatus = (id: number, newStatus: 'approved' | 'rejected') => {
    setHistory(prev => [...prev, artistRequests])
    setArtistRequests(requests =>
      requests.map(request =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    )
  }

  const handleApprove = (id: number) => updateRequestStatus(id, 'approved')
  const handleReject = (id: number) => updateRequestStatus(id, 'rejected')

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1]
      setArtistRequests(previousState)
      setHistory(prev => prev.slice(0, -1))
    }
  }

  const handleEdit = (id: number) => {
    const request = artistRequests.find(req => req.id === id);
    if (request) {
      setEditingRequest(request);
    }
  };

  const handleArtistifyApprove = (id: number) => {
    setArtistifyModels(models =>
      models.map(model =>
        model.id === id ? { ...model, status: 'approved' } : model
      )
    );
  };

  const handleArtistifyReject = (id: number) => {
    setArtistifyModels(models =>
      models.map(model =>
        model.id === id ? { ...model, status: 'rejected' } : model
      )
    );
  };

  const handleArtistifyEdit = (id: number) => {
    const model = artistifyModels.find(m => m.id === id);
    if (model) {
      setEditingArtistifyModel(model);
    }
  };

  const handleViewFile = (modelId: number, fileIndex: number) => {
    const model = artistifyModels.find(m => m.id === modelId);
    if (model && model.textFiles[fileIndex]) {
      setViewingFile({
        modelId,
        fileIndex,
        name: model.textFiles[fileIndex].name,
        content: model.textFiles[fileIndex].content,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="artist-requests" className="w-full">
        <TabsList className="flex flex-wrap justify-start gap-2 mb-4">
          <TabsTrigger value="artist-requests">Artist Requests</TabsTrigger>
          <TabsTrigger value="artistify">Artistify Models</TabsTrigger>
          <TabsTrigger value="paid-users">Paid Users</TabsTrigger>
          <TabsTrigger value="error-logs">Error Logs</TabsTrigger>
          <TabsTrigger value="user-management">User Management</TabsTrigger>
          <TabsTrigger value="recommended-artists">Recommended Artists</TabsTrigger>
        </TabsList>
        <TabsContent value="artist-requests">
          <Card>
            <CardHeader>
              <CardTitle>Artist Requests</CardTitle>
              <CardDescription>Manage artist requests and other administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button 
                  onClick={handleUndo} 
                  disabled={history.length === 0}
                  variant="outline"
                >
                  <Undo2 className="mr-2 h-4 w-4" />
                  Undo Last Action
                </Button>
              </div>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artist</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Submitted At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {artistRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="relative h-10 w-10">
                              <Image
                                src={request.profilePictureUrl}
                                alt={request.artistName}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full"
                              />
                            </div>
                            <span className="font-medium">{request.artistName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Collapsible>
                            <CollapsibleTrigger className="flex items-center">
                              {request.description.slice(0, 35)}...
                              <ChevronDown className="h-4 w-4 ml-2" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="mt-2 space-y-2">
                                <p>{request.description}</p>
                                <div>
                                  <strong>Genius Lyric URLs:</strong>
                                  <ul className="list-disc pl-5">
                                    {request.geniusLinks.map((link, index) => (
                                      <li key={index}>
                                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                          {link}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </TableCell>
                        <TableCell>{request.submittedAt.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === 'approved' ? 'success' :
                              request.status === 'rejected' ? 'destructive' :
                              'default'
                            }
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' && (
                            <div className="space-x-2">
                              <Button size="sm" onClick={() => handleApprove(request.id)}>Approve</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>Reject</Button>
                            </div>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleEdit(request.id)}>Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="artistify">
          <Card>
            <CardHeader>
              <CardTitle>Artistify Models</CardTitle>
              <CardDescription>Manage Artistify AI models and their associated text files</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Submitted At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {artistifyModels.map((model) => (
                      <TableRow key={model.id}>
                        <TableCell>
                          <div className="font-medium">{model.name}</div>
                        </TableCell>
                        <TableCell>
                          <Collapsible>
                            <CollapsibleTrigger className="flex items-center">
                              {model.description.slice(0, 35)}...
                              <ChevronDown className="h-4 w-4 ml-2" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="mt-2 space-y-2">
                                <p>{model.description}</p>
                                <div>
                                  <strong>Text Files:</strong>
                                  <ul className="list-disc pl-5">
                                    {model.textFiles.map((file, index) => (
                                      <li key={index}>
                                        <Button variant="link" onClick={() => handleViewFile(model.id, index)}>
                                          {file.name}
                                        </Button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </TableCell>
                        <TableCell>{model.submittedAt.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              model.status === 'approved' ? 'success' :
                              model.status === 'rejected' ? 'destructive' :
                              'default'
                            }
                          >
                            {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {model.status === 'pending' && (
                            <div className="space-x-2">
                              <Button size="sm" onClick={() => handleArtistifyApprove(model.id)}>Approve</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleArtistifyReject(model.id)}>Reject</Button>
                            </div>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleArtistifyEdit(model.id)}>Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paid-users">
          <Card>
            <CardHeader>
              <CardTitle>Paid Users</CardTitle>
              <CardDescription>View and manage paid user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add paid users management content here */}
              <p>Paid users management interface to be implemented.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="error-logs">
          <Card>
            <CardHeader>
              <CardTitle>Error Logs</CardTitle>
              <CardDescription>View system error logs</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add error logs viewing interface here */}
              <p>Error logs viewing interface to be implemented.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="user-management">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users, their content, and account status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Search users..."
                  onChange={(e) => {
                    // Implement user search functionality
                  }}
                />
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Example user row */}
                      <TableRow>
                        <TableCell>johndoe</TableCell>
                        <TableCell>john@example.com</TableCell>
                        <TableCell>
                          <Badge variant="outline">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">View Content</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>User Content</DialogTitle>
                                </DialogHeader>
                                <Tabs defaultValue="songs">
                                  <TabsList>
                                    <TabsTrigger value="songs">Songs</TabsTrigger>
                                    <TabsTrigger value="presets">Presets</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="songs">
                                    {/* List of user's songs with delete option */}
                                    <ul className="space-y-2">
                                      <li className="flex justify-between items-center">
                                        <span>Song 1</span>
                                        <Button variant="destructive" size="sm">Delete</Button>
                                      </li>
                                      {/* More songs... */}
                                    </ul>
                                  </TabsContent>
                                  <TabsContent value="presets">
                                    {/* List of user's presets with delete option */}
                                    <ul className="space-y-2">
                                      <li className="flex justify-between items-center">
                                        <span>Preset 1</span>
                                        <Button variant="destructive" size="sm">Delete</Button>
                                      </li>
                                      {/* More presets... */}
                                    </ul>
                                  </TabsContent>
                                </Tabs>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">Ban User</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action will ban the user. It can be reversed, but all user content will be hidden until unbanned.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => {
                                    // Implement ban user logic here
                                    console.log('User banned');
                                  }}>
                                    Ban User
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                      {/* Add more user rows here */}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Banned Users</h3>
                <ScrollArea className="h-[200px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Ban Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Example banned user row */}
                      <TableRow>
                        <TableCell>banneduser</TableCell>
                        <TableCell>banned@example.com</TableCell>
                        <TableCell>2023-06-15</TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">Unban User</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Unban</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to unban this user? Their account will be reactivated and content will be visible again.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                  // Implement unban user logic here
                                  console.log('User unbanned');
                                }}>
                                  Unban User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                      {/* Add more banned user rows here */}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recommended-artists">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Artists</CardTitle>
              <CardDescription>Manage which artists appear in the Recommended Artists section</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminRecommendedArtists />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={!!editingRequest} onOpenChange={() => setEditingRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Artist Request</DialogTitle>
          </DialogHeader>
          {editingRequest && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-artist-name">Artist Name</Label>
                <Input
                  id="edit-artist-name"
                  value={editingRequest.artistName}
                  onChange={(e) => setEditingRequest({...editingRequest, artistName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingRequest.description}
                  onChange={(e) => setEditingRequest({...editingRequest, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-image-url">Image URL</Label>
                <Input
                  id="edit-image-url"
                  value={editingRequest.profilePictureUrl}
                  onChange={(e) => setEditingRequest({...editingRequest, profilePictureUrl: e.target.value})}
                />
              </div>
              <div>
                <Label>Genius Lyric URLs</Label>
                {editingRequest.geniusLinks.map((link, index) => (
                  <Input
                    key={index}
                    value={link}
                    onChange={(e) => {
                      const newLinks = [...editingRequest.geniusLinks];
                      newLinks[index] = e.target.value;
                      setEditingRequest({...editingRequest, geniusLinks: newLinks});
                    }}
                    className="mt-2"
                  />
                ))}
              </div>
              <Button onClick={() => {
                setArtistRequests(requests =>
                  requests.map(req => req.id === editingRequest.id ? editingRequest : req)
                );
                setEditingRequest(null);
              }}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!editingArtistifyModel} onOpenChange={() => setEditingArtistifyModel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Artistify Model</DialogTitle>
          </DialogHeader>
          {editingArtistifyModel && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-model-name">Model Name</Label>
                <Input
                  id="edit-model-name"
                  value={editingArtistifyModel.name}
                  onChange={(e) => setEditingArtistifyModel({...editingArtistifyModel, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-model-description">Description</Label>
                <Textarea
                  id="edit-model-description"
                  value={editingArtistifyModel.description}
                  onChange={(e) => setEditingArtistifyModel({...editingArtistifyModel, description: e.target.value})}
                />
              </div>
              <div>
                <Label>Text Files</Label>
                {editingArtistifyModel.textFiles.map((file, index) => (
                  <div key={index} className="mt-2">
                    <Input
                      value={file.name}
                      onChange={(e) => {
                        const newFiles = [...editingArtistifyModel.textFiles];
                        newFiles[index] = {...newFiles[index], name: e.target.value};
                        setEditingArtistifyModel({...editingArtistifyModel, textFiles: newFiles});
                      }}
                    />
                    <Button variant="outline" size="sm" onClick={() => handleViewFile(editingArtistifyModel.id, index)} className="mt-1">
                      View/Edit Content
                    </Button>
                  </div>
                ))}
              </div>
              <Button onClick={() => {
                setArtistifyModels(models =>
                  models.map(model => model.id === editingArtistifyModel.id ? editingArtistifyModel : model)
                );
                setEditingArtistifyModel(null);
              }}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!viewingFile} onOpenChange={() => setViewingFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit File: {viewingFile?.name}</DialogTitle>
          </DialogHeader>
          {viewingFile && (
            <div className="space-y-4">
              <Textarea
                value={viewingFile.content}
                onChange={(e) => setViewingFile({...viewingFile, content: e.target.value})}
                rows={10}
              />
              <Button onClick={() => {
                setArtistifyModels(models =>
                  models.map(model => {
                    if (model.id === viewingFile.modelId) {
                      const newFiles = [...model.textFiles];
                      newFiles[viewingFile.fileIndex] = {
                        name: viewingFile.name,
                        content: viewingFile.content,
                      };
                      return {...model, textFiles: newFiles};
                    }
                    return model;
                  })
                );
                setViewingFile(null);
              }}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

