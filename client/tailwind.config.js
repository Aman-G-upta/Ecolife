export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    // Add this into the `theme.extend` block of your existing tailwind.config.js
    extend: {
      colors: {
        eco: {
          bg: "#F4F7F1",
          surface: "#FFFFFF",
          ink: "#16241C",
          inkSoft: "#52796F",
          primary: "#1B4332",
          primaryDeep: "#10281D",
          gold: "#D9A544",
          rust: "#C1502E",
          ringTrack: "#E3E9DE",
          border: "#E1E8DC",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      keyframes: {
        rise: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "100% 0" },
          "100%": { backgroundPosition: "-100% 0" },
        },
      },
      animation: {
        rise: "rise 0.5s ease forwards",
        shimmer: "shimmer 1.4s ease infinite",
      },
    },
  },
  plugins: [],
}