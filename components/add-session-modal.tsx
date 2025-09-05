"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (sessionName: string) => void
}

export function AddSessionModal({ isOpen, onClose, onSave }: AddSessionModalProps) {
  const [sessionName, setSessionName] = useState("")

  const handleSave = () => {
    if (sessionName.trim()) {
      onSave(sessionName)
      setSessionName("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Session</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sessionName" className="text-right">
              Session Name
            </Label>
            <Input
              id="sessionName"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

