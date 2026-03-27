"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import gsap from "gsap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowRight,
  AlertTriangle,
  Bolt,
  Cpu,
  Radio,
  Settings,
  User,
  Wifi,
  WifiOff,
  Play,
  Trophy,
} from "lucide-react"

const IotAmbientCanvas = dynamic(
  () => import("@/components/iot-ambient-canvas").then((mod) => mod.IotAmbientCanvas),
  { ssr: false }
)

export function HomePageClient({ serverInitialized }: { serverInitialized: boolean }) {
  const router = useRouter()
  const [participantId, setParticipantId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [isInitializing, setIsInitializing] = useState(false)
  const [initialized, setInitialized] = useState(serverInitialized)
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(false)

  const shellRef = useRef<HTMLDivElement>(null)

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

    // Auto-initialize database on first load if not already initialized
    useEffect(() => {
      if (!initialized && !isInitializing) {
        const autoInit = async () => {
          setIsInitializing(true)
          try {
            const response = await fetch("/api/init", { method: "POST" })
            if (response.ok) {
              setInitialized(true)
            }
          } catch (err) {
            console.error("Auto-initialization attempt:", err)
          } finally {
            setIsInitializing(false)
          }
        }
        autoInit()
      }
    }, [initialized, isInitializing])

  useEffect(() => {
    if (!initialized || !shellRef.current) return

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })

      timeline.fromTo(
        ".js-status",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55 }
      )
      timeline.fromTo(
        ".js-hero",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.2"
      )
      timeline.fromTo(
        ".js-kpi",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.1 },
        "-=0.35"
      )
      timeline.fromTo(
        ".js-panel",
        { y: 32, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.12 },
        "-=0.2"
      )
    }, shellRef)

    return () => ctx.revert()
  }, [initialized])

  useEffect(() => {
    const loadLeaderboardStatus = async () => {
      try {
        const response = await fetch("/api/leaderboard")
        if (!response.ok) return
        const data = await response.json()
        setLeaderboardEnabled(Boolean(data?.enabled))
      } catch {
        setLeaderboardEnabled(false)
      }
    }

    if (initialized) {
      loadLeaderboardStatus()
    }
  }, [initialized])

  const initializeDatabase = async () => {
    setIsInitializing(true)
    try {
      const response = await fetch("/api/init", { method: "POST" })
      if (response.ok) {
        setInitialized(true)
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
      const id = participantId.trim().toUpperCase()
      const res = await fetch(`/api/participants/${id}`)

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

      if (data.participant.is_locked) {
        const isSubmitted = data.participant.round1_completed || data.participant.round2_completed
        setError(
          isSubmitted
            ? "Your submission has already been recorded. This ID is no longer valid."
            : "Your session has been locked. Please contact the admin."
        )
        setIsLoading(false)
        return
      }

      const assignedRound = data.participant.assigned_round

      if (assignedRound === "round1") {
        router.push(`/round1/${id}`)
      } else if (assignedRound === "round2") {
        if (data.participant.scenario_id && !data.participant.timer_started_at) {
          await fetch(`/api/participants/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "start_timer",
              duration: data.participant.timer_duration || 3600,
            }),
          })
        }
        router.push(`/participant/${id}`)
      } else {
        setError("Round assignment pending. Please contact the admin.")
        setIsLoading(false)
      }
    } catch {
      setError("Connection error. The system works offline - ensure the local server is running.")
      setIsLoading(false)
    }
  }

  if (!initialized) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-background px-4 py-8">
        <div className="iot-grid-overlay" />
        <div className="relative mx-auto flex min-h-[85vh] w-full max-w-2xl items-center justify-center">
          <Card className="w-full border-white/10 bg-card/80 backdrop-blur-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-accent/30 bg-accent/15">
                <Cpu className="h-9 w-9 text-accent" />
              </div>
              <CardTitle className="text-3xl font-semibold tracking-tight">Competition Control Center</CardTitle>
              <CardDescription>Initialize the platform and prime all IoT challenge modules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Initialization prepares the local database with components, round assignments, and scenario data.
              </p>
              <Button onClick={initializeDatabase} disabled={isInitializing} className="h-12 w-full gap-2" size="lg">
                {isInitializing ? (
                  <>
                    <Spinner className="h-4 w-4" />
                      Auto-initializing System...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                      Click to Initialize System
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main ref={shellRef} className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="iot-grid-overlay" />
      <IotAmbientCanvas />
      <div className="scan-line" />

      <section className="js-status relative border-b border-white/10 bg-black/35 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3 text-sm">
            <span className="pulse-dot" aria-hidden />
            {isOnline ? (
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Wifi className="h-3.5 w-3.5" />
                Network Ready
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-300">
                <WifiOff className="h-3.5 w-3.5" />
                Offline Safe Mode
              </span>
            )}
          </div>
          <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.22em] text-cyan-100/70 sm:flex">
            <Radio className="h-3.5 w-3.5" />
            Local Server Active
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-10 md:px-8 md:pt-14">
        <div className="js-hero mb-8 md:mb-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
            <Bolt className="h-3.5 w-3.5" />
            Live Prototype Arena
          </div>
          <div className="sensor-sprint-banner max-w-4xl">
            <span className="sensor-sprint-chip">Circuit Mode</span>
            <h1 className="sensor-sprint-title">Sensor Sprint</h1>
            <div className="sensor-sprint-trace" aria-hidden>
              <span />
              <span />
              <span />
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-pretty text-base text-cyan-100/80 md:text-lg">
            Build fast, test smart, and deploy logic under pressure. This control deck powers timed IoT rounds with scenario execution, participant routing, and live hint tracking.
          </p>
        </div>

        <div className="mb-10 grid gap-3 sm:grid-cols-3 md:mb-14">
          <div className="js-kpi glass-kpi">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">Signal Pulse</p>
            <p className="mt-1 text-2xl font-semibold">Realtime</p>
          </div>
          <div className="js-kpi glass-kpi">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">Challenge Grid</p>
            <p className="mt-1 text-2xl font-semibold">8 Scenario Tracks</p>
          </div>
          <div className="js-kpi glass-kpi">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">Execution Mode</p>
            <p className="mt-1 text-2xl font-semibold">Timed & Proctored</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Card className="js-panel border-white/10 bg-slate-950/60 backdrop-blur-xl transition-colors hover:border-cyan-300/50">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-400/15">
                <Settings className="h-6 w-6 text-cyan-200" />
              </div>
              <CardTitle className="text-2xl">Admin Operations</CardTitle>
              <CardDescription className="text-cyan-100/70">
                Manage participants, assign rounds, observe progress, and audit session events in one control room.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="h-12 w-full gap-2" size="lg" onClick={() => router.push("/admin")}>
                Enter Admin Panel
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-center text-xs text-cyan-100/60">Credential-protected command access</p>
            </CardContent>
          </Card>

          <Card className="js-panel border-white/10 bg-slate-950/60 backdrop-blur-xl transition-colors hover:border-cyan-300/50">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-300/30 bg-emerald-300/15">
                <User className="h-6 w-6 text-emerald-200" />
              </div>
              <CardTitle className="text-2xl">Participant Gateway</CardTitle>
              <CardDescription className="text-cyan-100/70">
                Enter your participant code to start your assigned round and timed challenge scenario.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleParticipantAccess} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter Participant ID"
                  value={participantId}
                  onChange={(e) => {
                    setParticipantId(e.target.value.toUpperCase())
                    setError(null)
                  }}
                  className="h-12 border-white/20 bg-black/35 text-center font-mono text-lg tracking-[0.28em] text-cyan-50 placeholder:text-cyan-100/40"
                  autoComplete="off"
                  spellCheck={false}
                />
                {error && (
                  <Alert variant="destructive" className="border-red-400/40 bg-red-900/30 py-2">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <AlertDescription className="ml-2 text-sm">{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="h-12 w-full gap-2" size="lg" disabled={isLoading}>
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

          {leaderboardEnabled ? (
            <Card className="js-panel border-white/10 bg-slate-950/60 backdrop-blur-xl transition-colors hover:border-cyan-300/50 md:col-span-2">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-300/30 bg-amber-300/15">
                  <Trophy className="h-6 w-6 text-amber-200" />
                </div>
                <CardTitle className="text-2xl">Public Leaderboard</CardTitle>
                <CardDescription className="text-cyan-100/70">
                  Live team ranking for completed Round 1 scores. Visible to everyone when enabled by admin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="h-12 w-full gap-2 md:w-auto" size="lg" onClick={() => router.push("/leaderboard")}>
                  View Leaderboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <p className="mt-10 text-center text-xs uppercase tracking-[0.2em] text-cyan-100/55 md:mt-14">
          Autonomous local runtime • zero external dependency during live rounds
        </p>
      </section>
    </main>
  )
}
