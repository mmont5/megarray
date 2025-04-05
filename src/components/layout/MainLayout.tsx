'use client'

import { useState } from 'react'
import { useUser } from '@/lib/hooks/useUser'
import Header from './Header'
import Footer from './Footer'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, loading } = useUser()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col min-h-screen">
        <Header user={user} loading={loading} onMenuToggle={setMobileMenuOpen} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
} 