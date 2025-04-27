import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ChatAssistant from '@/components/ChatAssistant'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FireWorld',
  description: 'Social media platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <div className="flex h-screen">
          <main className="flex-1 overflow-y-auto">
            <div className="w-full max-w-7xl mx-auto px-4">
              {children}
            </div>
          </main>
        
        </div>
      </body>
    </html>
  )
} 