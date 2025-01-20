/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f8f7f4',
        secondary: '#ffd4d4',
        accent: '#d4e6e1',
        purple: '#e6d4ff',
        peach: '#ffe4d4'
      }
    },
  },
  plugins: [],
}
