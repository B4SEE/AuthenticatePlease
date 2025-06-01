/** @type {import('tailwindcss').Config} */
const aspectRatio = require('@tailwindcss/aspect-ratio');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        'extra-thin': '50',
      },
      boxShadow: {
        heavy: '0 0px 30px rgba(0, 0, 0, 0.6)',
      },
      colors: {
        primary: '#00ffd1',
        error: '#ff4365',
     
      },
    },
  },
  plugins: [aspectRatio],
};
