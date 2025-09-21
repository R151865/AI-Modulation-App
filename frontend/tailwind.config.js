/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        danger: {
          100: '#fee2e2',
          500: '#ef4444',
          900: '#7f1d1d'
        },
        warning: {
          100: '#fef3c7',
          500: '#f59e0b',
          900: '#78350f'
        },
        success: {
          100: '#dcfce7',
          500: '#22c55e',
          900: '#14532d'
        }
      }
    },
  },
  plugins: [],
}