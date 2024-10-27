/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");
const { Scale } = require("lucide-react");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 4s linear infinite",
      },
      scale: {
        80: "0.80",
      },
      boxShadow: {
        neumorphism: "4px 4px 8px #bebebe, -4px -4px 8px #ffffff",
        "neumorphism-active":
          "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
      },
      colors: {
        "blue-custom": "#004E98",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        inter: ["Inter", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 1s linear infinite",
        "fade-out": "fadeOut 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-in forwards",
      },
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      colors: {
        background: "#FFFFFF", // or DEFAULT
        foreground: "#11181C", // or 50 to 900 DEFAULT
        primary: {
          // ... 50 to 900
          foreground: "#FFFFFF",
          DEFAULT: "006FEE",
        },
      },
    }),
  ],
};
