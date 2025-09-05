"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { setValue, getValue } from "@/lib/kv-storage"
import { format } from "date-fns"

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: ScheduleItem) => void
  editItem?: ScheduleItem
}

interface ScheduleItem {
  id?: number
  time: string
  title: string
  description: string
  location: string
  type: "prep" | "ceremony" | "portrait" | "reception"
}

export function ScheduleModal({ isOpen, onClose, onSave, editItem }: ScheduleModalProps) {
  const [item, setItem] = useState<ScheduleItem>(
    editItem || {
      time: "",
      title: "",
      description: "",
      location: "",
      type: "prep",
    },
  )

  const handleInputChange = (field: keyof ScheduleItem, value: string) => {
    setItem((prevItem) => ({
      ...prevItem,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    const formattedTime = format(new Date(`2000-01-01T${item.time}`), "HH:mm")
    await setValue(`schedule-item-${item.id || Date.now()}`, { ...item, time: formattedTime })
    onSave({ ...item, time: formattedTime })
    onClose()
  }

  useEffect(() => {
    if (editItem) {
      getValue(`schedule-item-${editItem.id}`).then((savedItem) => {
        if (savedItem) {
          setItem(savedItem)
        }
      })
    }
  }, [editItem])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editItem ? "Edit Schedule Item" : "Add New Schedule Item"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={item.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={item.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={item.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={item.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              value={item.type}
              onValueChange={(value) => handleInputChange("type", value as ScheduleItem["type"])}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prep">Preparation</SelectItem>
                <SelectItem value="ceremony">Ceremony</SelectItem>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="reception">Reception</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

