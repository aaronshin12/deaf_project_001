import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F5F0FA",
        "bg-warm": "#EDE6F5",
        card: "#FFFFFF",
        "card-border": "#E2DAF0",
        accent: { DEFAULT: "#7C5CFC", dark: "#5A3ED9", light: "#B8A5FF" },
        sage: { DEFAULT: "#5B8C6F", dark: "#4A7A5E", light: "#E8F0EB" },
        clay: { DEFAULT: "#C4956A", light: "#F5E6D3" },
        warm: { DEFAULT: "#8B7355", light: "#A8957D" },
        red: { DEFAULT: "#D44532" },
        "text-main": "#1A1625",
        "text-sub": "#6B6280",
        "text-light": "#9B93AD",
        "header-from": "#2D1B69",
        "header-via": "#1E2A5E",
        "header-to": "#162447",
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
      boxShadow: {
        'card': '0 2px 8px rgba(124, 92, 252, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(124, 92, 252, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(124, 92, 252, 0.15)',
        'search': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'search-focus': '0 4px 24px rgba(124, 92, 252, 0.2), 0 0 0 2px rgba(124, 92, 252, 0.15)',
      },
    },
  },
  plugins: [],
};
export default config;
