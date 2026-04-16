/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fundable: {
          dark: '#0d0019',
          'mid-dark': '#151617',
          grey: '#4a4949',
          'light-grey': '#8792ab',
          'mid-grey': '#252939',
          placeholder: '#4e5679',
          purple: '#b102cd',
          'purple-2': '#8256ff',
          violet: '#5b21b6',
          'deep-purple': '#440495',
          'faint-white': '#E1E1E1',
        },
        border: '#252939',
        background: '#0d0019',
        foreground: '#E1E1E1',
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
