import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/QueryProvider'
import { AuthProvider } from '@/lib/auth.tsx'
import LayoutWrapper from '@/components/LayoutWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ADHD Task Manager',
  description: 'A task management app designed specifically for people with ADHD',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
