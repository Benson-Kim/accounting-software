/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      boxShadow: {
        'btn': '0 1px 2px 0 rgba(15, 23, 42, 0.06), 0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        'btn-pressed': 'inset 0 2px 4px 0 rgba(15, 23, 42, 0.12)',
        'phone': '0 25px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 8px #0f172a, 0 0 0 9px #1e293b',
      },
    },
  },
  plugins: [],
};
