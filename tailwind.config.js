/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pet: {
          sky: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            500: '#0284c7',
            600: '#0369a1',
            700: '#075985',
          },
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#16a34a',
            600: '#15803d',
            700: '#166534',
          },
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            500: '#ea580c',
            600: '#d97706',
            700: '#b45309',
          },
          slate: {
            50: '#f8fafc',
            100: '#f1f5f9',
            800: '#1e293b',
            900: '#0f172a',
          }
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'premium-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
