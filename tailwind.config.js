/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        canvas: {
          DEFAULT: '#F7F8FA',
          dark: '#0B0F17',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#121826',
        },
        border: {
          DEFAULT: '#E4E7EC',
          dark: '#232B3B',
        },
        ink: {
          DEFAULT: '#0F1522',
          dark: '#EAF0FA',
        },
        muted: {
          DEFAULT: '#5B6472',
          dark: '#8792A6',
        },
        brand: {
          50: '#EEF4FF',
          100: '#DCE8FF',
          200: '#B3CDFF',
          300: '#7FA9FF',
          400: '#4C7FFF',
          500: '#2E5CF0',
          600: '#1F44C7',
          700: '#18359C',
          800: '#122870',
          900: '#0C1B4A',
        },
        amber: {
          400: '#F3B23A',
          500: '#E29A15',
        },
        good: '#1FA97A',
        bad: '#E4574C',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 21, 34, 0.04), 0 1px 1px rgba(15, 21, 34, 0.03)',
        'card-dark': '0 1px 2px rgba(0,0,0,0.3)',
        pop: '0 8px 24px rgba(15, 21, 34, 0.10)',
      },
      borderRadius: {
        card: '10px',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out both',
        'slide-in': 'slideIn 0.25s ease-out both',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0, transform: 'translateY(4px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { '0%': { transform: 'translateX(-8px)', opacity: 0 }, '100%': { transform: 'translateX(0)', opacity: 1 } },
      },
    },
  },
  plugins: [],
}
