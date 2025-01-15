import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Lyric Generator - Create Human-Like Song Lyrics with AI | Cody Productions',
  description: 'Generate human-sounding song lyrics effortlessly with Cody Productions\' AI Lyric Generator. Customize themes and moods to create unique and creative lyrics tailored to your style.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen overflow-hidden bg-background">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
