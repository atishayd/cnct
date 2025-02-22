import { useState } from 'react';
import { useMutation } from 'react-query';
import StatusBadge from '../../components/StatusIndicators/StatusBadge';

export default function EmailVerification() {
  const [emailData, setEmailData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    domain: ''
  });

  const [verificationResults, setVerificationResults] = useState([]);

  const generateMutation = useMutation(async (data) => {
    const response = await fetch('http://localhost:4001/api/contacts/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to verify email');
    return response.json();
  }, {
    onSuccess: (data) => {
      setVerificationResults(data);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    generateMutation.mutate(emailData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Email Pattern Generator & Verifier
          </h3>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={emailData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={emailData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={emailData.company}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                  Domain
                </label>
                <input
                  type="text"
                  name="domain"
                  id="domain"
                  value={emailData.domain}
                  onChange={handleChange}
                  placeholder="example.com"
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={generateMutation.isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {generateMutation.isLoading ? 'Verifying...' : 'Verify Email Patterns'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {verificationResults.length > 0 && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Verification Results
            </h3>
            <div className="mt-6">
              <ul className="divide-y divide-gray-200">
                {verificationResults.map((result, index) => (
                  <li key={index} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{result.email}</p>
                        <p className="text-sm text-gray-500">{result.pattern}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <StatusBadge status={result.confidence} />
                        <StatusBadge status={result.exists ? 'verified' : 'unverified'} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 