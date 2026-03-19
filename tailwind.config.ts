import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'amber':    '#F0A824',
        'white':    '#FFFFFF',
        'grey':     '#DCDCDC',
        'carbon':   '#1F1F1F',
      },
      fontFamily: {
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
        'dm':      ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
