import React from 'react';
import Link from 'next/link';

const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-white mb-6">Ready to Transform Your Data Analytics?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Start your free trial today and discover how Force Analytics can help you make better decisions with your Salesforce data.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="btn bg-white text-primary hover:bg-gray-100">
              Start Free Trial
            </Link>
            <Link href="/contact" className="btn border-2 border-white text-white hover:bg-white/10">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 