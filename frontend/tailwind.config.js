/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vedic: {
          ivory: "#FDFBF7",
          cream: "#F7F2E7",
          parchment: "#EFE6D5",
          sand: "#D8C7A5",
          gold: {
            light: "#F7DF94",
            DEFAULT: "#D4AF37",
            dark: "#A67C1E",
            deep: "#7C580F",
          },
          midnight: "#0F0B1E",
          cosmic: "#191233",
          mystic: "#25184B",
          amethyst: "#3B236E",
          ruby: "#881B2C",
          copper: "#B85D26",
          emerald: "#1B5E3F",
        },
      },
      fontFamily: {
        serif: ["Cinzel", "Georgia", "Cambria", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        gold: "0 4px 20px -2px rgba(212, 175, 55, 0.25)",
        cosmic: "0 10px 30px -5px rgba(15, 11, 30, 0.4)",
      },
    },
  },
  plugins: [],
};
