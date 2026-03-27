"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useMemo, useRef, useState, useEffect } from "react"

function DataRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ringRef = useRef<any>(null)

  useFrame((state) => {
    if (!ringRef.current) return
    ringRef.current.rotation.z = state.clock.elapsedTime * speed
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.01, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.28} />
    </mesh>
  )
}

function DataPoints() {
  const pointsRef = useRef<any>(null)

  const positions = useMemo(() => {
    const count = 900
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const angle = Math.random() * Math.PI * 2
      const radius = 1.2 + Math.random() * 3.5
      const spread = (Math.random() - 0.5) * 2.8
      arr[i3] = Math.cos(angle) * radius
      arr[i3 + 1] = spread
      arr[i3 + 2] = Math.sin(angle) * radius
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.04
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.04
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#3ee8d6" size={0.02} sizeAttenuation transparent opacity={0.7} />
    </points>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[2, 2, 2]} color="#5dffe7" intensity={0.6} />
      <DataPoints />
      <group rotation={[Math.PI / 2, 0, 0]}>
        <DataRing radius={1.2} speed={0.15} color="#10b5ff" />
        <DataRing radius={1.8} speed={-0.08} color="#3ee8d6" />
        <DataRing radius={2.4} speed={0.05} color="#6ac9ff" />
      </group>
    </>
  )
}

export function IotAmbientCanvas() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const testCanvas = document.createElement("canvas")
      const ctx = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")
      if (!ctx) return
      const ext = (ctx as WebGLRenderingContext).getExtension("WEBGL_lose_context")
      ext?.loseContext()
      setVisible(true)
    } catch {
      // WebGL not available — skip canvas
    }

    const onRejection = (event: PromiseRejectionEvent) => {
      const msg: string = event.reason?.message ?? ""
      if (msg.includes("WebGL") || msg.includes("webgl")) {
        event.preventDefault()
        setVisible(false)
      }
    }
    window.addEventListener("unhandledrejection", onRejection)
    return () => window.removeEventListener("unhandledrejection", onRejection)
  }, [])

  if (!visible) return null

  return (
    <div className="pointer-events-none absolute inset-0 opacity-75">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 55 }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault()
            setVisible(false)
          })
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
