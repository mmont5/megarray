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
      '24/7 priority support',
      'Advanced AI features',
      'Custom integrations',
      'Dedicated account manager',
    ],
  },
]

const testimonials = [
  {
    content: "Megarray has transformed how we manage our social media. The AI insights are incredibly valuable.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp Inc."
  },
  {
    content: "The analytics and scheduling features save us hours every week. It's an essential tool for our team.",
    author: "Michael Chen",
    role: "Social Media Manager",
    company: "Growth Solutions"
  },
  {
    content: "Best social media management platform we've used. The team collaboration features are outstanding.",
    author: "Emma Williams",
    role: "Content Creator",
    company: "Creative Studios"
  }
]

const integrations = [
  { name: 'Twitter', icon: faTwitter },
  { name: 'Instagram', icon: faInstagram },
  { name: 'Facebook', icon: faFacebook },
  { name: 'LinkedIn', icon: faLinkedin },
  { name: 'TikTok', icon: faTiktok },
  { name: 'YouTube', icon: faYoutube },
]

const faqs = [
  {
    question: "How does the 14-day free trial work?",
    answer: "Start your free trial with full access to all Professional plan features. No credit card required. At the end of the trial, choose the plan that best fits your needs."
  },
  {
    question: "Can I change plans later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing."
  },
  {
    question: "What kind of support do you offer?",
    answer: "We offer email support for all plans, with priority support for Professional and Enterprise plans. Enterprise customers also get access to 24/7 phone support and a dedicated account manager."
  },
  {
    question: "Do you offer custom solutions?",
    answer: "Yes, our Enterprise plan can be customized to meet your specific needs. Contact our sales team to discuss custom solutions."
  }
]

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pt-24">
        <ParticlesBackground />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mb-8">
                Now in public beta
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Your social media, supercharged
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Manage all your social media accounts from a single dashboard. Schedule posts, analyze performance, and grow your audience with our AI-powered tools.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started for free
                </Link>
                <Link href="/demo" className="text-base font-semibold leading-6 text-white flex items-center">
                  Book a demo <FontAwesomeIcon icon={faChevronRight} className="ml-2 h-3 w-3" />
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="/dashboard-preview.png"
                alt="Dashboard preview"
                width={800}
                height={600}
                className="rounded-xl shadow-2xl border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature section */}
      <div id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Powerful Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your social media
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              From analytics to scheduling, we provide all the tools you need to grow your social media presence.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <FontAwesomeIcon icon={feature.icon} className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Pricing section */}
      <div id="pricing" className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Pricing</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Choose the perfect plan for your needs
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
            Start with our 14-day free trial. No credit card required.
          </p>
          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {pricing.map((tier, tierIdx) => (
              <div
                key={tier.name}
                className={`
                  flex flex-col justify-between rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 xl:p-10
                  ${tierIdx === 1 ? 'lg:z-10 lg:rounded-b-none' : ''}
                  ${tierIdx === 0 ? 'lg:rounded-r-none' : ''}
                  ${tierIdx === 2 ? 'lg:rounded-l-none' : ''}
                `}
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3 className="text-lg font-semibold leading-8 text-white">{tier.name}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-300">{tier.description}</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-white">${tier.price}</span>
                    <span className="text-sm font-semibold leading-6 text-gray-300">/month</span>
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <FontAwesomeIcon icon={faCheck} className="h-6 w-5 flex-none text-white" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={tier.name === 'Enterprise' ? '/contact' : '/auth/signup'}
                  className={`
                    mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                    ${
                      tierIdx === 1
                        ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }
                  `}
                >
                  {tier.name === 'Enterprise' ? 'Contact sales' : 'Get started'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial section */}
      <div className="relative isolate overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Testimonials</h2>
            <div className="mt-16 grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.author} className="flex flex-col">
                  <div className="flex flex-1 flex-col justify-between bg-white px-6 pb-8 pt-10 ring-1 ring-inset ring-gray-200 rounded-3xl">
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="mt-1 text-base text-gray-600">{testimonial.role}</p>
                      <p className="mt-4 text-base italic text-gray-600">"{testimonial.content}"</p>
                    </div>
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Integration partners section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Integrations</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Connect with your favorite platforms
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Seamlessly integrate with all major social media platforms
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-6">
            {integrations.map((integration) => (
              <div key={integration.name} className="col-span-2 flex justify-center lg:col-span-1">
                <FontAwesomeIcon
                  icon={integration.icon}
                  className="h-12 w-12 text-gray-500 hover:text-indigo-600 transition-colors"
                  aria-label={integration.name}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
              Frequently asked questions
            </h2>
            <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
              {faqs.map((faq) => (
                <div key={faq.question} className="pt-6">
                  <dt>
                    <h3 className="text-base font-semibold leading-7 text-gray-900">{faq.question}</h3>
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Newsletter section */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            <div className="max-w-xl lg:max-w-lg">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Stay updated with Megarray.</h2>
              <p className="mt-4 text-lg leading-8 text-gray-300">
                Subscribe to our newsletter for the latest features, tips, and social media management insights.
              </p>
              <div className="mt-6 flex max-w-md gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA section */}
      <div className="relative isolate bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to boost your social media presence?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Join thousands of businesses that trust us with their social media management.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/signup"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <Link href="/contact" className="text-sm font-semibold leading-6 text-gray-900">
                Contact sales <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
