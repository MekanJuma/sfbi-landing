import React from 'react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    content: "Force Analytics has transformed how we analyze our Salesforce data. The intuitive interface made it easy for our team to create meaningful dashboards without any technical expertise.",
    author: "Sarah Johnson",
    position: "CRM Manager",
    company: "TechCorp Inc.",
    avatar: "/avatars/avatar-1.jpg"
  },
  {
    id: 2,
    content: "We've been able to combine our Salesforce data with multiple other sources seamlessly. The insights we've gained have directly contributed to a 27% increase in our sales efficiency.",
    author: "Michael Chen",
    position: "VP of Sales",
    company: "Global Retail Solutions",
    avatar: "/avatars/avatar-2.jpg"
  },
  {
    id: 3,
    content: "As a data analyst, I appreciate the SQL query books feature. It allows me to perform complex analyses while maintaining documentation that my less technical colleagues can understand.",
    author: "Alex Rodriguez",
    position: "Business Intelligence Analyst",
    company: "Finance Partners LLC",
    avatar: "/avatars/avatar-3.jpg"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="section bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">What Our Customers Say</h2>
          <p className="text-lg">
            Thousands of companies use Force Analytics to get more value from their Salesforce data.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card flex flex-col h-full">
              <div className="flex-grow mb-6">
                <svg className="h-8 w-8 text-primary/40 mb-4" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="italic text-text-primary">{testimonial.content}</p>
              </div>
              
              <div className="flex items-center mt-auto">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <div className="bg-gray-200 h-full w-full absolute flex items-center justify-center text-gray-500">
                    {testimonial.author.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{testimonial.author}</p>
                  <p className="text-sm text-text-secondary">{testimonial.position}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 