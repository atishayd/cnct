import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import StatusBadge from '../../components/StatusIndicators/StatusBadge';

export default function ContactEmailHistory() {
  const { id } = useParams();

  const { data: contact, isLoading } = useQuery(['contact', id], async () => {
    const response = await fetch(`http://localhost:4001/api/contacts/${id}`);
    if (!response.ok) throw new Error('Failed to fetch contact');
    return response.json();
  });

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
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Email History - {contact.firstName} {contact.lastName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {contact.email} • {contact.company}
          </p>
        </div>
        <StatusBadge status={contact.status} />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Communication Timeline
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {contact.emailHistory?.map((email, index) => (
              <li key={index} className="px-4 py-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {email.subject}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {email.content}
                    </p>
                  </div>
                  <div className="ml-6 flex flex-col items-end">
                    <StatusBadge status={email.status} />
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(email.sentDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {contact.nextFollowUpDate && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-1">
              <p className="text-sm text-yellow-700">
                Next follow-up scheduled for {new Date(contact.nextFollowUpDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 