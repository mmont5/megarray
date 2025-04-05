'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { QRCodeSVG } from 'qrcode.react'
import type { AuthError } from '@supabase/supabase-js'

interface Message {
  type: 'success' | 'error'
  text: string
}

export default function TwoFactorSetup() {
  const [step, setStep] = useState<'start' | 'qr' | 'verify'>('start')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [factorId, setFactorId] = useState('')
  const [verified, setVerified] = useState(false)
  const [message, setMessage] = useState<Message>({ type: 'success', text: '' })
  const [setupComplete, setSetupComplete] = useState(false)

  const startSetup = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      })

      if (error) throw error
      if (data?.qr) {
        setQrCode(data.qr)
      }
      setFactorId(data.id)
      setStep('qr')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start 2FA setup')
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId
      })
      if (challengeError) throw challengeError
      if (!challenge) throw new Error('Failed to create challenge')

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: verificationCode
      })
      if (verifyError) throw verifyError

      setVerified(true)
      setSuccess('Two-factor authentication enabled successfully!')
      setMessage({ type: 'success', text: 'Two-factor authentication enabled successfully!' })
    } catch (err) {
      const authError = err as AuthError
      setMessage({ type: 'error', text: authError.message || 'Failed to verify code. Please try again.' })
    }
  }

  const verifySetup = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.mfa.challenge({
        factorId: 'totp',
        code: verificationCode
      })

      if (error) throw error
      setSetupComplete(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify 2FA setup')
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
              <QRCodeSVG value={qrCode || ''} size={200} />
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
              onClick={verifyOTP}
              disabled={loading || verificationCode.length !== 6}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? 'Verifying...' : 'Verify and enable'}
            </button>
          </div>
        </div>
      )}

      {message.text && (
        <div className={`rounded-md ${message.type === 'error' ? 'bg-red-50' : 'bg-green-50'} p-4`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'error' ? (
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
              ) : (
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
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${message.type === 'error' ? 'text-red-800' : 'text-green-800'}`}>
                {message.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 