const colors = require('tailwindcss/colors')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'at-scrollbar',
    'at-md-content',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2EB8B8'
      }
    },
  },
  plugins: [],
}
