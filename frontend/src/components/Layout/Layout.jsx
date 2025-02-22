import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  UserGroupIcon, BriefcaseIcon, EnvelopeIcon, 
  CogIcon, ChartBarIcon, InboxIcon,
  Bars3Icon, XMarkIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Contacts', href: '/contacts', icon: UserGroupIcon },
  { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
  { name: 'Campaigns', href: '/campaigns', icon: EnvelopeIcon },
  { name: 'Senders', href: '/senders', icon: InboxIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white">
          <div className="flex items-center justify-between h-16 px-6 bg-gray-900">
            <span className="text-xl font-semibold text-white">CNCT</span>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
          </div>
          <nav className="px-3 mt-6">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mt-2 text-gray-600 rounded-lg hover:bg-gray-100 ${
                    isActive ? 'bg-gray-100 text-gray-900' : ''
                  }`
                }
              >
                <item.icon className="w-6 h-6 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 bg-gray-900">
            <span className="text-xl font-semibold text-white">CNCT</span>
          </div>
          <nav className="flex-1 px-3 mt-6">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mt-2 text-gray-600 rounded-lg hover:bg-gray-100 ${
                    isActive ? 'bg-gray-100 text-gray-900' : ''
                  }`
                }
              >
                <item.icon className="w-6 h-6 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex items-center h-16 bg-white border-b border-gray-200 lg:hidden">
          <button
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
} 