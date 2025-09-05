"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Upload, Camera } from "lucide-react"
import defaultConfig from "@/config/defaultConfig.json"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PhotoPackage, packageDetails } from "@/types/packages"
import { uploadImage } from "@/lib/blob-storage"
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/storage-utils"
import Image from "next/image"

interface ConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: any) => void
}

export function ConfigModal({ isOpen, onClose, onSave }: ConfigModalProps) {
  const [config, setConfig] = useState(defaultConfig)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const savedConfig = loadFromLocalStorage("photoProConfig")
    if (savedConfig) {
      setConfig(savedConfig)
      if (savedConfig.clientInfo.avatarUrl) {
        setAvatarPreview(savedConfig.clientInfo.avatarUrl)
      }
    }
  }, [])

  const handleInputChange = (section: string, field: string, value: any) => {
    setConfig((prevConfig) => {
      const newConfig = {
        ...prevConfig,
        [section]: {
          ...prevConfig[section],
          [field]: value,
        },
      }
      saveToLocalStorage("photoProConfig", newConfig)
      return newConfig
    })
  }

  const handleSave = async () => {
    try {
      setIsUploading(true)

      // Upload avatar if a new file was selected
      if (avatarFile) {
        const uploadedUrl = await uploadImage(avatarFile)
        config.clientInfo.avatarUrl = uploadedUrl
        saveToLocalStorage("photoProConfig", config)
      }

      onSave(config)
      onClose()
    } catch (error) {
      console.error("Error saving configuration:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" aria-describedby="config-modal-description">
        <DialogHeader>
          <DialogTitle>Edit Configuration</DialogTitle>
          <p id="config-modal-description" className="sr-only">
            This dialog allows you to edit the configuration settings for your photography session, including client
            details, wedding information, and photography preferences.
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={config.clientInfo.name}
                onChange={(e) => handleInputChange("clientInfo", "name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                value={config.clientInfo.email}
                onChange={(e) => handleInputChange("clientInfo", "email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">Client Phone</Label>
              <Input
                id="clientPhone"
                value={config.clientInfo.phone}
                onChange={(e) => handleInputChange("clientInfo", "phone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="clientAvatar">Profile Picture</Label>
              <div className="mt-2 flex flex-col items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border">
                  {avatarPreview || config.clientInfo.avatarUrl ? (
                    <Image
                      src={avatarPreview || config.clientInfo.avatarUrl}
                      alt="Profile Preview"
                      fill={true}
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <Label
                    htmlFor="avatar-upload"
                    className="flex h-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Profile Picture
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAvatarFile(e.target.files[0])
                        setAvatarPreview(URL.createObjectURL(e.target.files[0]))
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weddingDate">Wedding Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !config.weddingDetails.date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {config.weddingDetails.date ? (
                      format(new Date(config.weddingDetails.date), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(config.weddingDetails.date)}
                    onSelect={(date) => handleInputChange("weddingDetails", "date", date?.toISOString())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="weddingTime">Wedding Time</Label>
              <Input
                id="weddingTime"
                type="time"
                value={config.weddingDetails.time}
                onChange={(e) => handleInputChange("weddingDetails", "time", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="weddingPackage">Wedding Package</Label>
              <Select
                value={config.weddingDetails.package}
                onValueChange={(value) => handleInputChange("weddingDetails", "package", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a package" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PhotoPackage).map((pkg) => (
                    <SelectItem key={pkg} value={pkg}>
                      {pkg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {config.weddingDetails.package && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {packageDetails[config.weddingDetails.package as PhotoPackage].features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span>•</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ceremonyVenue">Ceremony Venue</Label>
              <Input
                id="ceremonyVenue"
                value={config.venues.ceremony.name}
                onChange={(e) =>
                  handleInputChange("venues", "ceremony", { ...config.venues.ceremony, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="ceremonyAddress">Ceremony Address</Label>
              <Input
                id="ceremonyAddress"
                value={config.venues.ceremony.address}
                onChange={(e) =>
                  handleInputChange("venues", "ceremony", { ...config.venues.ceremony, address: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="receptionVenue">Reception Venue</Label>
              <Input
                id="receptionVenue"
                value={config.venues.reception.name}
                onChange={(e) =>
                  handleInputChange("venues", "reception", { ...config.venues.reception, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="receptionAddress">Reception Address</Label>
              <Input
                id="receptionAddress"
                value={config.venues.reception.address}
                onChange={(e) =>
                  handleInputChange("venues", "reception", { ...config.venues.reception, address: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="photographyStyle">Photography Style</Label>
            <Textarea
              id="photographyStyle"
              value={config.photographyPreferences.style}
              onChange={(e) => handleInputChange("photographyPreferences", "style", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="postProcessing">Post-Processing Preferences</Label>
            <Textarea
              id="postProcessing"
              value={config.photographyPreferences.postProcessing}
              onChange={(e) => handleInputChange("photographyPreferences", "postProcessing", e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUploading}>
            {isUploading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

