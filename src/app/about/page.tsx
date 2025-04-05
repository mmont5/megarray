'use client';

import type { ReactElement } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket, 
  faUsers, 
  faStar, 
  faGlobe,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import MainLayout from '@/components/layout/MainLayout';

const values = [
  {
    name: 'Innovation First',
    description: 'We constantly push the boundaries of what is possible in social media management.',
    icon: faRocket,
  },
  {
    name: 'Customer Success',
    description: 'Your success is our success. We are committed to helping you achieve your goals.',
    icon: faStar,
  },
  {
    name: 'Team Collaboration',
    description: 'We believe in the power of teamwork, both within our company and with our customers.',
    icon: faUsers,
  },
  {
    name: 'Global Impact',
    description: 'We are building tools that help businesses connect with customers around the world.',
    icon: faGlobe,
  },
];

const team = [
  {
    name: 'Michael Chen',
    role: 'CEO & Co-Founder',
    image: '/team/michael.jpg',
    bio: 'Former social media director with 15+ years of experience in digital marketing.',
  },
  {
    name: 'Sarah Johnson',
    role: 'CTO & Co-Founder',
    image: '/team/sarah.jpg',
    bio: 'AI researcher and engineer with a passion for creating tools that make work easier.',
  },
  {
    name: 'David Rodriguez',
    role: 'Head of Product',
    image: '/team/david.jpg',
    bio: 'Product leader focused on building intuitive, powerful tools for social media professionals.',
  },
  {
    name: 'Emma Williams',
    role: 'Head of Customer Success',
    image: '/team/emma.jpg',
    bio: 'Dedicated to ensuring our customers get the most out of the Megarray platform.',
  },
];

export default function AboutPage(): ReactElement {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Our Mission
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              We're building the next generation of social media management tools, empowering businesses to connect with their audiences more effectively and authentically.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-gray-900/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white">Our Story</h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Megarray was founded in 2022 by Michael Chen and Sarah Johnson, who saw the need for more powerful, intelligent tools to manage social media presence across multiple platforms.
              </p>
              <p className="mt-4 text-lg leading-8 text-gray-300">
                After experiencing firsthand the challenges of managing social media campaigns at scale, they set out to build a platform that combines intuitive design with powerful AI capabilities.
              </p>
              <p className="mt-4 text-lg leading-8 text-gray-300">
                Today, Megarray serves thousands of customers worldwide, from small businesses to large enterprises, all looking to streamline their social media operations and drive better results.
              </p>
            </div>
            <div className="relative h-96 overflow-hidden rounded-2xl">
              <Image 
                src="/office.jpg" 
                alt="Megarray office" 
                fill 
                style={{ objectFit: 'cover' }} 
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">Our Values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              These core principles guide everything we do, from product development to customer service.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-white">
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-indigo-600">
                      <FontAwesomeIcon icon={value.icon} className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {value.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                    <p className="flex-auto">{value.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-900/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">Our Team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Meet the people behind Megarray who are passionate about building amazing tools for social media management.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
            {team.map((person) => (
              <div key={person.name} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-2xl bg-gray-800">
                  <div className="relative h-96 w-full">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold leading-8 tracking-tight text-white">{person.name}</h3>
                <p className="text-base leading-7 text-indigo-400">{person.role}</p>
                <p className="mt-4 text-base leading-7 text-gray-300">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-3xl bg-indigo-500/10 px-8 py-16 ring-1 ring-inset ring-indigo-500/20 sm:px-16 sm:py-24 lg:max-w-none lg:px-24">
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2 lg:gap-x-16">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Join our team</h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  We're always looking for talented individuals to join our mission of transforming social media management. Check out our open positions and become part of our journey.
                </p>
                <div className="mt-10">
                  <a
                    href="/careers"
                    className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    View open positions
                    <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div className="relative h-full min-h-[300px] overflow-hidden rounded-2xl">
                <Image
                  src="/team-working.jpg"
                  alt="Team collaborating"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 