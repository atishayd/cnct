import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const [isTestingSystem, setIsTestingSystem] = useState(false);

  const { data: systemStatus, isLoading, refetch } = useQuery('system-check', async () => {
    const response = await fetch('http://localhost:4001/api/test/system-check');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  }, {
    enabled: false // Don't run automatically
  });

  const testSystemMutation = useMutation(async () => {
    setIsTestingSystem(true);
    try {
      await refetch();
    } finally {
      setIsTestingSystem(false);
    }
  });

  const renderStatusIcon = (isActive) => {
    return isActive ? (
      <CheckCircleIcon className="h-5 w-5 text-green-500" />
    ) : (
      <XCircleIcon className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
        <button
          onClick={() => testSystemMutation.mutate()}
          disabled={isTestingSystem}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isTestingSystem ? 'Testing...' : 'Test System'}
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Environment Variables
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Status of required environment variables and integrations.
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            {/* MongoDB Status */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">MongoDB</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                {systemStatus ? (
                  <>
                    {renderStatusIcon(systemStatus.mongodb)}
                    <span className="ml-2">
                      {systemStatus.mongodb ? 'Connected' : 'Not Connected'}
                    </span>
                  </>
                ) : '-'}
              </dd>
            </div>

            {/* OpenAI Status */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">OpenAI API</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                {systemStatus ? (
                  <>
                    {renderStatusIcon(systemStatus.openai)}
                    <span className="ml-2">
                      {systemStatus.openai ? 'Configured' : 'Not Configured'}
                    </span>
                  </>
                ) : '-'}
              </dd>
            </div>

            {/* Gmail Integration Status */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Gmail Integration</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {systemStatus?.gmail ? (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      {renderStatusIcon(systemStatus.gmail.clientId)}
                      <span className="ml-2">Client ID</span>
                    </div>
                    <div className="flex items-center">
                      {renderStatusIcon(systemStatus.gmail.clientSecret)}
                      <span className="ml-2">Client Secret</span>
                    </div>
                    <div className="flex items-center">
                      {renderStatusIcon(systemStatus.gmail.redirectUri)}
                      <span className="ml-2">Redirect URI</span>
                    </div>
                    <div className="flex items-center">
                      {renderStatusIcon(systemStatus.gmail.refreshToken)}
                      <span className="ml-2">Refresh Token</span>
                    </div>
                  </div>
                ) : '-'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* System Logs */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            System Logs
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Recent system activity and errors
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <pre className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 max-h-96 overflow-auto">
              {/* Placeholder for logs */}
              System initialized
              Email service connected
              Database connection established
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 