import React from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  ClockIcon,
  EnvelopeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Email Templates',
    description: 'Create and manage email templates for your campaigns',
    href: '/campaigns/templates',
    icon: DocumentTextIcon
  },
  {
    name: 'Campaign Scheduler',
    description: 'Schedule and automate your email campaigns',
    href: '/campaigns/schedule',
    icon: ClockIcon
  },
  {
    name: 'Automations',
    description: 'Monitor and manage your running campaigns',
    href: '/campaigns/automations',
    icon: EnvelopeIcon
  },
  {
    name: 'Analytics',
    description: 'Track the performance of your campaigns',
    href: '/analytics',
    icon: ChartBarIcon
  }
];

export default function Campaigns() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Campaign Management</h2>
        <p className="mt-2 text-sm text-gray-700">
          Create, manage, and track your email campaigns
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <Link
            key={feature.name}
            to={feature.href}
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                <feature.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                {feature.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 