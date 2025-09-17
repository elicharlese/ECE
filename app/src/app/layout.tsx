import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SubscriptionProvider } from '@/contexts/subscription-context'
import { ThemeProvider } from '@/contexts/theme-context'
import { AppLayout } from '../components/app-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ECE Trading Cards',
  description: 'Enterprise Card Exchange - Trading Cards Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider>
          <SubscriptionProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </SubscriptionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
