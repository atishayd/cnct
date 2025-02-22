import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import StatusBadge from '../../components/StatusIndicators/StatusBadge';

const JOB_STATUSES = ['pending', 'processing', 'completed', 'failed'];

export default function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    jobLink: '',
    status: 'pending'
  });

  const { data: job, isLoading: isLoadingJob } = useQuery(
    ['job', id],
    async () => {
      if (!id) return null;
      const response = await fetch(`http://localhost:4001/api/jobs/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    {
      onSuccess: (data) => {
        if (data) setFormData(data);
      }
    }
  );

  const extractMutation = useMutation(async (url) => {
    const response = await fetch('http://localhost:4001/api/jobs/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    if (!response.ok) throw new Error('Failed to extract job details');
    return response.json();
  }, {
    onSuccess: (data) => {
      setFormData(prev => ({
        ...prev,
        companyName: data.companyName || prev.companyName,
        jobRole: data.jobRole || prev.jobRole
      }));
    }
  });

  const mutation = useMutation(
    async (data) => {
      const url = isEditMode 
        ? `http://localhost:4001/api/jobs/${id}`
        : 'http://localhost:4001/api/jobs';
      
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('jobs');
        navigate('/jobs');
      },
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

  const handleUrlBlur = () => {
    if (formData.jobLink && !isEditMode) {
      extractMutation.mutate(formData.jobLink);
    }
  };

  if (isEditMode && isLoadingJob) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {isEditMode ? 'Edit Job' : 'New Job'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4">
          <div>
            <label htmlFor="jobLink" className="block text-sm font-medium text-gray-700">
              Job URL
            </label>
            <input
              type="url"
              name="jobLink"
              id="jobLink"
              value={formData.jobLink}
              onChange={handleChange}
              onBlur={handleUrlBlur}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
            {extractMutation.isLoading && (
              <p className="mt-2 text-sm text-gray-500">Extracting job details...</p>
            )}
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              id="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700">
              Job Role
            </label>
            <input
              type="text"
              name="jobRole"
              id="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          {isEditMode && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {JOB_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditMode ? 'Update' : 'Create'} Job
          </button>
        </div>
      </form>
    </div>
  );
} 