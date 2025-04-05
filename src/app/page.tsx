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
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Welcome to Megarray
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Your modular, multilingual, and AI-powered marketing platform
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/signup"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <Link
                href="/features"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
