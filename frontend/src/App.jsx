import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from './components/Layout/Layout';
import ContactList from './pages/Contacts/ContactList';
import ContactForm from './pages/Contacts/ContactForm';
import JobList from './pages/Jobs/JobList';
import JobForm from './pages/Jobs/JobForm';
import Settings from './pages/Settings/Settings';
import AnalyticsDashboard from './pages/Analytics/AnalyticsDashboard';
import Campaigns from './pages/Campaigns/Campaigns';
import Senders from './pages/Senders/Senders';
import EmailTemplatePreview from './pages/Campaigns/EmailTemplates/EmailTemplatePreview';
import EmailVerification from './pages/Contacts/EmailVerification';
import CampaignScheduler from './pages/Campaigns/CampaignScheduler';
import AutomationDashboard from './pages/Campaigns/AutomationDashboard';
import EmailTemplateList from './pages/Campaigns/EmailTemplates/EmailTemplateList';
import EmailTemplateForm from './pages/Campaigns/EmailTemplates/EmailTemplateForm';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/contacts" element={<ContactList />} />
            <Route path="/contacts/new" element={<ContactForm />} />
            <Route path="/contacts/:id/edit" element={<ContactForm />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/new" element={<JobForm />} />
            <Route path="/jobs/:id/edit" element={<JobForm />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/senders" element={<Senders />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/" element={<ContactList />} />
            <Route path="/campaigns/templates/:id/preview" element={<EmailTemplatePreview />} />
            <Route path="/contacts/verify-email" element={<EmailVerification />} />
            <Route path="/campaigns/schedule" element={<CampaignScheduler />} />
            <Route path="/campaigns/automations" element={<AutomationDashboard />} />
            <Route path="/campaigns/templates" element={<EmailTemplateList />} />
            <Route path="/campaigns/templates/new" element={<EmailTemplateForm />} />
            <Route path="/campaigns/templates/:id/edit" element={<EmailTemplateForm />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App; 