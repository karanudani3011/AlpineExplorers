module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
        },
        accent: {
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        navy: '#001a4d',
        teal: '#14b8a6',
        beige: '#f5e6d3',
        parchment: {
          50: '#fdfbf7',
          100: '#f7f2e7',
          200: '#ede1c8',
          300: '#e1cca4',
          400: '#cfb17d',
        },
        leather: '#5c2c16',
        agedGold: '#c59b27',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        vintage: ['Cinzel', 'serif'],
        handwritten: ['Caveat', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.6s ease-out',
        slideIn: 'slideIn 0.8s ease-out',
        scaleIn: 'scaleIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
