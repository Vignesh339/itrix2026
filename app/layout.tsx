import type { Metadata } from 'next'
import { Orbitron, Space_Grotesk } from 'next/font/google'
import './globals.css'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans-modern',
})

export const metadata: Metadata = {
  title: 'ITRIX 2026 | Sensor Sprint Control Arena',
  description: 'Sensor Sprint event control platform for participant routing, Round 1 and Round 2 execution, and live administration.',
  generator: 'v0.app',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${orbitron.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
