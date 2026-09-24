/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          DEFAULT: "#ffffff", // Pure white for background
          deep: "#f8fafc",   // Slate-50 for subtle off-white
          light: "#f1f5f9",  // Slate-100 for panel backgrounds
        },
        paper: {
          DEFAULT: "#0f172a", // Slate-900 for main text
          dim: "#475569",     // Slate-600 for muted text
        },
        verdigris: {
          DEFAULT: "#2563eb", // Vibrant Blue
          light: "#60a5fa",
        },
        brass: {
          DEFAULT: "#f59e0b", // Amber/Gold
          light: "#fbbf24",
        },
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      animation: {
        blob: "blob 10s infinite",
        "pulse-glow": "pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: 1, boxShadow: "0 0 15px 0px rgba(37, 99, 235, 0.4)" },
          "50%": { opacity: .7, boxShadow: "0 0 5px 0px rgba(37, 99, 235, 0.1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        }
      }
    },
  },
  plugins: [],
};
