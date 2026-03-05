import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });
void inter;

export const metadata: Metadata = {
  title: 'ItenGear - Sports Equipment Marketplace',
  description: 'Kenya\'s leading multi-vendor sports equipment marketplace. Shop running shoes, football boots, gym equipment and more from verified vendors.',
  keywords: ['sports', 'equipment', 'marketplace', 'kenya', 'running', 'football', 'gym'],
  icons: {
    icon: '/images/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a7a2e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
