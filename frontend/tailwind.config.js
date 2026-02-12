/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This line is the "magic" that makes my code work
  theme: {
    extend: {},
  },
  plugins: [],
}