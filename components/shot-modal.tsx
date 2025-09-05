"use client"

import type React from "react"

import { useRef } from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { uploadImage } from "@/lib/blob-storage"
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/storage-utils"
import Image from "next/image"
import { Camera, Upload } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface ShotModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (shot: ShotItem) => void
  editShot?: ShotItem
}

interface ShotItem {
  id?: number
  title: string
  description: string
  category: string
  imagePath: string
  imagePosition?: {
    y: number
  }
}

const categories = [
  { value: "preparation", label: "Preparation" },
  { value: "ceremony", label: "Ceremony" },
  { value: "portrait", label: "Portrait" },
  { value: "reception", label: "Reception" },
  { value: "details", label: "Details" },
  { value: "venue", label: "Venue" },
]

export function ShotModal({ isOpen, onClose, onSave, editShot }: ShotModalProps) {
  const [shot, setShot] = useState<ShotItem>(
    editShot || {
      title: "",
      description: "",
      category: "portrait",
      imagePath: "",
      imagePosition: { y: 50 },
    },
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [imagePosition, setImagePosition] = useState<{ y: number }>(shot.imagePosition || { y: 50 })
  const imageRef = useRef<HTMLImageElement>(null)

  const handleInputChange = (field: keyof ShotItem, value: string) => {
    setShot((prevShot) => ({
      ...prevShot,
      [field]: value,
    }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file)
      setShot((prevShot) => ({
        ...prevShot,
        imagePath: previewUrl,
      }))
    }
  }

  const handlePositionChange = (value: number[]) => {
    const newPosition = { y: value[0] }
    setImagePosition(newPosition)
    setShot((prevShot) => ({
      ...prevShot,
      imagePosition: newPosition,
    }))
  }

  const handleSave = async () => {
    try {
      setIsUploading(true)
      let finalImagePath = shot.imagePath

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile)
        finalImagePath = uploadedUrl
      }

      const updatedShot = {
        ...shot,
        imagePath: finalImagePath,
        imagePosition: imagePosition,
      }

      // Save to local storage before closing
      const existingShots = loadFromLocalStorage("photoProShotList") || []
      const updatedShots = editShot
        ? existingShots.map((s: ShotItem) => (s.id === editShot.id ? updatedShot : s))
        : [...existingShots, { ...updatedShot, id: Date.now() }]
      saveToLocalStorage("photoProShotList", updatedShots)

      onSave(updatedShot)
      onClose()
    } catch (error) {
      console.error("Error saving shot:", error)
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    if (editShot) {
      setShot(editShot)
      setImagePosition(editShot.imagePosition || { y: 50 })
    }
  }, [editShot])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]"
        aria-describedby="shot-modal-description"
      >
        <DialogHeader>
          <DialogTitle>{editShot ? "Edit Shot" : "Add New Shot"}</DialogTitle>
          <p id="shot-modal-description" className="sr-only">
            This dialog allows you to {editShot ? "edit an existing" : "add a new"} shot to your photography session,
            including details such as the shot title, category, and reference image.
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image">Reference Image</Label>
            <div className="space-y-4">
              <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                {shot.imagePath ? (
                  <Image
                    ref={imageRef}
                    src={shot.imagePath || "/placeholder.svg"}
                    alt="Preview"
                    fill={true}
                    style={{
                      objectFit: "cover",
                      objectPosition: `center ${imagePosition.y}%`,
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              {shot.imagePath && (
                <div className="w-full">
                  <Slider
                    value={[imagePosition.y]}
                    onValueChange={handlePositionChange}
                    min={0}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
              )}
              <div className="flex justify-center">
                <Label
                  htmlFor="image-upload"
                  className="flex h-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {shot.imagePath ? "Change Image" : "Upload Reference Image"}
                </Label>
                <Input id="image-upload" type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Shot Title</Label>
            <Input
              id="title"
              value={shot.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., First Look, Bride with Mother"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Shot Category</Label>
            <Select value={shot.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Shot Notes</Label>
            <Textarea
              id="description"
              value={shot.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Add any specific instructions or notes for this shot"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUploading}>
            {isUploading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

