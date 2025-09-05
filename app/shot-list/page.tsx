"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, Trash2 } from "lucide-react"
import Image from "next/image"
import defaultConfig from "@/config/defaultConfig.json"
import { ShotModal } from "@/components/shot-modal"
import { uploadImage, deleteImage } from "@/lib/blob-storage"
import { ErrorBoundary } from "react-error-boundary"

interface ShotItem {
  id: number
  title: string
  description: string
  category: string
  completed: boolean
  imagePath: string
  imagePosition?: {
    x: number
    y: number
  }
}

const categories = [
  { value: "all", label: "All" },
  { value: "preparation", label: "Preparation" },
  { value: "ceremony", label: "Ceremony" },
  { value: "portrait", label: "Portrait" },
  { value: "reception", label: "Reception" },
  { value: "details", label: "Details" },
  { value: "venue", label: "Venue" },
]

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export default function ShotListPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [shotList, setShotList] = useState<ShotItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingShot, setEditingShot] = useState<ShotItem | undefined>(undefined)
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    const loadShots = async () => {
      const savedShotList = localStorage.getItem("photoProShotList")
      if (savedShotList) {
        setShotList(JSON.parse(savedShotList))
      } else {
        setShotList(defaultConfig.shotList.map((shot) => ({ ...shot, completed: false })))
      }
    }
    loadShots()
  }, [])

  useEffect(() => {
    localStorage.setItem("photoProShotList", JSON.stringify(shotList))
  }, [shotList])

  const toggleCompleted = (id: number) => {
    setShotList((prevList) => prevList.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const deleteShot = async (id: number) => {
    const shotToDelete = shotList.find((shot) => shot.id === id)
    if (shotToDelete && shotToDelete.imagePath) {
      await deleteImage(shotToDelete.imagePath)
    }
    setShotList((prevList) => prevList.filter((item) => item.id !== id))
  }

  const filteredShotList = shotList.filter(
    (shot) =>
      shot.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeCategory === "all" || shot.category === activeCategory),
  )

  const renderShotCard = (shot: ShotItem) => (
    <Card key={shot.id} className={`${shot.completed ? "opacity-60" : ""} overflow-hidden`}>
      {shot.imagePath && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={shot.imagePath || "/placeholder.svg?height=192&width=100"}
            alt={shot.title}
            fill={true}
            style={{
              objectFit: "cover",
              objectPosition: `center ${shot.imagePosition?.y ?? 50}%`,
            }}
            className="transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox checked={shot.completed} onCheckedChange={() => toggleCompleted(shot.id)} className="h-5 w-5" />
            <div>
              <p className={`font-medium ${shot.completed ? "line-through" : ""}`}>{shot.title}</p>
              <p className="text-xs text-muted-foreground capitalize">{shot.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingShot(shot)
                setIsModalOpen(true)
              }}
            >
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deleteShot(shot.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {shot.description && (
          <p className="mt-2 text-sm text-muted-foreground border-t border-border pt-2">{shot.description}</p>
        )}
      </CardContent>
    </Card>
  )

  const handleSaveShot = async (newShot: ShotItem) => {
    try {
      let updatedList: ShotItem[]
      if (editingShot) {
        if (newShot.imagePath && newShot.imagePath !== editingShot.imagePath) {
          if (editingShot.imagePath) {
            await deleteImage(editingShot.imagePath)
          }
          const file = await fetch(newShot.imagePath).then((res) => res.blob())
          const uploadedUrl = await uploadImage(new File([file], newShot.title))
          newShot.imagePath = uploadedUrl
        }
        updatedList = shotList.map((shot) =>
          shot.id === editingShot.id ? { ...newShot, id: shot.id, completed: shot.completed } : shot,
        )
      } else {
        const newId = Math.max(...shotList.map((item) => item.id), 0) + 1
        if (newShot.imagePath) {
          const file = await fetch(newShot.imagePath).then((res) => res.blob())
          const uploadedUrl = await uploadImage(new File([file], newShot.title))
          newShot.imagePath = uploadedUrl
        }
        updatedList = [...shotList, { ...newShot, id: newId, completed: false }]
      }
      setShotList(updatedList)
      localStorage.setItem("photoProShotList", JSON.stringify(updatedList))
    } catch (error) {
      console.error("Error saving shot:", error)
      // Handle the error appropriately, e.g., show an error message to the user
    }
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Shot List</h1>
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search shots..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Shot
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="w-full">
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value} className="flex-1">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filteredShotList.map(renderShotCard)}</div>
          </TabsContent>

          {categories.slice(1).map((category) => (
            <TabsContent key={category.value} value={category.value} className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredShotList.filter((shot) => shot.category === category.value).map(renderShotCard)}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <ShotModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingShot(undefined)
          }}
          onSave={handleSaveShot}
          editShot={editingShot}
        />
      </div>
    </ErrorBoundary>
  )
}

