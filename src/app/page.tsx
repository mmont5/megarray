'use client';

import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartBar,
  faClock,
  faUsers,
  faGlobe,
  faComments,
  faRocket,
  faCheck,
  faChevronRight,
  faChartLine,
  faRobot,
  faLock,
  faChartPie
} from '@fortawesome/free-solid-svg-icons'
import {
  faTwitter,
  faInstagram,
  faFacebook,
  faLinkedin,
  faTiktok,
  faYoutube
} from '@fortawesome/free-brands-svg-icons'
import ParticlesBackground from '@/components/layout/ParticlesBackground'
import MainLayout from '@/components/layout/MainLayout'

const features = [
  {
    name: 'Analytics Dashboard',
    description: 'Get detailed insights into your social media performance with real-time analytics and customizable reports.',
    icon: faChartBar,
  },
  {
    name: 'Content Scheduling',
    description: 'Plan and schedule your content across multiple platforms with our intuitive scheduling tools.',
    icon: faClock,
  },
  {
    name: 'Team Collaboration',
    description: 'Work seamlessly with your team members with role-based permissions and approval workflows.',
    icon: faUsers,
  },
  {
    name: 'Multi-Platform Support',
    description: 'Manage all your social media accounts from a single dashboard with support for major platforms.',
    icon: faGlobe,
  },
  {
    name: 'AI-Powered Insights',
    description: 'Get smart recommendations for content optimization and audience engagement using AI.',
    icon: faRocket,
  },
  {
    name: 'Engagement Tools',
    description: 'Monitor and respond to comments, messages, and mentions across all your social channels.',
    icon: faComments,
  },
]

const pricing = [
  {
    name: 'Starter',
    price: 29,
    description: 'Perfect for individuals and small teams getting started with social media management.',
    features: [
      '5 social media accounts',
      'Basic analytics',
      'Content scheduling',
      'Team collaboration (up to 2 users)',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    price: 79,
    description: 'Ideal for growing businesses and marketing teams.',
    features: [
      '15 social media accounts',
      'Advanced analytics',
      'Content scheduling & calendar',
      'Team collaboration (up to 5 users)',
      'Priority email support',
      'AI-powered insights',
      'Custom reports',
    ],
  },
  {
    name: 'Enterprise',
    price: 199,
    description: 'For large organizations requiring advanced features and support.',
    features: [
      'Unlimited social media accounts',
      'Enterprise analytics',
      'Advanced content scheduling',
      'Unlimited team members',
      'Dedicated account manager',
      'Custom integrations',
      'API access',
      '24/7 priority support',
    ],
  },
]

const socialPlatforms = [
  { name: 'Twitter', icon: faTwitter, color: 'text-blue-400' },
  { name: 'Instagram', icon: faInstagram, color: 'text-pink-500' },
  { name: 'Facebook', icon: faFacebook, color: 'text-blue-600' },
  { name: 'LinkedIn', icon: faLinkedin, color: 'text-blue-700' },
  { name: 'TikTok', icon: faTiktok, color: 'text-black' },
  { name: 'YouTube', icon: faYoutube, color: 'text-red-600' },
]

export default function Home() {
  return (
    <MainLayout>
      <ParticlesBackground />
      <div className="relative">
        {/* Hero Section */}
        <div className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Your All-in-One</span>
                <span className="block text-indigo-600">Social Media Management Platform</span>
              </h1>
              <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                Streamline your social media presence with AI-powered tools for content creation, scheduling, analytics, and more.
              </p>
              <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link
                    href="/auth/signup"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
                  >
                    Get started
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link
                    href="/features"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-indigo-600 hover:bg-gray-50 md:py-4 md:px-10 md:text-lg"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to manage your social media
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
                Our platform combines powerful tools with AI to help you create, schedule, and analyze your social media content.
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.name} className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="absolute -top-4 left-6 rounded-full bg-indigo-600 p-2">
                      <FontAwesomeIcon icon={feature.icon} className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.name}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-gray-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
                Choose the plan that's right for your business. All plans include a 14-day free trial.
              </p>
            </div>

            <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3">
              {pricing.map((tier) => (
                <div key={tier.name} className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">{tier.name}</h3>
                    <p className="mt-4 text-sm text-gray-500">{tier.description}</p>
                    <p className="mt-8">
                      <span className="text-4xl font-bold tracking-tight text-gray-900">${tier.price}</span>
                      <span className="text-base font-medium text-gray-500">/month</span>
                    </p>
                    <Link
                      href="/auth/signup"
                      className="mt-8 block w-full rounded-md border border-transparent bg-indigo-600 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Start free trial
                    </Link>
                  </div>
                  <div className="px-6 pt-6 pb-8">
                    <h4 className="text-sm font-medium text-gray-900">What's included</h4>
                    <ul className="mt-6 space-y-4">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex space-x-3">
                          <FontAwesomeIcon icon={faCheck} className="h-5 w-5 flex-shrink-0 text-green-500" />
                          <span className="text-sm text-gray-500">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Platforms Section */}
        <div className="bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Connect with your audience everywhere
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
                Manage all your social media accounts from one place with support for the most popular platforms.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
              {socialPlatforms.map((platform) => (
                <div key={platform.name} className="flex flex-col items-center">
                  <FontAwesomeIcon
                    icon={platform.icon}
                    className={`h-12 w-12 ${platform.color}`}
                  />
                  <span className="mt-2 text-sm font-medium text-gray-900">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-700">
          <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-indigo-200">Start your free trial today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Get started
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
                >
                  Contact sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
