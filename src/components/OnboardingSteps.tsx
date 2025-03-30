import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Define step validation schemas
const companyDetailsSchema = Yup.object().shape({
  companyName: Yup.string().required('Company name is required'),
  industry: Yup.string().required('Industry is required'),
  employeeSize: Yup.string().required('Employee size is required'),
});

const primaryContactSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
});

const salesforceDetailsSchema = Yup.object().shape({
  productionOrgName: Yup.string().required('Production org name is required'),
  productionOrgId: Yup.string().required('Production org ID is required'),
  sandboxOrgName: Yup.string(),
  sandboxOrgId: Yup.string(),
});

const pricingSchema = Yup.object().shape({
  plan: Yup.string().required('Please select a plan'),
  billingCycle: Yup.string().when('plan', {
    is: (val: any) => val === 'premium',
    then: () => Yup.string().required('Billing cycle is required'),
    otherwise: () => Yup.string()
  }),
  creatorLicenses: Yup.number().when('plan', {
    is: (val: any) => val === 'premium',
    then: () => Yup.number().min(1, 'At least 1 license is required').required('Number of licenses is required'),
    otherwise: () => Yup.number()
  }),
  viewerLicenses: Yup.number().when('plan', {
    is: (val: any) => val === 'premium',
    then: () => Yup.number().min(0, 'Number must be 0 or greater').required('Number of licenses is required'),
    otherwise: () => Yup.number()
  }),
  hostingOption: Yup.string().when('plan', {
    is: (val: any) => val === 'premium',
    then: () => Yup.string().required('Hosting option is required'),
    otherwise: () => Yup.string()
  }),
  cloudProvider: Yup.string().when('hostingOption', {
    is: (val: any) => val === 'self',
    then: () => Yup.string().required('Cloud provider is required'),
    otherwise: () => Yup.string()
  }),
  apiKey: Yup.string().when('hostingOption', {
    is: (val: any) => val === 'self',
    then: () => Yup.string().required('API Key is required'),
    otherwise: () => Yup.string()
  }),
  storageSize: Yup.number().when('hostingOption', {
    is: (val: any) => val === 'company',
    then: () => Yup.number().min(10, 'Minimum storage is 10GB').required('Storage size is required'),
    otherwise: () => Yup.number()
  }),
});

// Define types for form values
interface FormValues {
  // Company Details
  companyName: string;
  industry: string;
  employeeSize: string;
  
  // Primary Contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Salesforce Details
  productionOrgName: string;
  productionOrgId: string;
  sandboxOrgName: string;
  sandboxOrgId: string;
  
  // Pricing
  plan: string;
  billingCycle: string;
  creatorLicenses: number;
  viewerLicenses: number;
  hostingOption: string;
  cloudProvider: string;
  apiKey: string;
  region: string;
  storageSize: number;
}

// Define types for pricing values only
interface PricingValues {
  plan: string;
  billingCycle: string;
  creatorLicenses: number;
  viewerLicenses: number;
  hostingOption: string;
  cloudProvider: string;
  apiKey: string;
  region: string;
  storageSize: number;
}

interface OnboardingStepsProps {
  onComplete: () => void;
}

