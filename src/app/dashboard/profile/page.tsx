'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import ProfileSettings from '@/components/profile/ProfileSettings'
import TwoFactorSetup from '@/components/profile/TwoFactorSetup'
import AvatarUpload from '@/components/profile/AvatarUpload'

interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  updated_at: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please sign in to access your profile.</p>
      </div>
    )
  }

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Profile Settings</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="space-y-6">
            <AvatarUpload user={user} />
            <ProfileSettings user={user} />
            <TwoFactorSetup />
          </div>
        </div>
      </main>
    </div>
  )
} 