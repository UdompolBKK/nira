/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Grayscale primary palette for black-and-white theme
        primary: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E9E9EB',
          300: '#D4D4D8',
          400: '#A3A3AA',
          500: '#737373',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#0F0F10'
        },
        // Standard semantic colors mapped to grayscale
        success: {
          500: '#737373',
          600: '#52525B'
        },
        warning: {
          500: '#737373',
          600: '#52525B'
        },
        danger: {
          500: '#737373',
          600: '#52525B'
        },
        info: {
          500: '#737373',
          600: '#52525B'
        }
      },
      fontFamily: {
        sans: ['"Prompt"', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      backgroundColor: {
        'card': '#FFFFFF',
        'body': '#FFFFFF',
      },
      borderColor: {
        'default': '#E5E7EB',
        extend: {
          colors: {
            // Allow all grayscale border colors
          }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
