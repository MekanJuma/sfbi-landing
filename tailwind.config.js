/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0047AB', // Rich blue for primary actions
          light: '#3D6DCC',
          dark: '#00376E',
        },
        secondary: {
          DEFAULT: '#16A34A', // Green for secondary actions
          light: '#22C55E',
          dark: '#15803D',
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber for accent highlights
          light: '#FBBF24',
          dark: '#D97706',
        },
        background: '#F9FAFB',
        surface: '#FFFFFF',
        text: {
          primary: '#111827',
          secondary: '#4B5563',
          disabled: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
} 