import React from 'react';
import Layout from '@/components/Layout';

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div>
            <button className="btn-primary">New Dashboard</button>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Force Analytics!</h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            Your account is now set up and ready to use. You can now start creating dashboards and
            connecting to your Salesforce data.
          </p>
          <button className="btn-primary">
            Create Your First Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage; 