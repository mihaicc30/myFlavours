/** @type {import('tailwindcss').Config} */

const { join } = require("path");

module.exports = {
  content: [join(__dirname, "./pages/**/*.{js,ts,jsx,tsx}"), join(__dirname, "./src/**/*.{js,ts,jsx,tsx}"), "./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "./www/**/*.{js,ts,jsx,tsx,mdx}", "./out/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        fadeUP: "fadeUP 1s ease forwards",
        fadeIN: "fadeIN .4s ease forwards",
      },
      keyframes: {
        fadeUP: {
          "0%": { transform: "scale(0)", transformOrigin: "top", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIN: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
