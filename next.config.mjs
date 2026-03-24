/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["*.replit.dev", "*.janeway.replit.dev", "*.repl.co"],
}

export default nextConfig
