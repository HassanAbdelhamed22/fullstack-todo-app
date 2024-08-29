/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        lightBg: "#fff",
        darkBg: "#2c2c2c",
        secondaryLightBg: "#f9f6fd",
        secondaryDarkBg: "#3a3a3a",
        lightText: "#27272a",
        darkText: "#f4f4f5",
        secondaryLightText: "#424243",
        secondaryDarkText: "#DADADC",
        borderLight: "#d1d1d6",
        borderDark: "#3a3a42",
        indigoLight: "#4f46e5",
        indigoDark: "#DCDAFA",
        buttonLightHover: "#3730a3",
        buttonDarkHover: "#818cf8",
      },
      keyframes: {
        customScale: {
          "0%": { transform: "scale(0)" },
          "60%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        customScale: "customScale 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
