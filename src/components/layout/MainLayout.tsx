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
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col">
        <Header user={user} loading={loading} onMenuToggle={setMobileMenuOpen} />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  )
} 