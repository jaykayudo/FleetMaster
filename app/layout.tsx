import type React from 'react'
import '@/app/globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'FleetMaster - Fleet Management System',
  description: 'Manage your fleet vehicles, maintenance schedules, and trips',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

import './globals.css'
