'use client'

import { useState, useEffect } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
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
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase
          .from('dashboard_data')
          .select('*')
          .limit(10)

        if (error) throw error
        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Add your dashboard components here */}
          <div className="px-4 py-8 sm:px-0">
            <div className="rounded-lg border-4 border-dashed border-gray-200 p-4 text-center">
              <p className="text-gray-500">Dashboard content will be displayed here</p>
            </div>
          </div>
        </div>
      </main>
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