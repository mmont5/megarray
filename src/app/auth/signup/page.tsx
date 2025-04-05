'use client'

export const dynamic = 'force-dynamic'

import { useState, FormEvent } from 'react';
import type { ReactElement } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub, faFacebookF, faApple } from '@fortawesome/free-brands-svg-icons';
import ParticlesBackground from '@/components/layout/ParticlesBackground';
import MainLayout from '@/components/layout/MainLayout';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function SignUpPage(): ReactElement {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Handle successful signup here
    } catch (error) {
      setErrors({ email: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="relative">
        <ParticlesBackground />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center py-12">
            <div className="relative z-10 w-full max-w-sm space-y-8">
              <div>
                <h2 className="text-center text-3xl font-bold tracking-tight text-white">
                  Create an account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 bg-gray-900/30 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Sign up with Google"
                >
                  <FontAwesomeIcon icon={faGoogle} className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 bg-gray-900/30 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Sign up with Facebook"
                >
                  <FontAwesomeIcon icon={faFacebookF} className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 bg-gray-900/30 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Sign up with GitHub"
                >
                  <FontAwesomeIcon icon={faGithub} className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 bg-gray-900/30 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Sign up with Apple"
                >
                  <FontAwesomeIcon icon={faApple} className="h-5 w-5" />
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-900 px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData({ ...formData, firstName: e.target.value });
                        if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                      }}
                      className={`mt-2 block w-full rounded-lg border-0 bg-white/5 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ${
                        errors.firstName ? 'ring-red-500' : 'ring-white/10'
                      } focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm`}
                      placeholder="First name"
                    />
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={formData.lastName}
                      onChange={(e) => {
                        setFormData({ ...formData, lastName: e.target.value });
                        if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                      }}
                      className={`mt-2 block w-full rounded-lg border-0 bg-white/5 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ${
                        errors.lastName ? 'ring-red-500' : 'ring-white/10'
                      } focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm`}
                      placeholder="Last name"
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    className={`mt-2 block w-full rounded-lg border-0 bg-white/5 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ${
                      errors.email ? 'ring-red-500' : 'ring-white/10'
                    } focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    className={`mt-2 block w-full rounded-lg border-0 bg-white/5 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ${
                      errors.password ? 'ring-red-500' : 'ring-white/10'
                    } focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm`}
                    placeholder="Create a password"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    className={`mt-2 block w-full rounded-lg border-0 bg-white/5 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ${
                      errors.confirmPassword ? 'ring-red-500' : 'ring-white/10'
                    } focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={formData.terms}
                      onChange={(e) => {
                        setFormData({ ...formData, terms: e.target.checked });
                        if (errors.terms) setErrors({ ...errors, terms: undefined });
                      }}
                      className={`h-4 w-4 rounded border-gray-700 bg-white/5 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900 ${
                        errors.terms ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                    I agree to the{' '}
                    <Link href="/terms" className="font-medium text-indigo-400 hover:text-indigo-300">
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="font-medium text-indigo-400 hover:text-indigo-300">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-500">{errors.terms}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-r-transparent" />
                  ) : (
                    'Create account'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
