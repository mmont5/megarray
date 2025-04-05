'use client'

import { useState } from 'react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  HandThumbUpIcon,
  ChatBubbleLeftEllipsisIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

const stats = [
  {
    id: 1,
    name: 'Total Views',
    stat: '71,897',
    icon: EyeIcon,
    change: '12%',
    changeType: 'increase',
  },
  {
    id: 2,
    name: 'Engagements',
    stat: '58.16%',
    icon: HandThumbUpIcon,
    change: '2.02%',
    changeType: 'increase',
  },
  {
    id: 3,
    name: 'Comments',
    stat: '24.57%',
    icon: ChatBubbleLeftEllipsisIcon,
    change: '4.05%',
    changeType: 'decrease',
  },
  {
    id: 4,
    name: 'Shares',
    stat: '24.57%',
    icon: ShareIcon,
    change: '3.05%',
    changeType: 'increase',
  },
]

export default function DashboardPage() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
              <p
                className={clsx(
                  item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                  'ml-2 flex items-baseline text-sm font-semibold'
                )}
              >
                {item.changeType === 'increase' ? (
                  <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                ) : (
                  <ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
                )}
                <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-base font-semibold leading-6 text-gray-900">Recent Activity</h2>
        <div className="mt-2 overflow-hidden rounded-xl bg-white shadow">
          <ul role="list" className="divide-y divide-gray-200">
            {activity.map((item) => (
              <li key={item.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-indigo-600">{item.title}</p>
                  <div className="ml-2 flex flex-shrink-0">
                    <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                      {item.platform}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <div className="sm:flex">
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>{item.date} by {item.author.firstName} {item.author.lastName}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Upcoming Posts */}
      <div className="mt-8">
        <h2 className="text-base font-semibold leading-6 text-gray-900">Upcoming Posts</h2>
        <div className="mt-2 overflow-hidden rounded-xl bg-white shadow">
          <ul role="list" className="divide-y divide-gray-200">
            {upcomingPosts.map((post) => (
              <li key={post.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-indigo-600">{post.title}</p>
                  <div className="ml-2 flex flex-shrink-0">
                    <p className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                      {post.platform}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <div className="sm:flex">
                    <p className="text-sm text-gray-500">{post.description}</p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Scheduled for {post.scheduledFor} by {post.author.firstName} {post.author.lastName}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const activity = [
  {
    id: 1,
    title: 'New Product Launch Post',
    platform: 'Instagram',
    description: 'Post reached 10k users with 500 likes and 50 comments',
    date: '30 mins ago',
    author: {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  {
    id: 2,
    title: 'Customer Success Story',
    platform: 'LinkedIn',
    description: 'Article shared by 20 industry leaders',
    date: '2 hours ago',
    author: {
      firstName: 'Jane',
      lastName: 'Smith'
    }
  },
  {
    id: 3,
    title: 'Weekly Tips Thread',
    platform: 'Twitter',
    description: 'Thread received 100 retweets and 300 likes',
    date: '5 hours ago',
    author: {
      firstName: 'Mike',
      lastName: 'Johnson'
    }
  },
]

const upcomingPosts = [
  {
    id: 1,
    title: 'Product Feature Highlight',
    platform: 'Instagram',
    description: 'Showcase of our latest AI-powered analytics features',
    scheduledFor: 'Tomorrow at 10:00 AM',
    author: {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  {
    id: 2,
    title: 'Industry Insights Report',
    platform: 'LinkedIn',
    description: 'Q1 2024 Social Media Trends Analysis',
    scheduledFor: 'Mar 15, 2024 at 2:00 PM',
    author: {
      firstName: 'Jane',
      lastName: 'Smith'
    }
  },
  {
    id: 3,
    title: 'Customer Spotlight',
    platform: 'Twitter',
    description: 'Success story featuring Acme Corp',
    scheduledFor: 'Mar 16, 2024 at 11:00 AM',
    author: {
      firstName: 'Mike',
      lastName: 'Johnson'
    }
  },
] 