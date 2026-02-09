/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agri-green': {
          50: '#f0f9f4',
          100: '#dcf2e3',
          200: '#bce4ca',
          300: '#8fcea6',
          400: '#5cb07a',
          500: '#3a9159',
          600: '#2a7547',
          700: '#235d3a',
          800: '#1f4b31',
          900: '#1a3f29',
        },
        'agri-brown': {
          50: '#faf7f2',
          100: '#f4ede0',
          200: '#e7d8c0',
          300: '#d7be9a',
          400: '#c59f72',
          500: '#b8875a',
          600: '#a9734d',
          700: '#8c5d41',
          800: '#734d3a',
          900: '#5f4132',
        },
      },
    },
  },
  plugins: [],
}

