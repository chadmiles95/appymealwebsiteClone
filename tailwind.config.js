const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    maxWidth: {
      container: "1520px",
      contentContainer: "1280px",
    },
   
    
    extend: {
      keyframes: {
        'color-fill': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'color-fill': 'color-fill 1s ease forwards',
      },
      height: {
        ninetyPercent: "91.5%"
      },
      backgroundSize: {
        'full-width': '200% 100%',
      },
      screens: {
        xs: "320px",
        sm: "375px",
        sml: "500px",
        md: "667px",
        mdl: "800px",
        lg: "960px",
        lgl: "1124px",
        xl: "1280px",
        "2xl": "1400px",
      },
      colors: {
        blue: "#0071dc",
        lightBlue: "#e6f1fc",
        yellow: "#ffc220",
        hoverBg: "#004f9a",
        lightText: "#46474a",
        primary: "#BF1F2E",
        secondary: "#BF1F2E",
        third: "#FCF7F8",
        fourth: "#4E8098",
        fifth: "#90C2E7",
        muted: "#D97982",
        preparing: "yellow",
        dark: "#240115",
        lightdark: "#B6AAB1",
        smoke: "#F1EDEE",
      },
      boxShadow: {
        bannerShadow: "0px 1px 2px 1px #00000026",
      },
      fontFamily: {
        sans: ["var(--font-open_sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [
    
  
  ],
  
};
