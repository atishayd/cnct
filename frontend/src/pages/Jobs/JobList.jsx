import { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import StatusBadge from '../../components/StatusIndicators/StatusBadge';

const JOB_STATUSES = ['all', 'pending', 'processing', 'completed', 'failed'];

export default function JobList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { data: jobs, isLoading, error } = useQuery('jobs', async () => {
    const response = await fetch('http://localhost:4001/api/jobs');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  });

  const filteredJobs = jobs?.filter(job => 
    statusFilter === 'all' || job.status === statusFilter
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
        Error loading jobs: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
        <button
          onClick={() => navigate('/jobs/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Job
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-2">
            {JOB_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  statusFilter === status
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-gray-200">
          {filteredJobs?.map((job) => (
            <li key={job._id}>
              <div 
                className="px-4 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/jobs/${job._id}/edit`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {job.companyName}
                      </p>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{job.jobRole}</p>
                      <a 
                        href={job.jobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-indigo-600 mt-1 block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Original Posting
                      </a>
                    </div>
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