import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          DEFAULT: '#C4784A',
          dark: '#A5623A',
          light: '#E8DDD5',
        },
        'amber':    '#F0A824',
        'white':    '#FFFFFF',
        'grey':     '#DCDCDC',
        'carbon':   '#1F1F1F',
      },
      fontFamily: {
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
        'dm':      ['DM Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
