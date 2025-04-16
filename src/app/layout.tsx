import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
      <body className={`${inter.className} min-h-screen flex flex-col items-center justify-center`}>
        <div className="w-full max-w-7xl mx-auto px-4">
          {children}
        </div>
      </body>
    </html>
  )
} 