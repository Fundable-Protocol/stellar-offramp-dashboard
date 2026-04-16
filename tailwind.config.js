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
          dark: '#0a0014',
          'mid-dark': '#111118',
          grey: '#4a4949',
          'light-grey': '#8792ab',
          'mid-grey': '#1a1a2e',
          placeholder: '#4e5679',
          purple: '#b102cd',
          'purple-2': '#8256ff',
          violet: '#5b21b6',
          'deep-purple': '#440495',
          'faint-white': '#E1E1E1',
          accent: '#6366f1',
        },
        border: '#252939',
        background: '#0a0014',
        foreground: '#E1E1E1',
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 2s infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
