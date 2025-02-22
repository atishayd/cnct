import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';

export default function EmailTemplateForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'custom'
  });

  const mutation = useMutation(
    async (data) => {
      setIsSubmitting(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/email-templates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create template');
        }
        return response.json();
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('emailTemplates');
        navigate('/campaigns/templates');
      },
      onError: (error) => {
        console.error('Failed to create template:', error);
        setError(error.message);
        navigate('/campaigns/templates/new', { replace: true });
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  console.log('EmailTemplateForm rendering');

  return (
    <div className="max-w-3xl mx-auto p-6">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">New Email Template</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Template Name
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
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Template Type
            </label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="initial">Initial Contact</option>
              <option value="followUp">Follow Up</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Email Subject
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Email Content
            </label>
            <textarea
              name="content"
              id="content"
              rows={6}
              value={formData.content}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Available variables: {{firstName}}, {{lastName}}, {{companyName}}, {{jobRole}}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              console.log('Cancel button clicked');
              navigate('/campaigns/templates');
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Template'}
          </button>
        </div>
      </form>
    </div>
  );
} 