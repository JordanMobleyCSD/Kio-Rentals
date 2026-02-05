/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#ffffff",
        ink: "#0b0b0f",
        subtle: "#f5f5f7",
        line: "rgba(0,0,0,0.08)",
        accent: "#0071e3",
        accent2: "#34c759",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.06)",
        lift: "0 16px 50px rgba(0,0,0,0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
