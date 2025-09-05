"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "next-themes"
import { RefreshCw, Moon, Sun, Settings } from "lucide-react"
import defaultConfig from "@/config/defaultConfig.json"
import { ConfigModal } from "@/components/config-modal"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [autoComplete, setAutoComplete] = useState(true)
  const [reminderTime, setReminderTime] = useState(15)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [config, setConfig] = useState(defaultConfig)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const savedConfig = localStorage.getItem("photoProConfig")
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }, [])

  const handleSaveConfig = (newConfig: any) => {
    setConfig(newConfig)
    localStorage.setItem("photoProConfig", JSON.stringify(newConfig))
  }

  const handleResetConfig = () => {
    if (confirm("Are you sure you want to reset the configuration to default?")) {
      setConfig(defaultConfig)
      localStorage.removeItem("photoProConfig")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how PhotoPro looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Dark Mode</Label>
                <CardDescription>Switch between light and dark themes</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch
                  id="theme"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <CardDescription>Receive alerts for upcoming events</CardDescription>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>

            {notifications && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="reminder-time">Reminder Time (minutes before event)</Label>
                  <span className="text-sm font-medium">{reminderTime} min</span>
                </div>
                <Slider
                  id="reminder-time"
                  defaultValue={[reminderTime]}
                  max={60}
                  min={5}
                  step={5}
                  onValueChange={(value) => setReminderTime(value[0])}
                  disabled={!notifications}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Edit and manage your app configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setIsConfigModalOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Edit Configuration
            </Button>
            <Button variant="outline" onClick={handleResetConfig}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset to Default
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>App Preferences</CardTitle>
            <CardDescription>Customize app behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-complete">Auto-complete Tasks</Label>
                <CardDescription>Automatically mark tasks as complete when time passes</CardDescription>
              </div>
              <Switch id="auto-complete" checked={autoComplete} onCheckedChange={setAutoComplete} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About PhotoPro</CardTitle>
            <CardDescription>App information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <p className="text-sm">Version: 1.0.0</p>
              <p className="text-sm">© 2025 PhotoPro</p>
              <p className="text-sm text-muted-foreground">A professional tool for wedding photographers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfigModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} onSave={handleSaveConfig} />
    </div>
  )
}

