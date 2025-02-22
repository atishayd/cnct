import { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import StatusBadge from '../../components/StatusIndicators/StatusBadge';

export default function ContactList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: contacts, isLoading, error } = useQuery('contacts', async () => {
    const response = await fetch('http://localhost:4001/api/contacts');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  });

  const filteredContacts = contacts?.filter(contact => 
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-8">
        Error loading contacts: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
        <button
          onClick={() => navigate('/contacts/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Contact
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search contacts..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredContacts?.map((contact) => (
            <li key={contact._id}>
              <div className="px-4 py-4 flex items-center sm:px-6 hover:bg-gray-50 cursor-pointer"
                   onClick={() => navigate(`/contacts/${contact._id}/edit`)}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <div className="ml-2 flex-shrink-0">
                      <StatusBadge status={contact.isVerified ? 'verified' : 'unverified'} />
                    </div>
                  </div>
                  <div className="mt-2 flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="truncate">{contact.company}</span>
                      <span className="mx-1">•</span>
                      <span className="truncate">{contact.role}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="truncate">{contact.email}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 