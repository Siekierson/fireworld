import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import RightSidebar from '@/components/RightSidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FireWorld',
  description: 'Your social media platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-red-900">
          <Sidebar />
          <main className="flex-1 ml-64 mr-80">
            <div className="max-w-2xl mx-auto px-4 py-8">
              {children}
            </div>
          </main>
          <RightSidebar />
        </div>
      </body>
    </html>
  )
} 