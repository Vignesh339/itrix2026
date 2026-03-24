import { isInitialized } from "@/lib/db"
import { HomePageClient } from "./home-client"

export default function HomePage() {
  const initialized = isInitialized()
  return <HomePageClient serverInitialized={initialized} />
}
