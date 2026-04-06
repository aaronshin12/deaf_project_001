import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FAF6F0",
        "bg-warm": "#F3ECE2",
        card: "#FFFFFF",
        "card-border": "#E8E0D4",
        accent: { DEFAULT: "#D97757", dark: "#C4623F", light: "#F0B8A0" },
        sage: { DEFAULT: "#5B8C6F", dark: "#4A7A5E", light: "#E8F0EB" },
        clay: { DEFAULT: "#C4956A", light: "#F5E6D3" },
        warm: { DEFAULT: "#8B7355", light: "#A8957D" },
        red: { DEFAULT: "#D44532" },
        "text-main": "#2D2B2A",
        "text-sub": "#7A7168",
        "text-light": "#A69E94",
      },
      fontFamily: {
        sans: [
          '"Pretendard"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
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
