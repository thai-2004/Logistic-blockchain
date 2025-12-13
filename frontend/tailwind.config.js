/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0b0e11',
        },
        brand: {
          primary: '#f3ba2f', // Binance yellow
          secondary: '#6a75ff',
          panel: '#0f1116',
          border: '#1e2329',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'panel': '0 16px 40px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};

