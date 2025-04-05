'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import QRCode from 'qrcode.react'

export default function TwoFactorSetup() {
  const [step, setStep] = useState<'start' | 'qr' | 'verify'>('start')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const startSetup = async () => {
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.mfa.enroll()
      if (error) throw error

      setQrCode(data.qr_code)
      setSecret(data.secret)
      setStep('qr')
    } catch (err: any) {
      setError(err.message || 'Failed to start 2FA setup')
    } finally {
      setLoading(false)
    }
  }

  const verifyAndEnable = async () => {
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.mfa.challenge({ 
        factorId: secret,
        code: verificationCode 
      })
      if (error) throw error

      const { error: verifyError } = await supabase.auth.mfa.verify({ 
        factorId: secret,
        code: verificationCode 
      })
      if (verifyError) throw verifyError

      setSuccess('Two-factor authentication enabled successfully')
      setStep('start')
    } catch (err: any) {
      setError(err.message || 'Failed to verify code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Two-Factor Authentication</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add an extra layer of security to your account by enabling two-factor authentication.
        </p>
      </div>

      {step === 'start' && (
        <div>
          <button
            onClick={startSetup}
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? 'Setting up...' : 'Set up two-factor authentication'}
          </button>
        </div>
      )}

      {step === 'qr' && (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700 mb-4">
              1. Scan this QR code with your authenticator app (e.g., Google Authenticator, Authy)
            </p>
            <div className="inline-block p-4 bg-white border rounded-lg">
              <QRCode value={qrCode} size={200} />
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-700 mb-2">
              2. Enter the verification code from your authenticator app
            </p>
            <div className="mt-1 flex rounded-md shadow-sm max-w-xs">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
          </div>

          <div>
            <button
              onClick={verifyAndEnable}
              disabled={loading || verificationCode.length !== 6}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? 'Verifying...' : 'Verify and enable'}
            </button>
          </div>
        </div>
      )}

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

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 