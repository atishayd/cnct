import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export default function SenderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    provider: 'gmail',
    credentials: {
      clientId: '',
      clientSecret: '',
      refreshToken: '',
      smtpHost: '',
      smtpPort: '',
      smtpUsername: '',
      smtpPassword: ''
    },
    dailySendLimit: 50
  });

  const { data: sender } = useQuery(
    ['sender', id],
    async () => {
      if (!id) return null;
      const response = await fetch(`http://localhost:4001/api/senders/${id}`);
      if (!response.ok) throw new Error('Failed to fetch sender');
      return response.json();
    },
    {
      enabled: isEditMode,
      onSuccess: (data) => {
        if (data) setFormData(data);
      }
    }
  );

  const mutation = useMutation(
    async (data) => {
      const url = isEditMode 
        ? `http://localhost:4001/api/senders/${id}`
        : 'http://localhost:4001/api/senders';
      
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to save sender');
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('senders');
        navigate('/senders');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Sender Account' : 'New Sender Account'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Account Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
              Email Provider
            </label>
            <select
              name="provider"
              id="provider"
              value={formData.provider}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="gmail">Gmail</option>
              <option value="outlook">Outlook</option>
              <option value="smtp">Custom SMTP</option>
            </select>
          </div>

          {formData.provider === 'gmail' && (
            <>
              <div>
                <label htmlFor="credentials.clientId" className="block text-sm font-medium text-gray-700">
                  Client ID
                </label>
                <input
                  type="text"
                  name="credentials.clientId"
                  id="credentials.clientId"
                  value={formData.credentials.clientId}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="credentials.clientSecret" className="block text-sm font-medium text-gray-700">
                  Client Secret
                </label>
                <input
                  type="password"
                  name="credentials.clientSecret"
                  id="credentials.clientSecret"
                  value={formData.credentials.clientSecret}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="credentials.refreshToken" className="block text-sm font-medium text-gray-700">
                  Refresh Token
                </label>
                <input
                  type="password"
                  name="credentials.refreshToken"
                  id="credentials.refreshToken"
                  value={formData.credentials.refreshToken}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </>
          )}

          {formData.provider === 'smtp' && (
            <>
              <div>
                <label htmlFor="credentials.smtpHost" className="block text-sm font-medium text-gray-700">
                  SMTP Host
                </label>
                <input
                  type="text"
                  name="credentials.smtpHost"
                  id="credentials.smtpHost"
                  value={formData.credentials.smtpHost}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="credentials.smtpPort" className="block text-sm font-medium text-gray-700">
                  SMTP Port
                </label>
                <input
                  type="number"
                  name="credentials.smtpPort"
                  id="credentials.smtpPort"
                  value={formData.credentials.smtpPort}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="credentials.smtpUsername" className="block text-sm font-medium text-gray-700">
                  SMTP Username
                </label>
                <input
                  type="text"
                  name="credentials.smtpUsername"
                  id="credentials.smtpUsername"
                  value={formData.credentials.smtpUsername}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="credentials.smtpPassword" className="block text-sm font-medium text-gray-700">
                  SMTP Password
                </label>
                <input
                  type="password"
                  name="credentials.smtpPassword"
                  id="credentials.smtpPassword"
                  value={formData.credentials.smtpPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="dailySendLimit" className="block text-sm font-medium text-gray-700">
              Daily Send Limit
            </label>
            <input
              type="number"
              name="dailySendLimit"
              id="dailySendLimit"
              value={formData.dailySendLimit}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
              min="1"
              max="2000"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/senders')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {isEditMode ? 'Update' : 'Create'} Sender
          </button>
        </div>
      </form>
    </div>
  );
} 