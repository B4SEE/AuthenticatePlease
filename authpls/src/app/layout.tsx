import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AuthenticatePlease',
  description: 'A cybersecurity training game that simulates real-world phishing scenarios',
  keywords: 'phishing, cybersecurity, training, game, security-awareness',
  authors: [{ name: 'B4SEE', url: 'https://github.com/B4SEE' }],
  metadataBase: new URL('https://github.com/B4SEE/AuthenticatePlease'),
  openGraph: {
    title: 'AuthenticatePlease',
    description: 'A cybersecurity training game that simulates real-world phishing scenarios',
    url: 'https://github.com/B4SEE/AuthenticatePlease',
    siteName: 'AuthenticatePlease',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/AuthenticatePlease.png',
        width: 1200,
        height: 630,
        alt: 'AuthenticatePlease - Phishing Detection Training Game'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuthenticatePlease',
    description: 'A cybersecurity training game that simulates real-world phishing scenarios',
    images: ['/AuthenticatePlease.png']
  }
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-[#0a0a0a] text-white">
          {children}
        </main>
      </body>
    </html>
  )
} 