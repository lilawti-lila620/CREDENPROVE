/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          DEFAULT: "#0d0221", // Deep cosmic violet
          deep: "#070113",
          light: "#1a0b36",
        },
        paper: {
          DEFAULT: "#ffffff",
          dim: "#b3b3b3",
        },
        verdigris: {
          DEFAULT: "#00f3ff", // Neon Cyan
          light: "#5ce1e6",
        },
        brass: {
          DEFAULT: "#ff00a0", // Hot Pink
          light: "#ff4db8",
        },
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      animation: {
        blob: "blob 7s infinite",
        "pulse-glow": "pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: 1, boxShadow: "0 0 15px 0px rgba(0, 243, 255, 0.7)" },
          "50%": { opacity: .7, boxShadow: "0 0 5px 0px rgba(0, 243, 255, 0.2)" },
        }
      }
    },
  },
  plugins: [],
};
