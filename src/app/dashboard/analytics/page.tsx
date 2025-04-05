'use client'

import { useState } from 'react'
import {
  ChartBarIcon,
  UsersIcon,
  GlobeAltIcon,
  CursorArrowRaysIcon,
} from '@heroicons/react/24/outline'

const metrics = [
  {
    id: 1,
    name: 'Total Reach',
    stat: '234,567',
    previousStat: '210,234',
    change: '11.6%',
    changeType: 'increase',
    icon: UsersIcon,
  },
  {
    id: 2,
    name: 'Engagement Rate',
    stat: '4.75%',
    previousStat: '4.25%',
    change: '0.5%',
    changeType: 'increase',
    icon: ChartBarIcon,
  },
  {
    id: 3,
    name: 'Click-through Rate',
    stat: '2.48%',
    previousStat: '2.13%',
    change: '0.35%',
    changeType: 'increase',
    icon: CursorArrowRaysIcon,
  },
  {
    id: 4,
    name: 'Impressions',
    stat: '987,654',
    previousStat: '876,543',
    change: '12.7%',
    changeType: 'increase',
    icon: GlobeAltIcon,
  },
]

const platforms = [
  { name: 'Instagram', followers: '45.2K', engagement: '4.8%', posts: 127 },
  { name: 'Twitter', followers: '32.1K', engagement: '2.3%', posts: 342 },
  { name: 'LinkedIn', followers: '28.9K', engagement: '5.1%', posts: 89 },
  { name: 'Facebook', followers: '56.7K', engagement: '3.7%', posts: 156 },
]

const topPosts = [
  {
    id: 1,
    title: 'Product Launch Announcement',
    platform: 'Instagram',
    engagement: '12.5K',
    reach: '45.2K',
    date: '2024-03-01',
    author: {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  {
    id: 2,
    title: 'Industry Insights Thread',
    platform: 'Twitter',
    engagement: '8.3K',
    reach: '32.1K',
    date: '2024-03-02',
    author: {
      firstName: 'Jane',
      lastName: 'Smith'
    }
  },
  {
    id: 3,
    title: 'Customer Success Story',
    platform: 'LinkedIn',
    engagement: '6.7K',
    reach: '28.9K',
    date: '2024-03-03',
    author: {
      firstName: 'Mike',
      lastName: 'Johnson'
    }
  },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics Overview</h1>
        <p className="mt-2 text-sm text-gray-500">
          Track your social media performance across all platforms
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <metric.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{metric.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{metric.stat}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {metric.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Platform performance */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Platform Performance</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Followers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Engagement Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total Posts
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {platforms.map((platform) => (
                <tr key={platform.name}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{platform.followers}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{platform.engagement}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{platform.posts}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top performing posts */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Top Performing Posts</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Reach
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {topPosts.map((post) => (
                <tr key={post.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500">by {post.author.firstName} {post.author.lastName}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{post.platform}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{post.engagement}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{post.reach}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{post.date}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 