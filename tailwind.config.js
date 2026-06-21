/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#08080f",
        surface: "#0e0e1a",
        "surface-raised": "#14141f",
        border: "#1f1f30",
        accent: {
          DEFAULT: "#c84b0e",
          hover: "#e8531a",
        },
        text: {
          primary: "#f0f0f5",
          secondary: "#7a7a99",
          muted: "#44445a",
        },
        severity: {
          critical: "#ff3333",
          high: "#ff7700",
          medium: "#ffbb00",
          low: "#3388ff",
          info: "#33bbff",
          success: "#33dd77",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Menlo", "Consolas", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
