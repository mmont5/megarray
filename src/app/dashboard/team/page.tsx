'use client'

import { useState } from 'react'
import { EnvelopeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

const team = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    role: 'Admin',
    email: 'john@example.com',
    imageUrl: 'https://ui-avatars.com/api/?name=John+Doe',
    lastActive: '2 hours ago',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'Content Manager',
    email: 'jane@example.com',
    imageUrl: 'https://ui-avatars.com/api/?name=Jane+Smith',
    lastActive: '5 hours ago',
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'Content Creator',
    email: 'mike@example.com',
    imageUrl: 'https://ui-avatars.com/api/?name=Mike+Johnson',
    lastActive: '1 day ago',
  },
]

const roles = [
  { id: 1, name: 'Admin', description: 'Full access to all features' },
  { id: 2, name: 'Content Manager', description: 'Can create and manage content' },
  { id: 3, name: 'Content Creator', description: 'Can create content' },
  { id: 4, name: 'Viewer', description: 'Can view content and analytics' },
]

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<typeof team[0] | null>(null)

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Team Management</h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your team members and their roles
            </p>
          </div>
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Team Member
          </button>
        </div>
      </div>

      {/* Team members list */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <ul role="list" className="divide-y divide-gray-200">
          {team.map((person) => (
            <li
              key={person.id}
              className="relative flex items-center justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
            >
              <div className="flex min-w-0 gap-x-4">
                <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                  src={person.imageUrl}
                  alt=""
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    <button
                      onClick={() => setSelectedMember(person)}
                      className="hover:underline"
                    >
                      {person.firstName} {person.lastName}
                    </button>
                  </p>
                  <p className="mt-1 flex text-xs leading-5 text-gray-500">
                    <span className="relative truncate hover:underline">
                      {person.email}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-gray-900">{person.role}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Last active {person.lastActive}
                  </p>
                </div>
                <div className="flex items-center gap-x-2">
                  <button
                    type="button"
                    className="rounded-md bg-white p-2 text-gray-400 hover:text-gray-500"
                  >
                    <EnvelopeIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-white p-2 text-gray-400 hover:text-gray-500"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-white p-2 text-red-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Roles section */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Available Roles</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{role.name}</p>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected member details */}
      {selectedMember && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    Team Member Details
                  </h3>
                  <div className="mt-4">
                    <img
                      className="mx-auto h-20 w-20 rounded-full"
                      src={selectedMember.imageUrl}
                      alt=""
                    />
                    <div className="mt-4 text-left">
                      <p className="text-sm font-medium text-gray-500">First Name</p>
                      <p className="text-base text-gray-900">{selectedMember.firstName}</p>
                      <p className="mt-2 text-sm font-medium text-gray-500">Last Name</p>
                      <p className="text-base text-gray-900">{selectedMember.lastName}</p>
                      <p className="mt-2 text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base text-gray-900">{selectedMember.email}</p>
                      <p className="mt-2 text-sm font-medium text-gray-500">Role</p>
                      <p className="text-base text-gray-900">{selectedMember.role}</p>
                      <p className="mt-2 text-sm font-medium text-gray-500">Last Active</p>
                      <p className="text-base text-gray-900">{selectedMember.lastActive}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => setSelectedMember(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 