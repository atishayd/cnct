import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useParams } from 'react-router-dom';

export default function EmailTemplatePreview() {
  const { id } = useParams();
  const [testEmail, setTestEmail] = useState('');
  const [previewData, setPreviewData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    companyName: 'Example Corp',
    jobRole: 'Software Engineer'
  });

  const { data: template, isLoading } = useQuery(['emailTemplate', id], async () => {
    const response = await fetch(`http://localhost:4001/api/email-templates/${id}`);
    if (!response.ok) throw new Error('Failed to fetch template');
    return response.json();
  });

  const sendTestMutation = useMutation(async () => {
    const response = await fetch(`http://localhost:4001/api/email-templates/${id}/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        previewData
      })
    });
    if (!response.ok) throw new Error('Failed to send test email');
    return response.json();
  });

  const getPreviewContent = () => {
    if (!template) return '';
    let content = template.content;
    Object.entries(previewData).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return content;
  };

  const handlePreviewDataChange = (e) => {
    const { name, value } = e.target;
    setPreviewData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Preview Variables
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            {Object.entries(previewData).map(([key, value]) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="text"
                  name={key}
                  id={key}
                  value={value}
                  onChange={handlePreviewDataChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Email Preview
          </h3>
          <div className="mt-6">
            <div className="border rounded-md p-4">
              <div className="text-sm font-medium text-gray-900">
                Subject: {template?.subject}
              </div>
              <div className="mt-4 prose max-w-none text-gray-500" 
                   dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Send Test Email
          </h3>
          <div className="mt-6">
            <div className="flex space-x-4">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter test email address"
                className="flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <button
                onClick={() => sendTestMutation.mutate()}
                disabled={sendTestMutation.isLoading || !testEmail}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {sendTestMutation.isLoading ? 'Sending...' : 'Send Test'}
              </button>
            </div>
            {sendTestMutation.isSuccess && (
              <p className="mt-2 text-sm text-green-600">
                Test email sent successfully!
              </p>
            )}
            {sendTestMutation.isError && (
              <p className="mt-2 text-sm text-red-600">
                Failed to send test email. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 