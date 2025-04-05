'use client'

import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase/client'
import Header from './Header'
import Footer from './Footer'

const navigation = [
  { name: 'Features', href: '/#features' },
  { name: 'Solutions', href: '/#solutions' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
]

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      <Header />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  )
} 