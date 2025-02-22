import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function CampaignScheduler() {
  const [schedule, setSchedule] = useState({
    templateId: '',
    senderId: '',
    contacts: [],
    startDate: '',
    sendTime: '09:00',
    followUpDelay: 3, // days
    maxFollowUps: 2
  });

  const { data: templates } = useQuery('emailTemplates', async () => {
    const response = await fetch('http://localhost:4001/api/email-templates');
    if (!response.ok) throw new Error('Failed to fetch templates');
    return response.json();
  });

  const { data: senders } = useQuery('senders', async () => {
    const response = await fetch('http://localhost:4001/api/senders');
    if (!response.ok) throw new Error('Failed to fetch senders');
    return response.json();
  });

  const { data: contacts } = useQuery('uncontactedContacts', async () => {
    const response = await fetch('http://localhost:4001/api/contacts?status=uncontacted');
    if (!response.ok) throw new Error('Failed to fetch contacts');
    return response.json();
  });

  const scheduleMutation = useMutation(async (data) => {
    const response = await fetch('http://localhost:4001/api/campaigns/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to schedule campaign');
    return response.json();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    scheduleMutation.mutate(schedule);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contacts') {
      const selectedContacts = Array.from(e.target.selectedOptions, option => option.value);
      setSchedule(prev => ({ ...prev, contacts: selectedContacts }));
    } else {
      setSchedule(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Campaign Settings
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="templateId" className="block text-sm font-medium text-gray-700">
                  Email Template
                </label>
                <select
                  id="templateId"
                  name="templateId"
                  value={schedule.templateId}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Select a template</option>
                  {templates?.map(template => (
                    <option key={template._id} value={template._id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="senderId" className="block text-sm font-medium text-gray-700">
                  Sender Account
                </label>
                <select
                  id="senderId"
                  name="senderId"
                  value={schedule.senderId}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Select a sender</option>
                  {senders?.filter(sender => sender.isActive).map(sender => (
                    <option key={sender._id} value={sender._id}>
                      {sender.name} ({sender.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="contacts" className="block text-sm font-medium text-gray-700">
                  Select Contacts
                </label>
                <select
                  id="contacts"
                  name="contacts"
                  multiple
                  value={schedule.contacts}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  required
                  size={5}
                >
                  {contacts?.map(contact => (
                    <option key={contact._id} value={contact._id}>
                      {contact.firstName} {contact.lastName} - {contact.company}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={schedule.startDate}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sendTime" className="block text-sm font-medium text-gray-700">
                  Send Time
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    name="sendTime"
                    id="sendTime"
                    value={schedule.sendTime}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="followUpDelay" className="block text-sm font-medium text-gray-700">
                  Follow-up Delay (days)
                </label>
                <input
                  type="number"
                  name="followUpDelay"
                  id="followUpDelay"
                  value={schedule.followUpDelay}
                  onChange={handleChange}
                  min="1"
                  max="14"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="maxFollowUps" className="block text-sm font-medium text-gray-700">
                  Max Follow-ups
                </label>
                <input
                  type="number"
                  name="maxFollowUps"
                  id="maxFollowUps"
                  value={schedule.maxFollowUps}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={scheduleMutation.isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {scheduleMutation.isLoading ? 'Scheduling...' : 'Schedule Campaign'}
          </button>
        </div>

        {scheduleMutation.isSuccess && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Campaign scheduled successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        {scheduleMutation.isError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  Failed to schedule campaign. Please try again.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 