/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily:{
        Italiana: ["Italiana","sans-serif"]
      },
      gridTemplateColumns:{
        '16': 'repeat(16,minmax(0,1fr))'
      }
    },
  },
  plugins: [],
}

