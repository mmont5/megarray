'use client';

import type { ReactElement } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faClock,
  faUsers,
  faGlobe,
  faComments,
  faRocket,
  faChartLine,
  faRobot,
  faLock,
  faChartPie,
  faCalendarAlt,
  faLaptopCode
} from '@fortawesome/free-solid-svg-icons';
import MainLayout from '@/components/layout/MainLayout';

const mainFeatures = [
  {
    name: 'Analytics Dashboard',
    description: 'Get detailed insights into your social media performance with real-time analytics and customizable reports.',
    icon: faChartBar,
    image: '/features/analytics.jpg',
    details: [
      'Real-time performance metrics across all platforms',
      'Audience demographics and engagement analysis',
      'Content performance tracking and optimization',
      'Customizable reports for different stakeholders'
    ]
  },
  {
    name: 'Content Scheduling',
    description: 'Plan and schedule your content across multiple platforms with our intuitive scheduling tools.',
    icon: faClock,
    image: '/features/scheduling.jpg',
    details: [
      'Drag-and-drop calendar interface',
      'Bulk scheduling capabilities',
      'Platform-specific formatting',
      'Optimal posting time recommendations'
    ]
  },
  {
    name: 'AI Content Assistant',
    description: 'Generate content ideas, optimize captions, and craft platform-specific posts with our AI-powered assistant.',
    icon: faRobot,
    image: '/features/ai-assistant.jpg',
    details: [
      'Content idea generation based on your brand voice',
      'Caption optimization for engagement',
      'Hashtag recommendations',
      'Platform-specific formatting suggestions'
    ]
  },
  {
    name: 'Team Collaboration',
    description: 'Work seamlessly with your team members with role-based permissions and approval workflows.',
    icon: faUsers,
    image: '/features/team.jpg',
    details: [
      'Role-based access control',
      'Content approval workflows',
      'Team member performance analytics',
      'Collaborative content calendar'
    ]
  },
  {
    name: 'Multi-Platform Support',
    description: 'Manage all your social media accounts from a single dashboard with support for major platforms.',
    icon: faGlobe,
    image: '/features/platforms.jpg',
    details: [
      'Support for all major social platforms',
      'Cross-platform content adaptation',
      'Unified inbox for all messages',
      'Platform-specific analytics'
    ]
  },
  {
    name: 'Engagement Tools',
    description: 'Monitor and respond to comments, messages, and mentions across all your social channels.',
    icon: faComments,
    image: '/features/engagement.jpg',
    details: [
      'Unified social inbox',
      'Automated response suggestions',
      'Sentiment analysis',
      'Engagement performance tracking'
    ]
  },
];

const additionalFeatures = [
  {
    name: 'Advanced Analytics',
    description: 'Dive deep into your performance metrics with customizable dashboards.',
    icon: faChartLine,
  },
  {
    name: 'Competitor Analysis',
    description: 'Track and analyze your competitors\' social media performance.',
    icon: faChartPie,
  },
  {
    name: 'Content Calendar',
    description: 'Visualize your content strategy with an interactive calendar view.',
    icon: faCalendarAlt,
  },
  {
    name: 'API Integration',
    description: 'Connect Megarray with your existing tools through our developer-friendly API.',
    icon: faLaptopCode,
  },
  {
    name: 'Secure Data Storage',
    description: 'Rest easy knowing your data is protected with enterprise-grade security.',
    icon: faLock,
  },
  {
    name: 'Performance Optimization',
    description: 'Get AI-powered recommendations to improve your social media strategy.',
    icon: faRocket,
  },
];

export default function FeaturesPage(): ReactElement {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Powerful Features
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Discover the tools that will transform how you manage your social media presence. From analytics to AI-powered content creation, we've got you covered.
            </p>
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white">Core Features</h2>
            <p className="mt-4 text-lg text-gray-300">
              Everything you need to manage your social media marketing effectively and efficiently.
            </p>
          </div>

          <div className="space-y-32">
            {mainFeatures.map((feature, index) => (
              <div 
                key={feature.name} 
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="lg:w-1/2">
                  <div className="flex items-center gap-x-3 mb-6">
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-indigo-600">
                      <FontAwesomeIcon icon={feature.icon} className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{feature.name}</h3>
                  </div>
                  <p className="text-lg text-gray-300 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-start">
                        <div className="text-indigo-400 mr-2">•</div>
                        <span className="text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:w-1/2 relative h-80 lg:h-96 w-full overflow-hidden rounded-2xl">
                  <Image
                    src={feature.image}
                    alt={feature.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-2xl"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="bg-gray-900/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white">Additional Features</h2>
            <p className="mt-4 text-lg text-gray-300">
              Explore the full suite of tools that make Megarray the most comprehensive social media management platform.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-12 sm:mt-20 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {additionalFeatures.map((feature) => (
              <div key={feature.name} className="bg-gray-800/30 rounded-2xl p-8 border border-white/5 hover:bg-gray-800/50 transition duration-300">
                <div className="flex items-center gap-x-4 mb-6">
                  <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-indigo-600/20">
                    <FontAwesomeIcon icon={feature.icon} className="h-6 w-6 text-indigo-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.name}</h3>
                </div>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-3xl bg-indigo-500/10 px-8 py-16 ring-1 ring-inset ring-indigo-500/20 sm:px-16 sm:py-24 lg:max-w-none lg:px-24">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white">Ready to get started?</h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Experience the full power of Megarray with our 14-day free trial. No credit card required.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/auth/signup"
                  className="rounded-md bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Start free trial
                </a>
                <a
                  href="/contact"
                  className="text-base font-semibold leading-6 text-white"
                >
                  Contact sales <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 