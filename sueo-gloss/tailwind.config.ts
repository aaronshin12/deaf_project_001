import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#131F24",
        card: "#1B2B32",
        "card-border": "#2B3D45",
        green: { DEFAULT: "#58CC02", dark: "#46A302" },
        blue: { DEFAULT: "#1CB0F6" },
        purple: { DEFAULT: "#CE82FF" },
        red: { DEFAULT: "#FF4B4B" },
        orange: { DEFAULT: "#FF9600" },
        yellow: { DEFAULT: "#FFC800" },
        "text-main": "#FFFFFF",
        "text-sub": "#8EA1AC",
      },
      maxWidth: {
        app: "520px",
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};
export default config;
