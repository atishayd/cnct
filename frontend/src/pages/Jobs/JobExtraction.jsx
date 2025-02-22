import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

export default function JobExtraction() {
  const navigate = useNavigate();
  const [jobUrl, setJobUrl] = useState('');
  const [extractedData, setExtractedData] = useState(null);

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
      setExtractedData(data);
    }
  });

  const createJobMutation = useMutation(async (data) => {
    const response = await fetch('http://localhost:4001/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create job');
    return response.json();
  }, {
    onSuccess: (data) => {
      navigate(`/jobs/${data._id}`);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await extractMutation.mutateAsync(jobUrl);
  };

  const handleSave = () => {
    if (extractedData) {
      createJobMutation.mutate({
        ...extractedData,
        jobLink: jobUrl
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Extract Job Details
      </h1>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700">
                Job Posting URL
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  name="jobUrl"
                  id="jobUrl"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://example.com/job-posting"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={extractMutation.isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {extractMutation.isLoading ? 'Extracting...' : 'Extract Details'}
              </button>
            </div>
          </form>

          {extractMutation.isError && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-1">
                  <p className="text-sm text-red-700">
                    Failed to extract job details. Please try again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {extractedData && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Extracted Details</h3>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{extractedData.companyName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Job Role</dt>
                  <dd className="mt-1 text-sm text-gray-900">{extractedData.jobRole}</dd>
                </div>
              </dl>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={createJobMutation.isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {createJobMutation.isLoading ? 'Saving...' : 'Save Job'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 