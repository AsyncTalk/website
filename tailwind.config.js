/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      width: {
        '128': '32rem',
      },
      colors: {
        primary: 'oklch(71.33% 0.112 194.94)'
      }
    },
  },
  plugins: [],
};