const OnboardingSteps: React.FC<OnboardingStepsProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Company Details
    companyName: '',
    industry: '',
    employeeSize: '',
    
    // Primary Contact
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Salesforce Details
    productionOrgName: '',
    productionOrgId: '',
    sandboxOrgName: '',
    sandboxOrgId: '',
    
    // Pricing
    plan: 'trial', // Default to trial plan
    billingCycle: 'monthly', // 'monthly' or 'annual'
    creatorLicenses: 1,
    viewerLicenses: 1,
    hostingOption: 'company', // 'self' or 'company'
    cloudProvider: '',
    apiKey: '',
    region: '',
    storageSize: 10,
  });

  const totalSteps = 4;
  
  const handleSubmitStep = (values: any) => {
    setFormData({ ...formData, ...values });
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Process final submission
      console.log('Final form data:', { ...formData, ...values });
      onComplete();
    }
  };

  const handleBack = () => {
    console.log('handleBack called, current step:', currentStep);
    if (currentStep > 1) {
      console.log('Setting step to:', currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  };

  const calculatePrice = (values: PricingValues): number => {
    if (values.plan === 'trial') return 0;
    
    // Ensure we have valid numbers for calculation
    const creatorCount = Math.max(1, values.creatorLicenses || 1);
    const viewerCount = Math.max(0, values.viewerLicenses || 0);
    const storageAmount = Math.max(10, values.storageSize || 10);
    
    let creatorPrice = creatorCount * 49;
    let viewerPrice = viewerCount * 24;
    let storagePrice = 0;
    
    if (values.hostingOption === 'company') {
      storagePrice = storageAmount * 1; // $1 per GB, minimum 10GB
    }
    
    let total = creatorPrice + viewerPrice + storagePrice;
    
    // Apply annual discount (20% off)
    if (values.billingCycle === 'annual') {
      total = total * 0.8;
    }
    
    // Round to 2 decimal places
    return Math.round(total * 100) / 100;
  };

  const industries = [
    'Technology',
    'Healthcare',
    'Financial Services',
    'Manufacturing',
    'Retail',
    'Education',
    'Energy',
    'Other'
  ];

  const employeeSizes = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1001-5000',
    '5000+'
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Formik
            initialValues={{
              companyName: formData.companyName,
              industry: formData.industry,
              employeeSize: formData.employeeSize,
            }}
            validationSchema={companyDetailsSchema}
            onSubmit={handleSubmitStep}
          >
            <Form className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Company Details</h2>
              
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-text-primary mb-1">
                  Company Name
                </label>
                <Field
                  type="text"
                  id="companyName"
                  name="companyName"
                  className="input-field"
                />
                <ErrorMessage name="companyName" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-text-primary mb-1">
                  Industry
                </label>
                <Field
                  as="select"
                  id="industry"
                  name="industry"
                  className="input-field"
                >
                  <option value="">Select Industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </Field>
                <ErrorMessage name="industry" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div>
                <label htmlFor="employeeSize" className="block text-sm font-medium text-text-primary mb-1">
                  Employee Size
                </label>
                <Field
                  as="select"
                  id="employeeSize"
                  name="employeeSize"
                  className="input-field"
                >
                  <option value="">Select Employee Size</option>
                  {employeeSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </Field>
                <ErrorMessage name="employeeSize" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div className="pt-4 flex justify-end">
                <button type="submit" className="btn-primary">
                  Next
                </button>
              </div>
            </Form>
          </Formik>
        );
        
      case 2:
        return (
          <Formik
            initialValues={{
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
            }}
            validationSchema={primaryContactSchema}
            onSubmit={handleSubmitStep}
          >
            <Form className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Primary Contact</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-1">
                    First Name
                  </label>
                  <Field
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="input-field"
                  />
                  <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-1">
                    Last Name
                  </label>
                  <Field
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="input-field"
                  />
                  <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="input-field"
                />
                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-1">
                  Phone Number
                </label>
                <Field
                  type="text"
                  id="phone"
                  name="phone"
                  className="input-field"
                />
                <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div className="pt-4 flex justify-between">
                <button 
                  type="button" 
                  className="btn-outline" 
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </button>
                <button type="submit" className="btn-primary">
                  Next
                </button>
              </div>
            </Form>
          </Formik>
        );
        
      case 3:
        return (
          <Formik
            initialValues={{
              productionOrgName: formData.productionOrgName,
              productionOrgId: formData.productionOrgId,
              sandboxOrgName: formData.sandboxOrgName || '',
              sandboxOrgId: formData.sandboxOrgId || '',
            }}
            validationSchema={salesforceDetailsSchema}
            onSubmit={handleSubmitStep}
          >
            <Form className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Salesforce Instance Details</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-primary">Production Environment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="productionOrgName" className="block text-sm font-medium text-text-primary mb-1">
                      Organization Name
                    </label>
                    <Field
                      type="text"
                      id="productionOrgName"
                      name="productionOrgName"
                      className="input-field"
                    />
                    <ErrorMessage name="productionOrgName" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div>
                    <label htmlFor="productionOrgId" className="block text-sm font-medium text-text-primary mb-1">
                      Organization ID
                    </label>
                    <Field
                      type="text"
                      id="productionOrgId"
                      name="productionOrgId"
                      className="input-field"
                    />
                    <ErrorMessage name="productionOrgId" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-primary">Sandbox Environment</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sandboxOrgName" className="block text-sm font-medium text-text-primary mb-1">
                      Organization Name
                    </label>
                    <Field
                      type="text"
                      id="sandboxOrgName"
                      name="sandboxOrgName"
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="sandboxOrgId" className="block text-sm font-medium text-text-primary mb-1">
                      Organization ID
                    </label>
                    <Field
                      type="text"
                      id="sandboxOrgId"
                      name="sandboxOrgId"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <button 
                  type="button" 
                  className="btn-outline" 
                  onClick={() => setCurrentStep(2)}
                >
                  Back
                </button>
                <button type="submit" className="btn-primary">
                  Next
                </button>
              </div>
            </Form>
          </Formik>
        );
        
      case 4:
        return (
          <Formik
            initialValues={{
              plan: formData.plan || 'trial', // Ensure trial plan is set as fallback
              billingCycle: formData.billingCycle,
              creatorLicenses: formData.creatorLicenses,
              viewerLicenses: formData.viewerLicenses,
              hostingOption: formData.hostingOption,
              cloudProvider: formData.cloudProvider,
              apiKey: formData.apiKey,
              region: formData.region,
              storageSize: formData.storageSize,
            }}
            validationSchema={pricingSchema}
            onSubmit={handleSubmitStep}
          >
            {({ values, setFieldValue }) => {
              // IMPORTANT: Define a function to set default values but don't use hooks
              const setPremiumDefaults = () => {
                setFieldValue('plan', 'premium');
                setFieldValue('billingCycle', 'monthly');
                setFieldValue('creatorLicenses', 1);
                setFieldValue('viewerLicenses', 1);
                setFieldValue('hostingOption', 'company');
                setFieldValue('storageSize', 10);
              };
              
              // Don't use useEffect - this causes the "more hooks" error
              // Instead, check if plan is empty and set it in the render phase
              if (!values.plan) {
                // Use setTimeout to push this to the next event loop tick
                // This helps avoid render issues
                setTimeout(() => {
                  setFieldValue('plan', 'trial');
                }, 0);
              }
              
              return (
                <Form className="space-y-6">
                  <h2 className="text-xl font-bold mb-4">Select Your Plan</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      className={`border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                        values.plan === 'trial'
                          ? 'border-primary-dark bg-primary/5 shadow-md'
                          : 'border-gray-300 hover:border-primary hover:shadow-md'
                      }`}
                      onClick={() => setFieldValue('plan', 'trial')}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-primary">Free Trial</h3>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                            values.plan === 'trial' ? 'border-primary' : 'border-gray-300'
                          }`}
                        >
                          {values.plan === 'trial' && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-text-secondary mb-4">
                        Try Force Analytics for 7 days with no commitment.
                      </p>
                      
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-secondary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>1 Creator License</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-secondary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>1 Viewer License</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-secondary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>10GB Storage</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-secondary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>All Features Included</span>
                        </li>
                      </ul>
                      
                      <div className="text-center">
                        <p className="text-xl font-bold">$0</p>
                        <p className="text-sm text-text-secondary">No credit card required</p>
                      </div>
                    </div>
                    
                    <div
                      className={`border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                        values.plan === 'premium'
                          ? 'border-primary-dark bg-primary/5 shadow-md'
                          : 'border-gray-300 hover:border-primary hover:shadow-md'
                      }`}
                      onClick={setPremiumDefaults}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-primary">Premium Plan</h3>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                            values.plan === 'premium' ? 'border-primary' : 'border-gray-300'
                          }`}
                        >
                          {values.plan === 'premium' && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-text-secondary mb-4">
                        Full access to all features with custom licensing.
                      </p>
                      
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-secondary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Multiple Creator Licenses ($49/month each)</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-secondary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Multiple Viewer Licenses ($24/month each)</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-secondary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Self-hosted or Company Cloud options</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-secondary mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Priority Support</span>
                        </li>
                      </ul>
                      
                      <div className="text-center">
                        <p className="text-xl font-bold">
                          Starting at ${values.plan === 'premium' 
                            ? calculatePrice({
                                plan: 'premium',
                                billingCycle: values.billingCycle || 'monthly',
                                creatorLicenses: values.creatorLicenses || 1,
                                viewerLicenses: values.viewerLicenses || 1,
                                hostingOption: values.hostingOption || 'company',
                                cloudProvider: values.cloudProvider || '',
                                apiKey: values.apiKey || '',
                                region: values.region || '',
                                storageSize: values.storageSize || 10
                              }) 
                            : '83'
                          }
                        </p>
                        <p className="text-sm text-text-secondary">
                          {values.billingCycle === 'annual' ? 'Billed annually (20% discount)' : 'Billed monthly'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {values.plan === 'premium' && (
                    <>
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-bold mb-4">Billing Cycle</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition ${
                              values.billingCycle === 'monthly'
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-300 hover:border-primary'
                            }`}
                            onClick={() => setFieldValue('billingCycle', 'monthly')}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                  values.billingCycle === 'monthly' ? 'border-primary' : 'border-gray-400'
                                }`}
                              >
                                {values.billingCycle === 'monthly' && (
                                  <div className="w-3 h-3 rounded-full bg-primary" />
                                )}
                              </div>
                              <span className="font-medium">Monthly</span>
                            </div>
                          </div>
                          
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition ${
                              values.billingCycle === 'annual'
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-300 hover:border-primary'
                            }`}
                            onClick={() => setFieldValue('billingCycle', 'annual')}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                  values.billingCycle === 'annual' ? 'border-primary' : 'border-gray-400'
                                }`}
                              >
                                {values.billingCycle === 'annual' && (
                                  <div className="w-3 h-3 rounded-full bg-primary" />
                                )}
                              </div>
                              <span className="font-medium">Annual (20% discount)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-bold mb-4">License Configuration</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="creatorLicenses" className="block text-sm font-medium text-text-primary mb-1">
                              Creator Licenses ($49 each)
                            </label>
                            <Field
                              type="number"
                              id="creatorLicenses"
                              name="creatorLicenses"
                              min="1"
                              className="input-field"
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = parseInt(e.target.value);
                                setFieldValue('creatorLicenses', value);
                              }}
                            />
                            <ErrorMessage name="creatorLicenses" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                          
                          <div>
                            <label htmlFor="viewerLicenses" className="block text-sm font-medium text-text-primary mb-1">
                              Viewer Licenses ($24 each)
                            </label>
                            <Field
                              type="number"
                              id="viewerLicenses"
                              name="viewerLicenses"
                              min="0"
                              className="input-field"
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = parseInt(e.target.value);
                                setFieldValue('viewerLicenses', value);
                              }}
                            />
                            <ErrorMessage name="viewerLicenses" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-bold mb-4">Hosting Configuration</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition ${
                              values.hostingOption === 'self'
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-300 hover:border-primary'
                            }`}
                            onClick={() => setFieldValue('hostingOption', 'self')}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                  values.hostingOption === 'self' ? 'border-primary' : 'border-gray-400'
                                }`}
                              >
                                {values.hostingOption === 'self' && (
                                  <div className="w-3 h-3 rounded-full bg-primary" />
                                )}
                              </div>
                              <span className="font-medium">Self-Hosted</span>
                            </div>
                            <p className="mt-2 text-sm text-text-secondary">
                              Use your own cloud infrastructure
                            </p>
                          </div>
                          
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition ${
                              values.hostingOption === 'company'
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-300 hover:border-primary'
                            }`}
                            onClick={() => setFieldValue('hostingOption', 'company')}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                  values.hostingOption === 'company' ? 'border-primary' : 'border-gray-400'
                                }`}
                              >
                                {values.hostingOption === 'company' && (
                                  <div className="w-3 h-3 rounded-full bg-primary" />
                                )}
                              </div>
                              <span className="font-medium">Company Cloud</span>
                            </div>
                            <p className="mt-2 text-sm text-text-secondary">
                              We handle the hosting for you
                            </p>
                          </div>
                        </div>
                        
                        {values.hostingOption === 'self' && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
                            <div>
                              <label htmlFor="cloudProvider" className="block text-sm font-medium text-text-primary mb-1">
                                Cloud Provider
                              </label>
                              <Field
                                as="select"
                                id="cloudProvider"
                                name="cloudProvider"
                                className="input-field"
                              >
                                <option value="">Select Cloud Provider</option>
                                <option value="aws">AWS</option>
                                <option value="azure">Azure</option>
                                <option value="gcs">Google Cloud</option>
                              </Field>
                              <ErrorMessage name="cloudProvider" component="div" className="mt-1 text-sm text-red-600" />
                            </div>
                            
                            {values.cloudProvider && (
                              <>
                                <div>
                                  <label htmlFor="apiKey" className="block text-sm font-medium text-text-primary mb-1">
                                    API Key / Access Token
                                  </label>
                                  <Field
                                    type="text"
                                    id="apiKey"
                                    name="apiKey"
                                    className="input-field"
                                  />
                                  <ErrorMessage name="apiKey" component="div" className="mt-1 text-sm text-red-600" />
                                </div>
                                
                                <div>
                                  <label htmlFor="region" className="block text-sm font-medium text-text-primary mb-1">
                                    Region
                                  </label>
                                  <Field
                                    as="select"
                                    id="region"
                                    name="region"
                                    className="input-field"
                                  >
                                    <option value="">Select Region</option>
                                    {values.cloudProvider === 'aws' && (
                                      <>
                                        <option value="us-east-1">US East (N. Virginia)</option>
                                        <option value="us-west-1">US West (N. California)</option>
                                        <option value="eu-west-1">EU (Ireland)</option>
                                        <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
                                      </>
                                    )}
                                    {values.cloudProvider === 'azure' && (
                                      <>
                                        <option value="eastus">East US</option>
                                        <option value="westus2">West US 2</option>
                                        <option value="westeurope">West Europe</option>
                                        <option value="southeastasia">Southeast Asia</option>
                                      </>
                                    )}
                                    {values.cloudProvider === 'gcs' && (
                                      <>
                                        <option value="us-central1">US Central (Iowa)</option>
                                        <option value="us-east1">US East (S. Carolina)</option>
                                        <option value="europe-west1">Europe West (Belgium)</option>
                                        <option value="asia-east1">Asia East (Taiwan)</option>
                                      </>
                                    )}
                                  </Field>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                        
                        {values.hostingOption === 'company' && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div>
                              <label htmlFor="storageSize" className="block text-sm font-medium text-text-primary mb-1">
                                Storage Size (GB) - $1/GB
                              </label>
                              <Field
                                type="number"
                                id="storageSize"
                                name="storageSize"
                                min="10"
                                className="input-field"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const value = parseInt(e.target.value);
                                  setFieldValue('storageSize', value);
                                }}
                              />
                              <ErrorMessage name="storageSize" component="div" className="mt-1 text-sm text-red-600" />
                              <p className="mt-1 text-sm text-text-secondary">
                                Minimum 10GB required
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-bold">Total:</h3>
                            <p className="text-sm text-text-secondary">
                              {values.billingCycle === 'annual' ? 'Billed annually' : 'Billed monthly'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              ${calculatePrice({
                                ...values,
                                creatorLicenses: values.creatorLicenses || 1,
                                viewerLicenses: values.viewerLicenses || 0,
                                storageSize: values.storageSize || 10
                              })}
                            </p>
                            <p className="text-sm text-text-secondary">
                              {values.billingCycle === 'annual' 
                                ? `$${(calculatePrice({
                                    ...values,
                                    creatorLicenses: values.creatorLicenses || 1,
                                    viewerLicenses: values.viewerLicenses || 0,
                                    storageSize: values.storageSize || 10
                                  }) * 12).toFixed(2)} per year (20% savings)` 
                                : 'per month'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="pt-4 flex justify-between">
                    <button 
                      type="button" 
                      className="btn-outline" 
                      onClick={() => setCurrentStep(3)}
                    >
                      Back
                    </button>
                    <button type="submit" className="btn-primary">
                      {values.plan === 'trial' ? 'Start Free Trial' : 'Continue to Payment'}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        );
        
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <React.Fragment key={step}>
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-text-secondary'
                }`}
              >
                {step < currentStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              
              {step < totalSteps && (
                <div
                  className={`flex-grow h-1 ${
                    step < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {renderStep()}
    </div>
  );
};

export default OnboardingSteps; 