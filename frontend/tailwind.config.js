/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'burgundy': '#6B1D2F',
        'burgundy-light': '#F9EBEF',
        'burgundy-hover': '#541523',
        'burgundy-shadow': '#3D0E19',
        'emerald': '#0F766E',
        'emerald-bright': '#10B981',
        'emerald-light': '#E6F4F1',
        'emerald-hover': '#0D655E',
        'emerald-shadow': '#047857',
        'fire': '#FF6B00',
        'gold': '#FFB800',
        'heart': '#FF3B30',
        'gem': '#00A3FF',
        'cream': '#FAF7F2',
        'cream-2': '#F3EDE4',
      },
      fontFamily: {
        heading: ['Fredoka', 'Plus Jakarta Sans', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem' },
    },
  },
  plugins: [],
}
