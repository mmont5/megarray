'use client';

import { ReactElement } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import MainLayout from '@/components/layout/MainLayout';

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
];

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
  },
  {
    question: "Is there a discount for annual billing?",
    answer: "Yes, you can save 20% when you choose annual billing on any of our plans."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll maintain access to your plan until the end of your current billing period."
  }
];

export default function PricingPage(): ReactElement {
  return (
    <MainLayout>
      <div className="relative overflow-hidden pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Choose the plan that's right for your business. All plans include a 14-day free trial.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-900/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Toggle Annual/Monthly */}
          <div className="flex justify-center mb-12">
            <div className="relative flex items-center p-1 rounded-full bg-white/5 border border-white/10">
              <button type="button" className="relative w-32 rounded-full bg-indigo-600 py-2 text-sm font-semibold text-white">Monthly</button>
              <button type="button" className="relative w-32 py-2 text-sm font-semibold text-gray-300">Annual (Save 20%)</button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pricing.map((tier) => (
              <div
                key={tier.name}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <div className="px-6 pt-8 sm:px-8">
                  <h3 className="text-xl font-semibold leading-8 text-white">{tier.name}</h3>
                  <p className="mt-2 text-base leading-6 text-gray-300">{tier.description}</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-bold tracking-tight text-white">${tier.price}</span>
                    <span className="text-sm font-semibold leading-6 text-gray-300">/month</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between px-6 pt-6 pb-8 sm:px-8">
                  <div>
                    <ul role="list" className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <FontAwesomeIcon icon={faCheck} className="h-6 w-5 flex-none text-indigo-400" aria-hidden="true" />
                          <span className="text-sm leading-6 text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8">
                    <Link
                      href={tier.name === 'Enterprise' ? '/contact' : '/auth/signup'}
                      className={`block w-full rounded-md px-3 py-2 text-center text-sm font-semibold ${
                        tier.name === 'Professional'
                          ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600'
                          : 'bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20'
                      }`}
                    >
                      {tier.name === 'Enterprise' ? 'Contact sales' : 'Start free trial'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Compare our plans</h2>
            <p className="mt-4 text-lg text-gray-300">A detailed breakdown of what's included in each plan.</p>
          </div>

          <div className="mt-16 overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <div className="grid grid-cols-4 divide-x divide-white/10">
              <div className="py-8 px-6">
                <div className="h-12" /> {/* Empty space to align with feature titles */}
                <div className="mt-6 space-y-10">
                  <div className="pt-4">
                    <h3 className="text-sm font-semibold leading-6 text-white">Social Accounts</h3>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-sm font-semibold leading-6 text-white">Analytics</h3>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-sm font-semibold leading-6 text-white">Content Planning</h3>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-sm font-semibold leading-6 text-white">Team Members</h3>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-sm font-semibold leading-6 text-white">AI Features</h3>
                  </div>
                </div>
              </div>

              {pricing.map((tier) => (
                <div key={tier.name} className="py-8 px-6">
                  <h3 className="text-lg font-semibold leading-6 text-white">{tier.name}</h3>
                  <p className="mt-2 flex items-baseline gap-x-1">
                    <span className="text-3xl font-bold text-white">${tier.price}</span>
                    <span className="text-sm text-gray-400">/mo</span>
                  </p>
                  
                  <div className="mt-6 space-y-10">
                    <div className="pt-4">
                      <p className="text-sm text-gray-300">
                        {tier.name === 'Starter' && '5 accounts'}
                        {tier.name === 'Professional' && '15 accounts'}
                        {tier.name === 'Enterprise' && 'Unlimited'}
                      </p>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-gray-300">
                        {tier.name === 'Starter' && 'Basic'}
                        {tier.name === 'Professional' && 'Advanced'}
                        {tier.name === 'Enterprise' && 'Enterprise-grade'}
                      </p>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-gray-300">
                        {tier.name === 'Starter' && 'Basic scheduling'}
                        {tier.name === 'Professional' && 'Advanced calendar'}
                        {tier.name === 'Enterprise' && 'Custom workflows'}
                      </p>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-gray-300">
                        {tier.name === 'Starter' && 'Up to 2'}
                        {tier.name === 'Professional' && 'Up to 5'}
                        {tier.name === 'Enterprise' && 'Unlimited'}
                      </p>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-gray-300">
                        {tier.name === 'Starter' && 'Email'}
                        {tier.name === 'Professional' && 'Priority email'}
                        {tier.name === 'Enterprise' && '24/7 + Dedicated manager'}
                      </p>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-gray-300">
                        {tier.name === 'Starter' && 'None'}
                        {tier.name === 'Professional' && 'Basic AI insights'}
                        {tier.name === 'Enterprise' && 'Advanced AI + Custom models'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-900/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-white text-center">Frequently asked questions</h2>
            <div className="mt-16">
              <dl className="space-y-10">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white/5 p-6 rounded-lg border border-white/10">
                    <dt className="text-lg font-semibold leading-7 text-white">
                      {faq.question}
                    </dt>
                    <dd className="mt-2 text-base text-gray-300">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-indigo-600 px-6 py-12 sm:rounded-3xl sm:px-12 lg:px-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
                Try Megarray free for 14 days. No credit card required.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Start your free trial
                </Link>
                <Link href="/contact" className="text-base font-semibold leading-6 text-white">
                  Contact sales <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 