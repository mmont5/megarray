'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

interface AvatarUploadProps {
  user: User
}

export default function AvatarUpload({ user }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setError(null)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      const supabase = getSupabaseBrowserClient()
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error uploading avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
        <div className="mt-1 flex items-center space-x-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                className="h-16 w-16 rounded-full"
                src={user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`}
                alt=""
              />
              <span className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
            </div>
          </div>
          <label
            htmlFor="avatar-upload"
            className={`cursor-pointer rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>{uploading ? 'Uploading...' : 'Change'}</span>
            <input
              id="avatar-upload"
              name="avatar-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
            />
          </label>
        </div>
      </div>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 