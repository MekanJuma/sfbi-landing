import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import OnboardingSteps from '@/components/OnboardingSteps';

const OnboardingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Open modal automatically when the page loads
    setIsModalOpen(true);
  }, []);

  const handleCompleteOnboarding = () => {
    // Close the modal and redirect to the dashboard
    setIsModalOpen(false);
    router.push('/dashboard');
  };

  const handleCloseModal = () => {
    // If user attempts to close modal, show warning or prevent closing
    if (confirm('Your onboarding is not complete. Are you sure you want to exit?')) {
      setIsModalOpen(false);
      router.push('/');
    }
  };

  return (
    <Layout>
      <div className="container-custom py-16">
        <div className="text-center">
          <h1 className="mb-4">Welcome to Force Analytics!</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Let's get your account set up. Please complete the onboarding process to start using your account.
          </p>
          
          {!isModalOpen && (
            <button
              className="btn-primary mt-8"
              onClick={() => setIsModalOpen(true)}
            >
              Continue Onboarding
            </button>
          )}
        </div>
        
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Complete Your Account Setup"
          size="lg"
        >
          <OnboardingSteps onComplete={handleCompleteOnboarding} />
        </Modal>
      </div>
    </Layout>
  );
};

export default OnboardingPage; 