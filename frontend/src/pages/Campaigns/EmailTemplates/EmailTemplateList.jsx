import { useNavigate } from 'react-router-dom';

export default function EmailTemplateList() {
  const navigate = useNavigate();

  console.log('EmailTemplateList rendering');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Email Templates</h1>
      <button
        onClick={() => {
          console.log('New template button clicked');
          navigate('/campaigns/templates/new');
        }}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        New Template
      </button>
    </div>
  );
} 