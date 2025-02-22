import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function SenderList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: senders, isLoading } = useQuery('senders', async () => {
    const response = await fetch('http://localhost:4001/api/senders');
    if (!response.ok) throw new Error('Failed to fetch senders');
    return response.json();
  });

  const toggleActiveMutation = useMutation(
    async ({ id, isActive }) => {
      const response = await fetch(`http://localhost:4001/api/senders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });
      if (!response.ok) throw new Error('Failed to update sender status');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('senders');
      }
    }
  );

  const deleteMutation = useMutation(
    async (id) => {
      const response = await fetch(`http://localhost:4001/api/senders/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete sender');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('senders');
      }
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Sender Accounts</h1>
        <button
          onClick={() => navigate('/senders/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Sender
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {senders?.map((sender) => (
            <li key={sender._id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{sender.name}</h3>
                    {sender.isActive ? (
                      <CheckCircleIcon className="ml-2 h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="ml-2 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{sender.email}</p>
                  <p className="text-sm text-gray-500">Provider: {sender.provider}</p>
                  <p className="text-sm text-gray-500">
                    Daily Limit: {sender.sendCount}/{sender.dailySendLimit}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate(`/senders/${sender._id}/edit`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => toggleActiveMutation.mutate({ 
                      id: sender._id, 
                      isActive: !sender.isActive 
                    })}
                    className={`${
                      sender.isActive ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'
                    }`}
                  >
                    {sender.isActive ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <XCircleIcon className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(sender._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 