import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-20 pb-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <h1 className="mb-6 text-text-primary">
              Empower Your Business with Seamless Data Analytics
            </h1>
            <p className="text-xl mb-8">
              Connect, Transform, and Visualize Data from Salesforce and External Sources – All in One Platform.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Link href="/signup" className="btn-primary">
                Get Started
              </Link>
              <Link href="/guide" className="btn-outline">
                Learn More
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required for free trial</span>
            </div>
          </div>
          
          <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-elevated">
            <Image 
              src="/images/hero-dashboard.webp" 
              alt="Force Analytics Dashboard" 
              style={{ objectFit: 'fill' }}
              priority
              fill
              className="rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 