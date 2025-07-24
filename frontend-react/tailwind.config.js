const theme = require('./theme');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  darkMode: 'class', // Habilita dark mode por clase
  safelist: [
    // Asegura que clases dinámicas de color y fondo no sean purgadas
    'bg-primary', 'bg-primary-light', 'bg-primary-dark',
    'bg-secondary', 'bg-success', 'bg-danger',
    'text-primary', 'text-secondary', 'text-success', 'text-danger',
    'border-primary', 'border-secondary', 'border-success', 'border-danger',
    'hover:bg-primary', 'hover:bg-secondary',
    'focus:ring-primary', 'focus:ring-secondary',
  ],
  theme: {
    extend: {
      colors: theme.colors,
      fontFamily: theme.fontFamily,
      screens: theme.screens,
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'spin-slow': 'spin 2.5s linear infinite',
        'fade-in': 'fadeIn 0.7s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};  