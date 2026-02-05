/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070708",
          900: "#0B0B0E",
          850: "#0F0F12",
        },
        gold: {
          50: "#FFFBEB",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
      },
      boxShadow: {
        luxe: "0 10px 30px rgba(0,0,0,0.45)",
        glow: "0 0 0 1px rgba(245, 158, 11, 0.25), 0 10px 40px rgba(245, 158, 11, 0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      letterSpacing: {
        luxe: "0.02em",
      },
    },
  },
  plugins: [],
};
