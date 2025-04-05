'use client'

import { useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface AvatarUploadProps {
  userId: string
  url?: string | null
  onUpload: (url: string) => void
  size?: number
}

export default function AvatarUpload({ userId, url, onUpload, size = 150 }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cropMode, setCropMode] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  })

  const compressImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = document.createElement('img')
        img.src = event.target?.result as string
        img.onload = () => {
          // Calculate dimensions while maintaining aspect ratio
          let width = img.width
          let height = img.height
          
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width)
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height)
              height = maxHeight
            }
          }
          
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
          }
          
          ctx.drawImage(img, 0, 0, width, height)
          
          // Convert to Blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob conversion failed'))
                return
              }
              resolve(blob)
            },
            file.type,
            quality
          )
        }
        img.onerror = () => {
          reject(new Error('Image loading error'))
        }
      }
      reader.onerror = () => {
        reject(new Error('FileReader error'))
      }
    })
  }

  const validateFile = (file: File): boolean => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, GIF or WebP image.')
      return false
    }
    
    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      setError('File size too large. Maximum size is 2MB.')
      return false
    }
    
    return true
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    
    if (!event.target.files || event.target.files.length === 0) {
      return
    }

    const file = event.target.files[0]
    
    if (!validateFile(file)) {
      return
    }

    // Create a preview for cropping
    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setCropMode(true)
    }
    reader.readAsDataURL(file)
  }

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: Crop,
    fileName: string
  ): Promise<File> => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    
    canvas.width = crop.width ?? 0
    canvas.height = crop.height ?? 0
    
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }
    
    ctx.drawImage(
      image,
      (crop.x ?? 0) * scaleX,
      (crop.y ?? 0) * scaleY,
      (crop.width ?? 0) * scaleX,
      (crop.height ?? 0) * scaleY,
      0,
      0,
      crop.width ?? 0,
      crop.height ?? 0
    )
    
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas to Blob conversion failed'))
          return
        }
        const file = new File([blob], fileName, { type: 'image/jpeg' })
        resolve(file)
      }, 'image/jpeg', 0.95)
    })
  }

  const handleCropComplete = useCallback(async () => {
    try {
      setUploading(true)
      setCropMode(false)
      
      if (!imgRef.current) {
        throw new Error('No image reference found')
      }
      
      const originalFile = fileInputRef.current?.files?.[0]
      if (!originalFile) {
        throw new Error('No file selected')
      }
      
      // Get the cropped image
      const croppedFile = await getCroppedImg(
        imgRef.current,
        crop,
        originalFile.name
      )
      
      // Compress the cropped image
      const compressedBlob = await compressImage(croppedFile)
      
      // Convert Blob to File
      const compressedFile = new File(
        [compressedBlob],
        originalFile.name,
        { type: 'image/jpeg' }
      )
      
      const fileExt = 'jpg' // Always save as jpg after cropping
      const filePath = `${userId}/avatar.${fileExt}`

      // Upload the compressed file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile, { upsert: true })

      if (uploadError) throw uploadError

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      onUpload(publicUrl)
      
      // Reset
      setImageSrc(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }, [crop, userId, onUpload])

  const handleCropCancel = () => {
    setCropMode(false)
    setImageSrc(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (cropMode && imageSrc) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Crop your avatar</h3>
        <div className="max-w-md overflow-hidden">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={1}
            circularCrop
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              className="max-w-full h-auto"
            />
          </ReactCrop>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleCropComplete}
            disabled={uploading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {uploading ? 'Uploading...' : 'Apply and Upload'}
          </button>
          <button
            onClick={handleCropCancel}
            disabled={uploading}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center space-x-6">
        <div className="relative h-[150px] w-[150px]">
          {url ? (
            <Image
              src={url}
              alt="Avatar"
              className="rounded-full object-cover"
              width={size}
              height={size}
            />
          ) : (
            <div 
              className="flex items-center justify-center rounded-full bg-gray-200 text-gray-400"
              style={{ width: size, height: size }}
            >
              <svg
                className="h-24 w-24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          )}

          <button
            className="absolute bottom-0 right-0 rounded-full bg-gray-800 p-2 text-white shadow-lg hover:bg-gray-700"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/png, image/jpeg, image/gif, image/webp"
            className="hidden"
          />
          <div className="text-sm text-gray-500">
            {uploading ? (
              'Uploading...'
            ) : (
              <>
                Click the camera icon to upload a new avatar
                <br />
                JPG, PNG, GIF, WebP up to 2MB
                <br />
                You'll be able to crop and resize your image
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
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