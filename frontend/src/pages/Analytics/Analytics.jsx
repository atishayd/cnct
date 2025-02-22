import { useQuery } from 'react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Analytics() {
  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery('analytics', async () => {
    // This would be replaced with actual API call
    return {
      jobStats: {
        total: 150,
        pending: 45,
        processing: 25,
        completed: 65,
        failed: 15
      },
      contactStats: {
        total: 200,
        verified: 150,
        unverified: 50
      },
      emailStats: {
        delivered: 180,
        opened: 135,
        replied: 45,
        bounced: 20
      },
      timelineData: [
        { date: '2024-01', jobs: 20, contacts: 25, emails: 40 },
        { date: '2024-02', jobs: 25, contacts: 30, emails: 45 },
        { date: '2024-03', jobs: 35, contacts: 40, emails: 55 },
        // Add more timeline data as needed
      ]
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const jobStatusData = [
    { name: 'Pending', value: analyticsData.jobStats.pending },
    { name: 'Processing', value: analyticsData.jobStats.processing },
    { name: 'Completed', value: analyticsData.jobStats.completed },
    { name: 'Failed', value: analyticsData.jobStats.failed },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Jobs
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {analyticsData.jobStats.total}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Contacts
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {analyticsData.contactStats.total}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Verified Contacts
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {analyticsData.contactStats.verified}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Email Success Rate
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {Math.round((analyticsData.emailStats.delivered / 
                    (analyticsData.emailStats.delivered + analyticsData.emailStats.bounced)) * 100)}%
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Job Status Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Job Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jobStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Timeline</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="jobs" stroke="#8884d8" />
                <Line type="monotone" dataKey="contacts" stroke="#82ca9d" />
                <Line type="monotone" dataKey="emails" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 