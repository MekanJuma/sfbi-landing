import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-soft py-4">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-display font-bold text-primary">Force Analytics</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`font-medium ${router.pathname === '/' ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}>
              Home
            </Link>
            <Link href="/guide" className={`font-medium ${router.pathname === '/guide' ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}>
              Guide
            </Link>
            <Link href="/pricing" className={`font-medium ${router.pathname === '/pricing' ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}>
              Pricing
            </Link>
            <Link href="/signup" className="btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-text-primary hover:text-primary"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className={`font-medium px-2 py-1 ${router.pathname === '/' ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}>
                Home
              </Link>
              <Link href="/guide" className={`font-medium px-2 py-1 ${router.pathname === '/guide' ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}>
                Guide
              </Link>
              <Link href="/pricing" className={`font-medium px-2 py-1 ${router.pathname === '/pricing' ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}>
                Pricing
              </Link>
              <Link href="/signup" className="btn-primary w-full justify-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 