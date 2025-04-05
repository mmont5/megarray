'use client'

import { useState, useEffect } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

interface AnalyticsData {
  id: string;
  [key: string]: any;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase
          .from('analytics')
          .select('*')
          .limit(10)

        if (error) throw error
        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Analytics</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Add your analytics components here */}
          <div className="px-4 py-8 sm:px-0">
            <div className="rounded-lg border-4 border-dashed border-gray-200 p-4 text-center">
              <p className="text-gray-500">Analytics content will be displayed here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 