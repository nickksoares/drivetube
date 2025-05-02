'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/Navbar'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from './contexts/ThemeContext'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Navbar />
            <main>{children}</main>
          </div>
          <Toaster />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}