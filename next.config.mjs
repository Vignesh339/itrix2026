import path from "path"
import { fileURLToPath } from "url"

const workspaceRoot = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: workspaceRoot,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "*.replit.dev",
    "*.janeway.replit.dev",
    "*.spock.replit.dev",
    "*.worf.replit.dev",
    "*.riker.replit.dev",
    "*.kirk.replit.dev",
    "*.repl.co",
  ],
}

export default nextConfig
