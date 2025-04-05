'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

function getMonth(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []
  const daysInMonth = lastDay.getDate()

  // Add empty days for the start of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null)
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }

  return days
}

const events = [
  {
    id: 1,
    title: 'Product Launch Post',
    platform: 'Instagram',
    date: new Date(2024, 2, 15),
    type: 'post',
  },
  {
    id: 2,
    title: 'Weekly Newsletter',
    platform: 'LinkedIn',
    date: new Date(2024, 2, 18),
    type: 'newsletter',
  },
  {
    id: 3,
    title: 'Customer Story',
    platform: 'Twitter',
    date: new Date(2024, 2, 20),
    type: 'story',
  },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const days = getMonth(currentDate.getFullYear(), currentDate.getMonth())
  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  const year = currentDate.getFullYear()

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    )
  }

  return (
    <div>
      {/* Calendar header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Content Calendar</h1>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Schedule Post
          </button>
        </div>
      </div>

      {/* Calendar navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {monthName} {year}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={previousMonth}
            className="rounded-md p-2 hover:bg-gray-100"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-md p-2 hover:bg-gray-100"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-gray-50 px-3 py-2">
            <span className="text-sm font-medium text-gray-900">{day}</span>
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, dayIdx) => {
          const dayEvents = day ? getEventsForDate(day) : []
          return (
            <div
              key={day ? day.toISOString() : dayIdx}
              className={clsx(
                'min-h-[120px] bg-white px-3 py-2',
                !day && 'bg-gray-50',
                day &&
                  selectedDate?.toDateString() === day.toDateString() &&
                  'bg-blue-50'
              )}
              onClick={() => day && setSelectedDate(day)}
            >
              {day && (
                <>
                  <time
                    dateTime={day.toISOString()}
                    className={clsx(
                      'flex h-6 w-6 items-center justify-center rounded-full text-sm',
                      day.toDateString() === new Date().toDateString() &&
                        'bg-indigo-600 font-semibold text-white'
                    )}
                  >
                    {day.getDate()}
                  </time>
                  <ol className="mt-2">
                    {dayEvents.map((event) => (
                      <li
                        key={event.id}
                        className="group relative flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-gray-100"
                      >
                        <div
                          className={clsx(
                            'h-2 w-2 flex-shrink-0 rounded-full',
                            event.type === 'post' && 'bg-blue-500',
                            event.type === 'newsletter' && 'bg-green-500',
                            event.type === 'story' && 'bg-purple-500'
                          )}
                        />
                        <p className="truncate text-sm font-medium text-gray-700">
                          {event.title}
                        </p>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Selected date events */}
      {selectedDate && (
        <div className="mt-8 px-6">
          <h3 className="text-lg font-medium text-gray-900">
            Scheduled Content for {selectedDate.toLocaleDateString()}
          </h3>
          <div className="mt-4 space-y-4">
            {getEventsForDate(selectedDate).map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {event.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Platform: {event.platform}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 