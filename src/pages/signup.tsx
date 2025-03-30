import React from 'react';
import Layout from '@/components/Layout';
import SignUpForm from '@/components/SignUpForm';

const SignUpPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-soft">
            <SignUpForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignUpPage; 