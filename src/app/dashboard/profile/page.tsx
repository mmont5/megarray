'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import AvatarUpload from '@/components/profile/AvatarUpload'
import TwoFactorSetup from '@/components/profile/TwoFactorSetup'

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  // Add other profile fields as needed
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    website: '',
    bio: ''
  })
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setUser(user)
          
          // Fetch profile data
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
            
            if (error && error.code !== 'PGRST116') {
              throw error
            }
            
            if (data) {
              setProfile(data)
              setFormData({
                firstName: data.first_name || '',
                lastName: data.last_name || '',
                username: data.username || '',
                website: data.website || '',
                bio: data.bio || ''
              })
              setAvatarUrl(data.avatar_url)
            }
        }
      } catch (error: any) {
        console.error('Error loading user data:', error.message)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    
    getProfile()
  }, [])

  const updateProfile = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault()
    }
    
    try {
      setLoading(true)
      setMessage({ type: '', text: '' })
      
      if (!user) throw new Error('No user')
      
      const updates = {
        id: user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        website: formData.website,
        bio: formData.bio,
        avatar_url,
        updated_at: new Date().toISOString()
      }
      
      const { error } = await supabase
        .from('profiles')
        .upsert(updates)
        
      if (error) throw error
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-5xl py-6 px-4 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
            <p className="mt-1 text-sm text-gray-600">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>
        </div>
        
        <div className="mt-5 md:col-span-2 md:mt-0">
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
              {user && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Photo</label>
                  <div className="mt-2">
                    <AvatarUpload
                      userId={user.id}
                      url={avatar_url}
                      onUpload={(url) => {
                        setAvatarUrl(url)
                        updateProfile()
                      }}
                    />
                  </div>
                </div>
              )}
              
              <form onSubmit={updateProfile}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="col-span-6">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                        https://
                      </span>
                      <input
                        type="text"
                        name="website"
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-6">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your profile.
                    </p>
                  </div>
                </div>
                
                {message.text && (
                  <div className={`mt-4 rounded-md ${
                    message.type === 'error' ? 'bg-red-50' : 'bg-green-50'
                  } p-4`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {message.type === 'error' ? (
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${
                          message.type === 'error' ? 'text-red-800' : 'text-green-800'
                        }`}>
                          {message.text}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>
      
      <div className="mt-10 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Security</h3>
            <p className="mt-1 text-sm text-gray-600">
              Manage your security preferences.
            </p>
          </div>
        </div>
        
        <div className="mt-5 md:col-span-2 md:mt-0">
          <TwoFactorSetup />
        </div>
      </div>
    </div>
  )
} 