/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe7ff',
          200: '#bfd5ff',
          300: '#93b8ff',
          400: '#6092ff',
          500: '#3b74f6',
          600: '#2557e6',
          700: '#1e44c9',
          800: '#1e3ca2',
          900: '#1e367f',
        },
      },
      boxShadow: {
        card: '0 10px 30px -18px rgba(37, 87, 230, 0.35)',
        float: '0 24px 60px -30px rgba(37, 87, 230, 0.45)',
        glow: '0 14px 34px -14px rgba(59, 116, 246, 0.65)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2557e6 0%, #4f46e5 50%, #7c3aed 100%)',
        'brand-soft': 'linear-gradient(135deg, #eef4ff 0%, #f5f3ff 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        shimmer: 'shimmer 1.6s infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
