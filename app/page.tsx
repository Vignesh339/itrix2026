"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { 
  Cpu, 
  Users, 
  FileText, 
  Package, 
  Settings, 
  Play,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Participant {
  id: string
  name: string
  scenario_id: number | null
  timer_duration: number
  timer_started_at: string | null
  is_active: number
  is_locked: number
  created_at: string
  scenario_title: string | null
  snippets_unlocked: number
  violation_count: number
}

interface Component {
  id: number
  name: string
  description: string
  pinout: string
  category: string
  quantity: number
  code_snippet: string
}

interface Scenario {
  id: number
  title: string
  situation: string
  what_to_build: string
  team_number: number | null
}

interface ParticipantsResponse {
  participants: Participant[]
}

interface ComponentsResponse {
  components: Component[]
}

interface ScenariosResponse {
  scenarios: Scenario[]
}

export default function HomePage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const { data: participantsData, error: participantsError, mutate: mutateParticipants } = useSWR<ParticipantsResponse>(
    initialized ? "/api/participants" : null,
    fetcher,
    { refreshInterval: 5000 }
  )

  const { data: componentsData, error: componentsError } = useSWR<ComponentsResponse>(
    initialized ? "/api/components" : null,
    fetcher
  )

  const { data: scenariosData, error: scenariosError } = useSWR<ScenariosResponse>(
    initialized ? "/api/scenarios" : null,
    fetcher
  )

  const participants = participantsData?.participants || []
  const components = componentsData?.components || []
  const scenarios = scenariosData?.scenarios || []

  useEffect(() => {
    const checkDb = async () => {
      try {
        const res = await fetch("/api/init")
        if (res.ok) {
          const data = await res.json()
          if (data.initialized) {
            setInitialized(true)
          }
        }
      } catch {
        // Database not initialized yet
      }
    }
    checkDb()
  }, [])

  const initializeDatabase = async () => {
    setIsInitializing(true)
    try {
      const response = await fetch("/api/init", { method: "POST" })
      if (response.ok) {
        setInitialized(true)
        mutateParticipants()
      }
    } catch (error) {
      console.error("Failed to initialize database:", error)
    } finally {
      setIsInitializing(false)
    }
  }

  const activeParticipants = participants.filter(p => p.is_active === 1 && !p.is_locked).length
  const totalComponents = components.reduce((sum, c) => sum + c.quantity, 0)
  const totalCategories = [...new Set(components.map(c => c.category))].length

  if (!initialized) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
                <Cpu className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
                IoT Laboratory
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Competition Management System for IoT hardware projects. 
                Initialize the database to begin managing components, scenarios, and participants.
              </p>
            </div>
            
            <Card className="border-2 border-dashed">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                  <Package className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Database Not Initialized</h3>
                    <p className="text-sm text-muted-foreground">
                      Click below to set up the SQLite database with all 49 components and 8 scenarios
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={initializeDatabase}
                    disabled={isInitializing}
                    className="gap-2"
                  >
                    {isInitializing ? (
                      <>
                        <Spinner className="w-4 h-4" />
                        Initializing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Initialize Database
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  const hasError = participantsError || componentsError || scenariosError

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">IoT Laboratory</h1>
                <p className="text-sm text-muted-foreground">Competition Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {hasError && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <p className="text-sm text-destructive">Failed to load some data. Please refresh the page.</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Participants
              </CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeParticipants}</div>
              <p className="text-xs text-muted-foreground">
                of {participants.length} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Components
              </CardTitle>
              <Package className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalComponents}</div>
              <p className="text-xs text-muted-foreground">
                {components.length} unique types
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Scenarios
              </CardTitle>
              <FileText className="w-4 h-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{scenarios.length}</div>
              <p className="text-xs text-muted-foreground">
                competition challenges
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
              <Cpu className="w-4 h-4 text-chart-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalCategories}</div>
              <p className="text-xs text-muted-foreground">
                component categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Participants List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Participants</CardTitle>
                  <CardDescription>
                    Click on a participant to view their dashboard
                  </CardDescription>
                </div>
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Manage <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {!participantsData ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="w-6 h-6" />
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No participants yet</p>
                  <p className="text-sm">Add participants from the admin panel</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {participants.slice(0, 6).map((participant) => (
                    <Link 
                      key={participant.id} 
                      href={`/participant/${participant.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {participant.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{participant.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {participant.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {participant.violation_count > 0 && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {participant.violation_count}
                            </Badge>
                          )}
                          {participant.is_locked ? (
                            <Badge className="gap-1 bg-destructive text-destructive-foreground">
                              <CheckCircle className="w-3 h-3" />
                              Locked
                            </Badge>
                          ) : participant.timer_started_at ? (
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="w-3 h-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline">Waiting</Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {participants.length > 6 && (
                    <Link href="/admin" className="block">
                      <Button variant="ghost" className="w-full">
                        View all {participants.length} participants
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scenarios Quick View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Scenarios</CardTitle>
              <CardDescription>Competition challenges</CardDescription>
            </CardHeader>
            <CardContent>
              {!scenariosData ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="w-6 h-6" />
                </div>
              ) : (
                <div className="space-y-3">
                  {scenarios.map((scenario) => (
                    <div 
                      key={scenario.id}
                      className="p-3 rounded-lg border bg-card"
                    >
                      <p className="font-medium text-sm text-foreground leading-tight">
                        {scenario.title}
                      </p>
                      {scenario.team_number && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Team {scenario.team_number}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Component Categories */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-foreground">Component Inventory</CardTitle>
            <CardDescription>
              49 unique IoT components across multiple categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!componentsData ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="w-6 h-6" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Array.from(new Set(components.map(c => c.category))).map((category) => {
                  const categoryComponents = components.filter(c => c.category === category)
                  const totalQty = categoryComponents.reduce((sum, c) => sum + c.quantity, 0)
                  
                  return (
                    <div key={category} className="p-4 rounded-lg border bg-card text-center">
                      <p className="font-medium text-foreground text-sm mb-1">{category}</p>
                      <p className="text-2xl font-bold text-primary">{categoryComponents.length}</p>
                      <p className="text-xs text-muted-foreground">
                        {totalQty} units total
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            IoT Laboratory Competition Management System - All data stored locally in SQLite
          </p>
        </div>
      </footer>
    </main>
  )
}
