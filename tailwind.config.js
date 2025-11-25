/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        kalam: ['Kalam', 'cursive'],
        gemunu: ['Gemunu Libre', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
