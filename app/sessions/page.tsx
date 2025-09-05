"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Plus } from "lucide-react"
import Link from "next/link"
import { AddSessionModal } from "@/components/add-session-modal"

interface Session {
  id: number
  name: string
  date: string
}

export default function SessionsPage() {
  // Use anonymized example data for privacy. Dates default to "TBD" to avoid leaking real dates.
  const [sessions, setSessions] = useState<Session[]>([{ id: 1, name: "Private Session", date: "TBD" }])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const addNewSession = (sessionName: string) => {
    const newSession = {
      id: sessions.length + 1,
      name: sessionName,
      // Don't auto-fill with today's date — keep as TBD for privacy.
      date: "TBD",
    }
    setSessions([...sessions, newSession])
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Photography Sessions</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle>{session.name}</CardTitle>
              <CardDescription>{session.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/client?session=${session.id}`}>
                <Button className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddSessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={addNewSession} />
    </div>
  )
}

