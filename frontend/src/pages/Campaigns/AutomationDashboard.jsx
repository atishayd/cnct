import { useQuery } from 'react-query';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  PauseIcon,
  PlayIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';

export default function AutomationDashboard() {
  const { data: campaigns, isLoading } = useQuery('campaigns', async () => {
    const response = await fetch('http://localhost:4001/api/campaigns');
    if (!response.ok) throw new Error('Failed to fetch campaigns');
    return response.json();
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'paused':
        return <PauseIcon className="h-5 w-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Campaign Automations</h1>
          <p className="mt-2 text-sm text-gray-700">
            Monitor and manage your automated email campaigns
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {campaigns?.map((campaign) => (
            <li key={campaign._id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div className="flex text-sm">
                      <p className="font-medium text-indigo-600 truncate">
                        {campaign.name}
                      </p>
                      <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                        {campaign.template?.name}
                      </p>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <p>
                          Sent: {campaign.sentCount}/{campaign.totalContacts} •
                          Responses: {campaign.responseCount} •
                          Next send: {new Date(campaign.nextSendDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0 flex items-center space-x-2">
                  {getStatusIcon(campaign.status)}
                  <button className="text-gray-400 hover:text-gray-500">
                    {campaign.status === 'active' ? (
                      <PauseIcon className="h-5 w-5" />
                    ) : (
                      <PlayIcon className="h-5 w-5" />
                    )}
                  </button>
                  <button className="text-red-400 hover:text-red-500">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {campaigns?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No campaigns found</p>
        </div>
      )}
    </div>
  );
} 