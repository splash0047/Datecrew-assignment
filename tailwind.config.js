/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#F8F7F4', // Warm paper
          secondary: '#F3F2EE'
        },
        card: {
          DEFAULT: '#FFFFFF',
        },
        primary: {
          DEFAULT: '#5B4AE6', // Deep Indigo
          light: '#7C6CF2',   // Muted Lavender
        },
        accent: {
          DEFAULT: '#C8A95D', // Warm Gold
        },
        success: '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
        text: {
          primary: '#111827',
          secondary: '#6B7280',
        },
        border: {
          DEFAULT: '#E5E7EB',
        }
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Sans', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        interactive: '12px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(17, 24, 39, 0.05), 0 1px 2px -1px rgba(17, 24, 39, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(17, 24, 39, 0.08), 0 2px 4px -2px rgba(17, 24, 39, 0.08)',
      }
    },
  },
  plugins: [],
}
