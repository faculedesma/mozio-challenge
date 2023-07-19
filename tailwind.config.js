/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif']
      },
      colors: {
        black: 'var(--black)',
        white: 'var(--white)',
        blur: 'var(--blur)',
        purple: {
          light: 'var(--purple-light)',
          dark: 'var(--purple-dark)',
          darker: 'var(--purple-darker)'
        },
        gray: {
          light: 'var(--gray)',
          dark: 'var(--gray-dark)'
        },
        red: 'var(--red)'
      },
      boxShadow: {
        'purple-lg': '0px 4px 6px -2px var(--purple-light)'
      }
    }
  },
  plugins: []
};
