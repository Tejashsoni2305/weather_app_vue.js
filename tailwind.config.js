/** @type {import('tailwindcss').Config} */
export default {
  content: ["./indexedDB.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "weather-primary": "#2C3E50",
        "weather-secondary": "#BDC3C7",
      },
    },
    fontFamily: {
      Roboto: ["Roboto, sans-serif",]
    },
    container: {
      padding: "2rem",
      centre: true,
    },
    screens: {
      sm: "640px",
      md: "768px",
    },
  },
  plugins: [],
}

