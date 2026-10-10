/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hospital: {
          blue: '#0ea5e9',
          cyan: '#06b6d4',
          teal: '#14b8a6',
          navy: '#0a192f',
          dark: '#030712',
          surface: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          light: '#f8fafc',
          accent: '#38bdf8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}


