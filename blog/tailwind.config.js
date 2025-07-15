/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js", "./articles/**/*.md"],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
