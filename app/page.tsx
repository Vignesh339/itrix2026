"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Cpu, 
  Settings, 
  User,
  ArrowRight,
  AlertTriangle,
  Wifi,
  WifiOff,
  Play
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function HomePage() {
  const router = useRouter()
  const [participantId, setParticipantId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  // Check initialization status
  const { data: initStatus, mutate: checkInit } = useSWR("/api/init", fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  })

  useEffect(() => {
    if (initStatus?.initialized) {
      setInitialized(true)
    }
  }, [initStatus])

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    setIsOnline(navigator.onLine)
    
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const initializeDatabase = async () => {
    setIsInitializing(true)
    try {
      const response = await fetch("/api/init", { method: "POST" })
      if (response.ok) {
        setInitialized(true)
        checkInit()
      }
    } catch (err) {
      console.error("Failed to initialize database:", err)
    } finally {
      setIsInitializing(false)
    }
  }

  const handleParticipantAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!participantId.trim()) {
      setError("Please enter your Participant ID")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Verify participant exists
      const res = await fetch(`/api/participants/${participantId.trim().toUpperCase()}`)
      
      if (!res.ok) {
        if (res.status === 404) {
          setError("Participant ID not found. Please check with the admin.")
        } else {
          setError("Failed to verify ID. Please try again.")
        }
        setIsLoading(false)
        return
      }

      const data = await res.json()
      
      // Check if participant is locked
      if (data.participant.is_locked) {
        setError("Your session has been locked. Please contact the admin.")
        setIsLoading(false)
        return
      }

      // Auto-start timer if not already started and scenario is assigned
      if (data.participant.scenario_id && !data.participant.timer_started_at) {
        await fetch(`/api/participants/${participantId.trim().toUpperCase()}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "start_timer",
            duration: data.participant.timer_duration || 3600,
          }),
        })
      }

      // Navigate to participant dashboard
      router.push(`/participant/${participantId.trim().toUpperCase()}`)
    } catch (err) {
      setError("Connection error. The system works offline - ensure the local server is running.")
      setIsLoading(false)
    }
  }

  // Not initialized view
  if (!initialized) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
              <Cpu className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">IoT Competition Platform</CardTitle>
            <CardDescription>Initialize the system to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              This will set up the database with 49 components and 8 competition scenarios.
            </p>
            <Button 
              onClick={initializeDatabase}
              disabled={isInitializing}
              className="w-full"
              size="lg"
            >
              {isInitializing ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Initializing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Initialize System
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Status Bar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {isOnline ? (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Wifi className="h-3.5 w-3.5 text-success" />
                  Online
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-warning">
                  <WifiOff className="h-3.5 w-3.5" />
                  Offline Mode
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              Local Server Active
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Logo & Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-6">
              <Cpu className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3 text-balance">
              IoT Competition Platform
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
              Build innovative IoT solutions with Arduino. Select your role to continue.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Admin Card */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary mb-4">
                  <Settings className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Admin Dashboard</CardTitle>
                <CardDescription>
                  Manage participants, assign scenarios, monitor progress, and view activity logs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={() => router.push("/admin")}
                >
                  Enter Admin Panel
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Password protected access
                </p>
              </CardContent>
            </Card>

            {/* Participant Card */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Participant Access</CardTitle>
                <CardDescription>
                  Enter your unique ID to access your scenario, components, and Arduino IDE
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleParticipantAccess} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Enter your Participant ID"
                      value={participantId}
                      onChange={(e) => {
                        setParticipantId(e.target.value.toUpperCase())
                        setError(null)
                      }}
                      className="text-center font-mono text-lg tracking-wider"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    {error && (
                      <Alert variant="destructive" className="py-2">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <AlertDescription className="text-sm ml-2">{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full gap-2" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Start Competition
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              All data is stored locally. No internet connection required during the competition.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
