/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // COR PRINCIPAL DO SITE (ALTERE O HEXA AQUI)
        primary: {
          DEFAULT: '#2e82d1',
          glow: 'rgba(46, 130, 209, 0.4)',
        },
        // COR DE DESTAQUE/ACENTO
        accent: '#70d7ff',
        bg: '#000000',
        dark: '#050505',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.1)' },
        }
      }
    },
  },
  plugins: [],
}
