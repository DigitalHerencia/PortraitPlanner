"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Calendar, Users, Heart, PlusCircle, Upload } from "lucide-react"
import Link from "next/link"
import defaultConfig from "@/config/defaultConfig.json"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { uploadImage } from "@/lib/blob-storage"

interface GroupShot {
  id: string | number
  description: string
}

export default function ClientPage() {
  const [config, setConfig] = useState(defaultConfig)
  const [isGroupShotsModalOpen, setIsGroupShotsModalOpen] = useState(false)
  const [groupShots, setGroupShots] = useState<GroupShot[]>(defaultConfig.groupShots)
  const [newShot, setNewShot] = useState({ description: "" })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const savedConfig = localStorage.getItem("photoProConfig")
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig)
      setConfig(parsedConfig)
      setGroupShots(parsedConfig.groupShots || [])
    }
  }, [])

  const handleSaveGroupShots = () => {
    const updatedConfig = { ...config, groupShots }
    localStorage.setItem("photoProConfig", JSON.stringify(updatedConfig))
    setIsGroupShotsModalOpen(false)
  }

  const addGroupShot = () => {
    if (newShot.description) {
      setGroupShots([...groupShots, { ...newShot, id: Date.now().toString() }])
      setNewShot({ description: "" })
    }
  }

  const removeGroupShot = (id: string | number) => {
    setGroupShots(groupShots.filter((shot) => shot.id !== id))
  }

  return (
    <div className="container py-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Client Information</h1>
        <Link href="/schedule">
          <Button>View Schedule</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
            <CardDescription>Wedding information and contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6 space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={config.clientInfo.avatarUrl || "/placeholder.svg?height=40&width=40"}
                    alt="Client"
                  />
                  <AvatarFallback>
                    {config.clientInfo.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  <Label
                    htmlFor="client-avatar-upload"
                    className="flex items-center justify-center w-8 h-8 rounded-full shadow-sm cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Upload className="w-4 h-4" />
                  </Label>
                  <Input
                    id="client-avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e: any) => {
                      const file = (e.target as any).files?.[0] ?? null
                      if (!file) return
                      try {
                        setIsUploading(true)
                        setAvatarFile(file)
                        const uploadedUrl = await uploadImage(file)

                        const updatedConfig = {
                          ...config,
                          clientInfo: {
                            ...config.clientInfo,
                            avatarUrl: uploadedUrl,
                          },
                        }

                        setConfig(updatedConfig)
                        localStorage.setItem("photoProConfig", JSON.stringify(updatedConfig))
                        setIsUploading(false)
                      } catch (error) {
                        console.error("Error uploading image:", error)
                        setIsUploading(false)
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">{config.clientInfo.name}</h2>
                <p className="text-muted-foreground">
                  Wedding Date: {new Date(config.weddingDetails.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>{config.clientInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>{config.clientInfo.email}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mt-1 mr-2" />
                <div>
                  <p>Ceremony: {config.venues.ceremony.name}</p>
                  <p className="text-sm text-muted-foreground">{config.venues.ceremony.address}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mt-1 mr-2" />
                <div>
                  <p>Reception: {config.venues.reception.name}</p>
                  <p className="text-sm text-muted-foreground">{config.venues.reception.address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wedding Details</CardTitle>
            <CardDescription>Important information for the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Date: {new Date(config.weddingDetails.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>Package: {config.weddingDetails.package}</span>
              </div>
              <div className="flex items-start">
                <Heart className="w-4 h-4 mt-1 mr-2" />
                <div>
                  <p>Photography Preferences:</p>
                  <p className="text-sm text-muted-foreground">{config.photographyPreferences.style}</p>
                  <p className="text-sm text-muted-foreground">{config.photographyPreferences.postProcessing}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
              <CardTitle>Group Shots</CardTitle>
              <Button onClick={() => setIsGroupShotsModalOpen(true)}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Group Shots
              </Button>
            </div>
            <CardDescription>Manage group photo shots</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupShots.map((shot) => (
                  <TableRow key={shot.id}>
                    <TableCell className="font-medium">{shot.description}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => removeGroupShot(shot.id)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isGroupShotsModalOpen} onOpenChange={setIsGroupShotsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Group Shot</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newShot.description}
                onChange={(e: any) => setNewShot({ ...newShot, description: (e.target as any).value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addGroupShot}>Add Shot</Button>
            <Button onClick={handleSaveGroupShots}>Save All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

