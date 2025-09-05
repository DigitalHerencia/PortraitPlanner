"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, MapPin, PlusCircle, Trash2 } from "lucide-react"
import defaultConfig from "@/config/defaultConfig.json"
import { ScheduleModal } from "@/components/schedule-modal"
import { setValue, getValue } from "@/lib/kv-storage"
import { format, parse } from "date-fns"

interface ScheduleItem {
  id: number
  time: string
  title: string
  description: string
  location: string
  type: "prep" | "ceremony" | "portrait" | "reception"
  completed: boolean
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ScheduleItem | undefined>(undefined)

  useEffect(() => {
    async function loadSchedule() {
      const savedSchedule = await getValue("schedule")
      if (savedSchedule) {
        setSchedule(savedSchedule)
      } else {
        const defaultSchedule = Array.isArray(defaultConfig.schedule)
          ? defaultConfig.schedule.map((item) => ({ ...item, completed: false }))
          : []
        setSchedule(defaultSchedule)
        await setValue("schedule", defaultSchedule)
      }
    }
    loadSchedule()

    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    // Set up notifications for upcoming events
    const notificationTimeouts = schedule
      .filter((item) => !item.completed)
      .map((item) => {
        const eventTime = parse(item.time, "HH:mm", new Date())
        const notificationTime = new Date(eventTime.getTime() - 15 * 60000) // 15 minutes before
        const timeUntilNotification = notificationTime.getTime() - Date.now()

        if (timeUntilNotification > 0) {
          return setTimeout(() => {
            if (Notification.permission === "granted") {
              new Notification(`Upcoming: ${item.title}`, {
                body: `In 15 minutes at ${format(eventTime, "h:mm a")}`,
                icon: "/icons/icon-192x192.png",
              })
            }
          }, timeUntilNotification)
        }
      })

    return () => {
      notificationTimeouts.forEach((timeout) => timeout && clearTimeout(timeout))
    }
  }, [schedule])

  const toggleCompleted = async (id: number) => {
    const updatedSchedule = schedule.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    setSchedule(updatedSchedule)
    await setValue("schedule", updatedSchedule)
  }

  const deleteScheduleItem = async (id: number) => {
    const updatedSchedule = schedule.filter((item) => item.id !== id)
    setSchedule(updatedSchedule)
    await setValue("schedule", updatedSchedule)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "prep":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "ceremony":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "portrait":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "reception":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Wedding Day Schedule</h1>
      </div>

      <Card>
        <CardContent className="p-4">
          <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {schedule.map((item) => (
          <Card key={item.id} className={item.completed ? "opacity-60" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(item.type)}>
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="capitalize">{item.type}</span>
                    </Badge>
                    <span className="font-bold">{format(parse(item.time, "HH:mm", new Date()), "h:mm a")}</span>
                  </div>
                  <CardTitle className="mt-2">{item.title}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingItem(item)
                      setIsModalOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteScheduleItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleCompleted(item.id)}
                    className="h-6 w-6"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{item.description}</CardDescription>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {item.location}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingItem(undefined)
        }}
        onSave={async (newItem) => {
          let updatedSchedule
          if (editingItem) {
            updatedSchedule = schedule.map((item) => (item.id === editingItem.id ? { ...newItem, id: item.id } : item))
          } else {
            const newId = Math.max(...schedule.map((item) => item.id)) + 1
            updatedSchedule = [...schedule, { ...newItem, id: newId, completed: false }]
          }
          setSchedule(updatedSchedule)
          await setValue("schedule", updatedSchedule)
        }}
        editItem={editingItem}
      />
    </div>
  )
}

