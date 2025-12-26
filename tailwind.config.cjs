/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#020617',
          subtle: '#020617',
          raised: '#020617'
        },
        surface: {
          DEFAULT: '#020617',
          sunken: '#020617'
        },
        brand: {
          DEFAULT: '#22c55e',
          soft: 'rgba(34,197,94,0.12)'
        }
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15,23,42,0.85)'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      }
    }
  },
  plugins: []
};
